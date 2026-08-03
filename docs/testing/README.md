# Test documentation

## Tester onboarding

Use the following document before starting the DS-170-08 final user journey:

- [VulcanForge UI — Guide d’utilisation pour les testeurs](./vulcanforge-ui-guide-testeurs.fr.md)

The guide is written for people who may be unfamiliar with design systems. In addition to the application journey, it explains the purpose of editable fields, what information is expected, where each value is reused and how testers can verify its effect.

Before distributing the guide, complete its environment-specific information: test URL, supported browsers, test account, support contact, issue-reporting location and any shared dataset that must not be modified.

## PDF edition

A styled A4 PDF is generated from the Markdown source with the VulcanForge UI color system, a cover page, a clickable table of contents, PDF bookmarks, running section headers and page numbers.

Install the generator dependencies, then run:

```bash
python -m pip install markdown==3.8.2 weasyprint==66.0
python scripts/docs/generate_tester_guide_pdf.py
```

The generated file is written to:

```text
dist/testing-guide/VulcanForge-UI-Guide-Testeurs-v1.1.pdf
```

The `Build tester guide PDF` GitHub Actions workflow also produces the PDF as a downloadable workflow artifact whenever the guide, stylesheet or generator changes. Workflow artifacts are temporary distribution files; the Markdown source, stylesheet and generator remain the durable version-controlled sources.
