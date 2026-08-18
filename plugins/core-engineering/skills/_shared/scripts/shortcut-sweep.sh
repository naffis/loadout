#!/usr/bin/env bash
# Mechanical no-shortcuts receipt. Quote the RECEIPT block in flight reports.
# Usage:
#   shortcut-sweep.sh              # git status --porcelain paths
#   shortcut-sweep.sh <path>...    # explicit session-owned files
# Compatible with macOS bash 3.2 (no mapfile).
set -eu
# No pipefail: `rg | head` SIGPIPEs under pipefail and aborts the receipt.

# Cursor skill scripts have no pinned cwd (forum 2026). Always git-root.
_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

is_text() {
  case "$1" in
    *.png|*.jpg|*.jpeg|*.gif|*.webp|*.mp4|*.webm|*.mov|*.woff|*.woff2|*.ttf|*.ico|*.pdf|*.zip)
      return 1
      ;;
  esac
  [[ -f "$1" ]]
}

collect_paths() {
  if [[ $# -gt 0 ]]; then
    printf '%s\n' "$@"
    return
  fi
  git status --porcelain | awk '{
    path = $2
    if ($1 ~ /R|C/ && NF >= 3) path = $NF
    print path
  }'
}

PATHS=""
while IFS= read -r line; do
  [[ -z "$line" ]] && continue
  PATHS="${PATHS}${line}"$'\n'
done < <(collect_paths "$@" | sort -u)

FILE_COUNT=0
EXISTING=""
echo "RECEIPT"
while IFS= read -r p; do
  [[ -z "$p" ]] && continue
  FILE_COUNT=$((FILE_COUNT + 1))
  echo "file: $p"
  if is_text "$p"; then
    EXISTING="${EXISTING}${p}"$'\n'
  fi
done <<< "$PATHS"

echo "files: ${FILE_COUNT}"
if [[ "$FILE_COUNT" -eq 0 ]]; then
  echo "note: no paths from git status or args — sweep N/A"
  echo "END"
  exit 0
fi

if ! command -v rg >/dev/null 2>&1; then
  echo "pattern: rg-missing → install ripgrep"
  echo "hits_total: unknown"
  echo "END"
  exit 0
fi

HITS_TOTAL=0
run_pat() {
  local id="$1"
  local re="$2"
  local args=()
  while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    args+=("$f")
  done <<< "$EXISTING"
  local count=0
  if [[ ${#args[@]} -gt 0 ]]; then
    count="$(rg -n --no-heading -e "$re" -- "${args[@]}" 2>/dev/null | wc -l | tr -d ' ')"
  fi
  echo "pattern: ${id} → ${count}"
  if [[ "$count" -gt 0 ]]; then
    rg -n --no-heading -e "$re" -- "${args[@]}" 2>/dev/null | head -n 20 || true
    HITS_TOTAL=$((HITS_TOTAL + count))
  fi
}

run_pat "todo_fixme" 'TODO|FIXME|HACK|XXX'
run_pat "deferral_prose" 'for now|implement this|handle later|as a follow-up'
run_pat "ts_any" '\bas any\b|as unknown as'
run_pat "ts_suppress" '@ts-ignore|@ts-expect-error'
run_pat "swallowed_catch" 'catch \(\) \{\s*\}|catch \([^)]*\) \{\s*return null'
run_pat "zod_v3" 'from ["'\'']zod["'\'']'
run_pat "test_disabled" '\.(only|skip)\('
run_pat "eslint_disable" 'eslint-disable'

echo "hits_total: ${HITS_TOTAL}"
echo "END"
exit 0
