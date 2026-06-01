#Requires -Version 5
<#
.SYNOPSIS
  Render a diagram source file to SVG/PNG using a local renderer.
.DESCRIPTION
  Picks the renderer from the file extension:
    .mmd / .mermaid       -> mermaid-cli (mmdc)
    .puml / .plantuml / .pu -> plantuml CLI, or java -jar $env:PLANTUML_JAR
    .dot / .gv            -> graphviz (dot)
  If the local renderer is missing it prints the install command and exits. Pass
  -AllowRemote to instead render via the public kroki.io server (this sends your
  diagram source over the network; off by default).
.EXAMPLE
  pwsh render.ps1 -File login-flow.mmd -Format svg
.EXAMPLE
  pwsh render.ps1 -File order-dfd.dot -Format png -Out diagrams/order.png
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$File,
  [ValidateSet('svg','png')][string]$Format = 'svg',
  [string]$Out,
  [switch]$AllowRemote
)
$ErrorActionPreference = 'Stop'
if (-not (Test-Path $File)) { Write-Error "Input not found: $File"; exit 1 }
$src = (Resolve-Path $File).Path
$ext = [IO.Path]::GetExtension($src).ToLowerInvariant()
if (-not $Out) { $Out = [IO.Path]::ChangeExtension($src, $Format) }

function Have($cmd) { [bool](Get-Command $cmd -ErrorAction SilentlyContinue) }

function Render-Kroki($type) {
  $body = Get-Content -Raw -Path $src
  $uri  = "https://kroki.io/$type/$Format"
  Invoke-WebRequest -Uri $uri -Method Post -Body $body -ContentType 'text/plain' -OutFile $Out | Out-Null
  Write-Host "Rendered via kroki.io ($type) -> $Out  [remote]"
}

function Need($installLine, $krokiType) {
  if ($AllowRemote) { Render-Kroki $krokiType }
  else {
    Write-Error "$installLine`nOr re-run with -AllowRemote to render via kroki.io (sends source over the network)."
    exit 2
  }
}

switch -Regex ($ext) {
  '\.(mmd|mermaid)$' {
    if (Have 'mmdc') { & mmdc -i $src -o $Out; Write-Host "Rendered (mermaid) -> $Out" }
    else { Need "mermaid-cli not found. Install: npm install -g @mermaid-js/mermaid-cli" 'mermaid' }
  }
  '\.(puml|plantuml|pu)$' {
    $jar = $env:PLANTUML_JAR
    if (Have 'plantuml') {
      & plantuml "-t$Format" $src
      Write-Host "Rendered (plantuml) -> $([IO.Path]::ChangeExtension($src,$Format))"
    } elseif ((Have 'java') -and $jar -and (Test-Path $jar)) {
      & java -jar $jar "-t$Format" $src
      Write-Host "Rendered (plantuml) -> $([IO.Path]::ChangeExtension($src,$Format))"
    } else {
      Need "PlantUML not found. Install the 'plantuml' CLI, or Java + plantuml.jar and set `$env:PLANTUML_JAR." 'plantuml'
    }
  }
  '\.(dot|gv)$' {
    if (Have 'dot') { & dot "-T$Format" $src -o $Out; Write-Host "Rendered (graphviz) -> $Out" }
    else { Need "Graphviz not found. Install: choco install graphviz (or brew/apt install graphviz)" 'graphviz' }
  }
  default { Write-Error "Unknown diagram type '$ext'. Expected .mmd / .puml / .dot"; exit 1 }
}
