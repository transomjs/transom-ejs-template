# @transomjs/transom-ejs-template change log

## Unreleased
- **Requires Node.js 22 or newer** (`engines.node` is `>=22`). The compiled code targets ES2023,
  and CI runs on Node 22 and 24.
- Rewritten in TypeScript, with type definitions. The compiled code is in `dist/`;
  `require("@transomjs/transom-ejs-template")` and `.../lib/ejsHandler` return the same
  things as before, and templates are still found in the application's root folder.
- Types: `TemplateOptions`, `RenderOptions`, `TemplateDefinition` (the `definition.template`
  section), `TemplateData` and `Renderer` (the registered renderer).

## 1.2.3
- Updated dependencies to the latest versions & rebuilt the package-lock.json
- Added deploy task to package.json

## earlier
- Working as documented and not previously change-logged.