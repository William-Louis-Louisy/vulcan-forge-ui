from __future__ import annotations

import argparse
import html
import re
from pathlib import Path

import markdown
from weasyprint import CSS, HTML


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description='Generate the styled VulcanForge UI tester guide PDF.',
    )
    parser.add_argument(
        '--source',
        type=Path,
        default=Path('docs/testing/vulcanforge-ui-guide-testeurs.fr.md'),
    )
    parser.add_argument(
        '--stylesheet',
        type=Path,
        default=Path('docs/testing/vulcanforge-ui-guide-pdf.css'),
    )
    parser.add_argument(
        '--output',
        type=Path,
        default=Path('dist/testing-guide/VulcanForge-UI-Guide-Testeurs-v1.1.pdf'),
    )
    return parser.parse_args()


def normalize_heading_hierarchy(markdown_source: str) -> str:
    normalized_lines: list[str] = []

    for line in markdown_source.splitlines():
        if re.match(r'^##\s+\d+\.\d+(?:\.\d+)*\s+', line):
            normalized_lines.append('#' + line)
        elif line.startswith('### '):
            normalized_lines.append('#' + line)
        elif line.startswith('#### '):
            normalized_lines.append('#' + line)
        else:
            normalized_lines.append(line)

    return '\n'.join(normalized_lines)


def extract_document_parts(source: str) -> tuple[str, dict[str, str], str, str]:
    lines = source.splitlines()
    title = lines[0].removeprefix('# ').strip()
    metadata: dict[str, str] = {}
    intro_lines: list[str] = []
    body_start = 0

    for index, line in enumerate(lines[1:], start=1):
        if line.strip() == '---':
            body_start = index + 1
            break

        match = re.match(r'^\*\*(.+?)\s*:\*\*\s*(.+?)\s{0,2}$', line)
        if match:
            metadata[match.group(1).strip()] = match.group(2).strip()
        elif line.startswith('> '):
            intro_lines.append(line[2:])
        elif line.strip() and not line.startswith('**'):
            intro_lines.append(line)

    intro_markdown = '\n\n'.join(intro_lines)
    body_markdown = '\n'.join(lines[body_start:]).strip()
    return title, metadata, intro_markdown, body_markdown


def render_markdown(markdown_source: str) -> str:
    return markdown.markdown(
        markdown_source,
        extensions=['extra', 'toc', 'sane_lists', 'smarty'],
        extension_configs={
            'toc': {
                'title': 'Sommaire',
                'toc_depth': '2-3',
                'permalink': False,
            }
        },
        output_format='html5',
    )


def build_html(
    *,
    title: str,
    metadata: dict[str, str],
    intro_html: str,
    body_html: str,
) -> str:
    display_title = title.replace('VulcanForge UI — ', '')

    return f'''<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <title>{html.escape(title)}</title>
  </head>
  <body>
    <section class="cover">
      <div class="cover-inner">
        <div class="brand-lockup">
          <span class="forge-mark" aria-hidden="true"></span>
          <span>VULCANFORGE UI</span>
        </div>

        <div class="cover-main">
          <p class="cover-kicker">Documentation de test</p>
          <h1>{html.escape(display_title)}</h1>
          <p class="cover-subtitle">
            Comprendre l'application, renseigner chaque champ avec intention
            et vérifier les effets produits.
          </p>
          <div class="cover-rule"></div>
          <div class="cover-intro">{intro_html}</div>
        </div>

        <div class="cover-meta">
          <div class="meta-item">
            <span class="meta-label">Version</span>
            <span class="meta-value">{html.escape(metadata.get('Version du guide', '1.1'))}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Date</span>
            <span class="meta-value">{html.escape(metadata.get('Date', '3 août 2026'))}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Périmètre</span>
            <span class="meta-value">{html.escape(metadata.get('Périmètre', 'VulcanForge UI'))}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Public</span>
            <span class="meta-value">{html.escape(metadata.get('Public', 'Testeurs et parties prenantes'))}</span>
          </div>
        </div>
      </div>
    </section>

    <main>{body_html}</main>
  </body>
</html>'''


def main() -> None:
    args = parse_args()
    source = args.source.read_text(encoding='utf-8')
    title, metadata, intro_markdown, body_markdown = extract_document_parts(source)

    normalized_body = normalize_heading_hierarchy(body_markdown)
    body_html = render_markdown('[TOC]\n\n' + normalized_body)
    intro_html = markdown.markdown(
        intro_markdown,
        extensions=['extra', 'smarty'],
        output_format='html5',
    )

    args.output.parent.mkdir(parents=True, exist_ok=True)
    document_html = build_html(
        title=title,
        metadata=metadata,
        intro_html=intro_html,
        body_html=body_html,
    )

    HTML(string=document_html, base_url=str(Path.cwd())).write_pdf(
        args.output,
        stylesheets=[CSS(filename=args.stylesheet)],
        presentational_hints=True,
    )

    print(f'Generated {args.output} ({args.output.stat().st_size} bytes)')


if __name__ == '__main__':
    main()
