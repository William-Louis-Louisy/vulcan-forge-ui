# DS-160-01 — UI foundations extraction

## Objective

Extract the visible UI foundations from the mockup before changing shared UI primitives.

This ticket does not redesign full pages yet.
It defines the visual target for typography, colors, density, radius, cards, buttons, pills, fields, save states and locale controls.

The implementation goal is:

> Align the application UI foundations as closely as possible with the mockup, then reuse those foundations across the DS-160 page refactors.

## Source

Mockup section: Brand / Type system / Color system / Component foundations.

## 1. Brand foundation

| Mockup foundation |                   Observed value / style | Current app equivalent    | Target implementation                                                           |
| ----------------- | ---------------------------------------: | ------------------------- | ------------------------------------------------------------------------------- |
| Product name      |                           VulcanForge UI | App logo / brand lockup   | Keep consistent wordmark treatment across shell, auth, public and project pages |
| Logo mark         | Minimal triangular forge/anvil-like mark | App icon / brand mark     | Use as compact sidebar/app mark                                                 |
| Wordmark emphasis |                   “Forge” in clay accent | Brand styling             | Use clay accent only for brand emphasis, not random UI highlights               |
| Inverse logo      |        Light mark/text on dark pill/card | Dark shell/header variant | Ensure logo works on both light and dark surfaces                               |

## 2. Type system

| Token / role | Weight / size / line-height | Font           | Usage target                                      |
| ------------ | --------------------------: | -------------- | ------------------------------------------------- |
| Display 1    |           600 / 64px / 1.02 | Fraunces       | Marketing hero, rare major product statements     |
| Display 2    |           600 / 48px / 1.05 | Fraunces       | Secondary hero / large editorial headings         |
| Heading 1    |           600 / 32px / 1.15 | Inter Tight    | Main app page title                               |
| Heading 2    |           600 / 22px / 1.25 | Inter Tight    | Section title / panel title                       |
| Heading 3    |           600 / 16px / 1.30 | Inter Tight    | Card title / compact section title                |
| Body         |           400 / 14px / 1.50 | Inter Tight    | Standard UI copy                                  |
| Label        |           500 / 12px / 1.40 | Inter Tight    | Field labels, metadata, tabs, small UI labels     |
| Mono         |         400 / 12.5px / 1.40 | JetBrains Mono | Token paths, code-like values, technical metadata |

### Type implementation target

Define shared typography primitives before page refactors:

| UI primitive   | Target type role             |
| -------------- | ---------------------------- |
| Page eyebrow   | Label, uppercase, tracked    |
| Page title     | Heading 1                    |
| Section title  | Heading 2                    |
| Card title     | Heading 3                    |
| Body copy      | Body                         |
| Helper text    | Body, secondary color        |
| Metadata label | Label                        |
| Token path     | Mono                         |
| Button label   | Label or Body depending size |
| Badge label    | Label                        |

### Type rules

- Do not invent typography per page.
- Use Fraunces sparingly for brand/editorial moments.
- Use Inter Tight for app UI.
- Use JetBrains Mono for token paths and technical values.
- Preserve readable density: compact but not cramped.

## 3. Color system

### Primitive · Stone

| Token     |     Value | Target role                         |
| --------- | --------: | ----------------------------------- |
| stone.50  | `#FAF8F3` | App background / warm canvas        |
| stone.100 | `#F4F1EA` | Subtle surface                      |
| stone.150 | `#ECE8DE` | Muted surface                       |
| stone.200 | `#E3DDD0` | Border / divider surface            |
| stone.300 | `#C9C0AC` | Stronger border / disabled tone     |
| stone.400 | `#9C9686` | Tertiary content                    |
| stone.500 | `#6E695D` | Secondary content                   |
| stone.600 | `#4A463D` | Muted dark content                  |
| stone.700 | `#2F2C26` | Strong dark surface                 |
| stone.800 | `#1F1D19` | Primary dark surface                |
| stone.900 | `#141310` | Main dark text / inverse background |

### Primitive · Clay

| Token    |     Value | Target role                  |
| -------- | --------: | ---------------------------- |
| clay.50  | `#FBEFE8` | Accent subtle background     |
| clay.100 | `#F5DDC5` | Accent soft surface          |
| clay.300 | `#E29773` | Accent hover / soft emphasis |
| clay.500 | `#C96442` | Primary accent               |
| clay.600 | `#A94E2F` | Accent pressed / strong      |
| clay.700 | `#823920` | Accent dark                  |

### Status colors

| Token     |     Value | Target role                     |
| --------- | --------: | ------------------------------- |
| ink.500   | `#2563B8` | Informational / link-like state |
| moss.500  | `#3F7A4F` | Success / stable                |
| amber.500 | `#B1781F` | Warning / draft / saving        |
| rust.500  | `#B43A2A` | Error / failed / destructive    |

### Semantic color targets

| Semantic role             | Target primitive                    |
| ------------------------- | ----------------------------------- |
| app background            | stone.50                            |
| surface primary           | white or stone.50 depending context |
| surface secondary         | stone.100                           |
| surface subtle            | stone.150                           |
| border subtle             | stone.200                           |
| border strong             | stone.300                           |
| content primary           | stone.900                           |
| content secondary         | stone.500 / stone.600               |
| content tertiary          | stone.400                           |
| action primary background | stone.900                           |
| action primary foreground | stone.50                            |
| action accent background  | clay.500                            |
| action accent foreground  | stone.50                            |
| danger                    | rust.500                            |
| warning                   | amber.500                           |
| success                   | moss.500                            |
| info                      | ink.500                             |

### Color implementation target

Before page-level refactors, compare the current app tokens/classes to the mockup color system.

Create or map semantic roles for:

