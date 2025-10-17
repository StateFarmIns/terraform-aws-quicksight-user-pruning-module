# Agent Guide

1. Build: `yarn build` (outputs bundled `pruneQuickSightUsers.js`); Dev TS config targets ES5, module esnext.
2. Test all: `yarn test` (Jest + ts-jest). Single test: `jest path/to/file.test.ts -t "test name"` or `jest QuickSightUserManager.test.ts`.
3. Lint/auto-fix: `yarn lint` (eslint --fix on src/*.ts and test/*.test.ts). Indent tabs; LF endings; single quotes; no semicolons; object spacing `{ a: 1 }`; dangle commas multiline.
4. Mutation testing: `yarn mutate` (Stryker). Stryker ignore comments already present; preserve them.
5. Imports: Use absolute AWS SDK v3 client imports (`@aws-sdk/...`); local relative `./FileName`; group: external libs, then local, blank line separation optional.
6. Types: Enable `noImplicitAny`; prefer explicit return types on public methods; use enums (e.g. QuickSightRole); narrow with `keyof typeof` pattern as in QuickSightUser.
7. Naming: Classes PascalCase; methods camelCase; constants lowerCamelCase; environment variables accessed via `process.env.someName` (do not destructure). Avoid single-letter vars.
8. Error handling: Propagate AWS SDK errors (tests assert rejects); do not swallow; throw original (`rejects.toThrowError(error)`). Use early returns over nested conditionals.
9. Async: Always `await client.send(command)`; avoid parallelism unless beneficial; preserve ordering for metrics/user operations.
10. Side effects: Log via `console.debug/info/warn`; keep Stryker disable comments on the line directly above logged statement.
11. State: Keep private members (`private xyz = ...`); avoid global mutable state; reset collections after emission (see CloudWatchMetricClient.emitQueuedMetrics).
12. Formatting: Tabs for indent; no trailing whitespace; multiline JSON.stringify indentation matches existing (2 spaces inside).
13. Tests: Use `aws-sdk-client-mock` for AWS clients; sinon stubs for class methods; snapshots allowed. Fake timers with `jest.useFakeTimers().setSystemTime(...)`.
14. Adding tests: Mirror existing pattern: arrange stubs, act, assert call counts & inputs. Prefer `toStrictEqual` for input objects.
15. Commits: Conventional commits (semantic-release). Do not include build artifacts except required root `pruneQuickSightUsers.js`.
16. Environment logic: Compare dates via `<`, `toLocaleDateString()` for equality by day; treat `new Date(0)` as sentinel.
17. Performance: Small data sets; pagination loops use `do { ... } while (nextToken)`; maintain token semantics ('' for QS, null for CloudTrail).
18. Terraform: Lambda depends on `pruneQuickSightUsers.js` existing; do not rename the file. `delete_readers` variable -> env `deleteReaders`; when false skip READER deletions with debug log.
19. PRs: Link related issue; keep diff minimal; retain logging and Stryker comments.
20. Husky: Pre-commit runs lint; ensure staged code passes lint & tests before committing.