#!/usr/bin/env bash
# Mechanical failure-path seed sweep. Quote RECEIPT. Hits are seeds, not bugs.
# Usage: failure-path-sweep.sh <path...>
# Compatible with macOS bash 3.2. No pipefail.
set -eu

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

is_code() {
  case "$1" in
    *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.py|*.go|*.rs|*.rb|*.java|*.kt|*.swift|*.cs|*.php|*.astro) ;;
    *) return 1 ;;
  esac
  [[ -f "$1" ]]
}

collect_paths() {
  if [[ $# -lt 1 ]]; then
    git status --porcelain | awk '{
      path = $2
      if ($1 ~ /R|C/ && NF >= 3) path = $NF
      print path
    }'
    return
  fi
  for p in "$@"; do
    if [[ -f "$p" ]]; then
      printf '%s\n' "$p"
    elif [[ -d "$p" ]]; then
      find "$p" -type f \
        ! -path '*/node_modules/*' \
        ! -path '*/dist/*' \
        ! -path '*/coverage/*' \
        ! -path '*/.git/*' \
        ! -path '*/.next/*' \
        ! -path '*/.turbo/*' \
        ! -path '*/vendor/*' \
        2>/dev/null
    else
      echo "missing: $p" >&2
    fi
  done
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
  is_code "$p" || continue
  FILE_COUNT=$((FILE_COUNT + 1))
  echo "file: $p"
  EXISTING="${EXISTING}${p}"$'\n'
done <<< "$PATHS"

echo "files: ${FILE_COUNT}"
if [[ "${FILE_COUNT}" -eq 0 ]]; then
  echo "note: no paths — pass a directory or file"
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

run_pat "catch" 'catch\s*\('
run_pat "empty_catch" 'catch\s*\([^)]*\)\s*\{\s*\}'
run_pat "catch_return_null" 'catch\s*\([^)]*\)\s*\{\s*return null'
run_pat "promise_catch_empty" '\.catch\(\s*\(\)\s*=>'
run_pat "coalesce_empty_array" '\?\? \[\]|\|\| \[\]'
run_pat "return_undefined" 'return undefined'
run_pat "as_any" '\bas any\b|as unknown as'
run_pat "ts_suppress" '@ts-ignore|@ts-expect-error'
run_pat "todo_fixme" 'TODO|FIXME|HACK|XXX'
run_pat "fail_open" 'fail-open|failOpen|fail_open'
run_pat "abort" 'AbortSignal|AbortController|\.abort\('
run_pat "timeout" 'timeout\(|AbortSignal\.timeout'
run_pat "safeParse" 'safeParse\('
run_pat "promise_all" 'Promise\.all\('
run_pat "void_fetch" 'void fetch\('
run_pat "empty_then" '\.then\(\s*\(\)\s*=>'

echo "hits_total: ${HITS_TOTAL}"
echo "END"
exit 0
