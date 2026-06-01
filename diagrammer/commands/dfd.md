---
description: Draw a Data Flow Diagram (DFD) from a description.
argument-hint: <system + level, e.g. "ordering system, context + level 1">
---
Use the **diagrammer** skill. Draw a **Data Flow Diagram** for: $ARGUMENTS

Confirm the level (Context/0 vs Level-1) if not stated. Use correct DFD notation:
external entity (rectangle), process (circle / rounded box, **numbered**), data store
(open box / cylinder), and **labeled** data flows. Default to Graphviz (`.dot`) or
PlantUML (`.puml`). Write the source to a file, show it fenced, then render with
`scripts/render`. Keep flows balanced across levels.
