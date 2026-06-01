#!/usr/bin/env bash
# Render a diagram source file to SVG/PNG using a local renderer.
# Usage: render.sh <file> [svg|png] [--allow-remote]
#   .mmd/.mermaid       -> mermaid-cli (mmdc)
#   .puml/.plantuml/.pu -> plantuml CLI, or java -jar $PLANTUML_JAR
#   .dot/.gv            -> graphviz (dot)
# Without a local renderer, pass --allow-remote to use kroki.io (sends source remotely).
set -euo pipefail

FILE="${1:?usage: render.sh <file> [svg|png] [--allow-remote]}"
FMT="${2:-svg}"
ALLOW_REMOTE="${3:-}"

[ -f "$FILE" ] || { echo "Input not found: $FILE" >&2; exit 1; }
ext="$(printf '%s' "${FILE##*.}" | tr '[:upper:]' '[:lower:]')"
out="${FILE%.*}.$FMT"
have(){ command -v "$1" >/dev/null 2>&1; }

kroki(){ # $1 = kroki type
  if [ "$ALLOW_REMOTE" = "--allow-remote" ]; then
    curl -sf -X POST "https://kroki.io/$1/$FMT" \
      -H 'Content-Type: text/plain' --data-binary @"$FILE" -o "$out"
    echo "Rendered via kroki.io ($1) -> $out  [remote]"
  else
    echo "Renderer for .$ext not found. Install it, or re-run with --allow-remote to use kroki.io (sends source over the network)." >&2
    exit 2
  fi
}

case "$ext" in
  mmd|mermaid)
    if have mmdc; then mmdc -i "$FILE" -o "$out"; echo "Rendered (mermaid) -> $out"
    else echo "mermaid-cli not found: npm install -g @mermaid-js/mermaid-cli" >&2; kroki mermaid; fi ;;
  puml|plantuml|pu)
    if have plantuml; then plantuml -t"$FMT" "$FILE"; echo "Rendered (plantuml) -> ${FILE%.*}.$FMT"
    elif [ -n "${PLANTUML_JAR:-}" ] && have java; then java -jar "$PLANTUML_JAR" -t"$FMT" "$FILE"; echo "Rendered (plantuml) -> ${FILE%.*}.$FMT"
    else echo "PlantUML not found: install 'plantuml' CLI or Java + plantuml.jar (\$PLANTUML_JAR)" >&2; kroki plantuml; fi ;;
  dot|gv)
    if have dot; then dot -T"$FMT" "$FILE" -o "$out"; echo "Rendered (graphviz) -> $out"
    else echo "Graphviz not found: choco/brew/apt install graphviz" >&2; kroki graphviz; fi ;;
  *) echo "Unknown type: .$ext (expected .mmd / .puml / .dot)" >&2; exit 1 ;;
esac
