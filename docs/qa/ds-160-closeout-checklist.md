# DS-160 closeout checklist

## Automated

- [ ] `npm run db:generate`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run format:check`
- [ ] `npm run test`
- [ ] `npm run build`

## Responsive and bilingual

- [ ] Desktop FR
- [ ] Desktop EN
- [ ] Tablet FR
- [ ] Tablet EN
- [ ] Mobile FR
- [ ] Mobile EN
- [ ] No global horizontal overflow
- [ ] Long French error and empty-state copy remains readable

## Route states

- [ ] Tokens loading, error, no token sets, empty set and invalid data
- [ ] Themes loading, error and no-theme state
- [ ] Components loading, error and empty registry
- [ ] Accessibility loading, error and no-issue state
- [ ] Documentation loading and error
- [ ] Exports loading and error
- [ ] AI Instructions loading and error
- [ ] Settings loading and error

## Accessibility and keyboard

- [ ] Loading status is announced once per route
- [ ] Skeletons are hidden from assistive technology
- [ ] Retry buttons are keyboard reachable
- [ ] Enter and Space activate retry buttons
- [ ] No skeleton is focusable
- [ ] Existing Tokens navigation remains usable
- [ ] Existing Themes arrow, Home and End navigation remains usable
- [ ] Existing Components compact navigation remains usable

## Critical path

- [ ] Edit a token
- [ ] Edit a theme mapping
- [ ] Edit a component contract
- [ ] Inspect an accessibility issue
- [ ] Save an accessibility report
- [ ] Generate, copy and download Documentation
- [ ] Preview, copy and download an Export
- [ ] Update and save AI Instructions preferences
- [ ] Open Settings

## Final

- [ ] Visual QA approved
- [ ] Keyboard smoke test approved
- [ ] Critical-path smoke test approved
- [ ] Quality workflow green
