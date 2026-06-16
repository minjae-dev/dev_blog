---
name: Toast UI React Editor + React 18
description: @toast-ui/react-editor causes "Invalid hook call" warning under React 18 but still renders correctly.
---

The `@toast-ui/react-editor@3.1.8` package was built targeting React 17 and produces a "Warning: Invalid hook call" console error when used with React 18. Despite this warning, the editor component renders and functions correctly (toolbar, write/preview tabs, markdown input all work).

**Why:** The package's peer dependency is `react@^17.0.1`. It was installed with `--legacy-peer-deps` to force compatibility with React 18. The hook call warning is logged but not fatal.

**How to apply:** Do not attempt to suppress this by deduplicating React or adding webpack aliases — those approaches can break the editor. Accept the warning as a known limitation of using this older editor package with React 18.
