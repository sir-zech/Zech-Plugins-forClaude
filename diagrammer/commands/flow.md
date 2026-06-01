---
description: Draw a control-flow / flowchart (Mermaid) from a description.
argument-hint: <process to diagram, e.g. "user login with 2FA">
---
Use the **diagrammer** skill. Draw a **control flow / flowchart** in Mermaid for: $ARGUMENTS

Use `flowchart TD`, stadium nodes `([...])` for start/end, diamonds `{...}` for decisions,
and label every branch (yes/no). Write the source to a `.mmd` file, show it in a
```mermaid block, then render with `scripts/render`. If branches are unclear, ask one
focused question first.
