# Messages

`en.json` is the reference locale.

Rules:

- Every key in `en.json` must exist in `fr.json`.
- Do not hardcode visible UI strings in components.
- Use one namespace per page or reusable component.
- Use `Common` only for truly shared labels, actions, states and validation messages.
- Prefer explicit message keys over generic reusable copy when the context matters.
- Keep placeholders consistent between locales.

Examples:

- `HomePage.title`
- `PublicHeader.signIn`
- `Common.actions.save`
- `Common.validation.required`
