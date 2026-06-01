---
description: Draw a UML Use Case diagram (PlantUML) from a description.
argument-hint: <what to diagram, e.g. "online bookstore: browse, buy, review">
---
Use the **diagrammer** skill. Draw a **Use Case** diagram in PlantUML for: $ARGUMENTS

Identify actors (nouns) and use cases (verbs), set the system boundary with a
`rectangle`, and use `<<include>>` / `<<extend>>` where flows are shared or conditional.
Write the source to a `.puml` file, show it in a ```plantuml block, then render with
`scripts/render`. If the actors or boundary are unclear, ask one focused question first.
