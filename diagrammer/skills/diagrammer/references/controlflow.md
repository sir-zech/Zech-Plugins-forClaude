# Control flow / flowcharts (Mermaid)

Mermaid `flowchart` renders natively in GitHub, Claude artifacts, VS Code (with an
extension), Obsidian, and mermaid.live. Best default for control flow.

## Direction
`flowchart TD` (top-down), `LR` (left-right); also `TB`, `BT`, `RL`.

## Node shapes
```mermaid
flowchart TD
  A[Rectangle: process]
  B([Stadium: start / end])
  C{Diamond: decision}
  D[(Database)]
  E[[Subroutine]]
  F((Circle))
  G[/Parallelogram: I-O/]
  H{{Hexagon: prep}}
```

## Edges
```mermaid
flowchart LR
  A --> B          %% arrow
  B --- C          %% open link
  C -->|label| D   %% labeled
  D -.-> E         %% dotted
  E ==> F          %% thick
```

## Decisions & branches — label every branch
```mermaid
flowchart TD
  S([Start]) --> I[/Read input/]
  I --> V{Valid?}
  V -- no  --> Err[Show error] --> I
  V -- yes --> P[Process]
  P --> Done([End])
```

## Loops
```mermaid
flowchart TD
  Start([Start]) --> Init[i = 0]
  Init --> Check{i < n?}
  Check -- yes --> Body[do work; i++] --> Check
  Check -- no  --> End([Done])
```

## Subgraphs (group / pseudo-swimlane)
```mermaid
flowchart TD
  subgraph Client
    A[Submit form] --> B[Validate]
  end
  subgraph Server
    C[Save] --> D[Respond]
  end
  B --> C
```

## Styling
```mermaid
flowchart TD
  A[OK]:::good --> B[Fail]:::bad
  classDef good fill:#1f7a1f,color:#fff;
  classDef bad  fill:#a11111,color:#fff;
```

## When you need TRUE swimlanes -> PlantUML activity
```plantuml
@startuml
|Customer|
start
:Add to cart;
|System|
if (In stock?) then (yes)
  :Reserve item;
else (no)
  :Notify out of stock;
  stop
endif
|Customer|
:Pay;
|System|
:Confirm order;
stop
@enduml
```
PlantUML activity also supports `fork` / `fork again` / `end fork` for parallel flows and
`repeat` / `repeat while (cond)` for loops.

Render: `render.ps1 -File login.mmd -Format svg` (needs `mmdc`), or render the `.puml`
variant via PlantUML.