- background app;
- surface primary;
- surface secondary;
- surface subtle;
- border subtle;
- border strong;
- content primary;
- content secondary;
- content tertiary;
- primary action;
- accent action;
- danger;
- warning;
- success;
- info;
- focus ring.

## 4. Radius system

| Mockup pattern         | Observed style              | Target implementation                   |
| ---------------------- | --------------------------- | --------------------------------------- |
| Small controls         | rounded small pills/buttons | Shared small radius token               |
| Inputs                 | rounded rectangular fields  | Shared input radius                     |
| Cards / panels         | soft rounded panels         | Shared card/panel radius                |
| Large preview surfaces | larger rounded containers   | Shared panel radius, not one-off values |

### Radius rule

The app should use a limited radius scale instead of arbitrary per-component values.

Suggested roles:

- `radius.sm` — badges, small controls;
- `radius.md` — buttons, inputs;
- `radius.lg` — cards;
- `radius.xl` — large panels / preview blocks.

## 5. Spacing and density

| Mockup pattern | Observed style               | Target implementation     |
| -------------- | ---------------------------- | ------------------------- |
| Page sections  | generous vertical separation | Shared section spacing    |
| Tables/lists   | compact dense rows           | Reusable list row density |
| Cards          | clear internal padding       | Shared card padding       |
| Form groups    | compact but readable         | Shared form field spacing |
| Sidebar/nav    | dense navigation             | Shared nav item spacing   |

### Density rule

The mockup is not “large dashboard spacing”.
It is compact, editorial, and precise.

Target:

- dense but readable lists;
- clear card boundaries;
- no oversized vertical gaps in app screens;
- consistent panel padding.

## 6. Component foundations

### Buttons

| Variant   | Mockup behavior                 | Target implementation                |
| --------- | ------------------------------- | ------------------------------------ |
| Primary   | dark background, light text     | Main action button                   |
| Accent    | clay background, light text     | Secondary product action / highlight |
| Secondary | light background, subtle border | Neutral secondary action             |
| Ghost     | text-only / minimal surface     | Low emphasis action                  |
| Small     | compact control                 | Dense toolbar action                 |
| Large     | wider button with icon/arrow    | Primary CTA / preview action         |

Button rules:

- Use clear variant names.
- Do not hardcode per page.
- Preserve disabled, hover, focus and loading states.
- Use clay only for intentional accent actions.

### Pills / badges

| Variant | Mockup behavior        | Target implementation     |
| ------- | ---------------------- | ------------------------- |
| Default | neutral subtle pill    | Metadata / default status |
| Accent  | clay subtle pill       | Highlighted metadata      |
| Stable  | green/moss subtle pill | Success / stable state    |
| Draft   | amber subtle pill      | Draft / warning state     |
| Failed  | rust subtle pill       | Error / failed state      |
| Beta    | dark pill              | Product flag / beta flag  |

Badge rules:

- Use status colors consistently.
- Use small label typography.
- Keep badges compact.

### Inputs

| Pattern          | Mockup behavior                       | Target implementation      |
| ---------------- | ------------------------------------- | -------------------------- |
| Normal field     | rounded, subtle border, light surface | Shared input primitive     |
| Token path field | mono value                            | Token-specific field style |
| Required error   | rust border and helper label          | Shared invalid state       |
| Labels           | compact label above field             | Shared form label style    |

Input rules:

- Labels are mandatory for editable fields.
- Error state must be visible through border + text.
- Token/code values should use mono typography.

### Save state

| State          | Mockup behavior     | Target implementation   |
| -------------- | ------------------- | ----------------------- |
| Saved          | moss dot + label    | Success state           |
| Saving         | amber dot + label   | Pending state           |
| Unsaved        | neutral dot + label | Dirty state             |
| Keyboard hints | small keycaps       | Optional shortcut hints |

Save state rules:

- Shared component for saved/saving/unsaved.
- Do not duplicate wording or styles across pages.

### Locale control

| Pattern        | Mockup behavior         | Target implementation  |
| -------------- | ----------------------- | ---------------------- |
| Locale switch  | segmented FR/EN control | Shared locale switcher |
| Active state   | dark filled segment     | Clear active state     |
| Inactive state | light segment           | Subtle inactive option |

Locale rules:

- Every project-level screen must preserve FR/EN behavior.
- No hardcoded visible English in project screens.

## 7. Current app comparison checklist

During DS-160-01 implementation, compare existing UI primitives against the extracted foundations:

| Area            | Current app equivalent                     | Action                                          |
| --------------- | ------------------------------------------ | ----------------------------------------------- |
| Button          | `src/components/ui/Button.tsx`             | Align variants, density, radius, focus          |
| Cards / panels  | Existing card/panel markup across pages    | Extract or standardize if duplicated            |
| Badges          | Status badges across project routes        | Align badge variants                            |
| Inputs          | Existing form inputs in feature components | Align field radius, border, label, error states |
| Tabs            | Token/component tabs                       | Align selected/inactive states                  |
| Notices         | Warning/empty/incomplete notices           | Align tone and density                          |
| Locale controls | Existing locale switcher/buttons           | Align segmented style                           |
| Token paths     | Existing mono/token values                 | Ensure mono typography                          |

## 8. Implementation rules for DS-160-01

- Extract foundations before editing pages.
- Prefer semantic roles over raw colors.
- Prefer shared primitives over one-off markup.
- Do not change product logic.
- Do not break DS-150 work.
- Preserve FR/EN.
- Preserve keyboard accessibility.
- Run quality checks before merge.

## 9. Definition of done

DS-160-01 is done when:

- this extraction is documented;
- type roles are mapped to implementation targets;
- color roles are mapped to semantic targets;
- reusable primitive targets are listed;
- the next implementation ticket can start from a stable visual foundation;
- no page-level redesign has been started prematurely.
