#!/usr/bin/env bash
# Mechanical lifecycle/leak seed sweep. Quote RECEIPT. Hits are seeds, not bugs.
# Address every imbalance delta>0 in the report (pair or kill).
# Usage: lifecycle-sweep.sh <path...>
# Compatible with macOS bash 3.2. No pipefail (`rg | head` SIGPIPEs).
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

EXISTING=""
FILE_COUNT=0
echo "RECEIPT"
while IFS= read -r p; do
  [[ -z "$p" ]] && continue
  is_code "$p" || continue
  FILE_COUNT=$((FILE_COUNT + 1))
  echo "file: $p"
  EXISTING="${EXISTING}${p}"$'\n'
done < <(collect_paths "$@" | sort -u)

echo "files: ${FILE_COUNT}"
if [[ "${FILE_COUNT}" -eq 0 ]]; then
  echo "note: no product-code files — pass a directory or file"
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

count_only() {
  local re="$1"
  local args=()
  while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    args+=("$f")
  done <<< "$EXISTING"
  if [[ ${#args[@]} -eq 0 ]]; then
    echo 0
    return
  fi
  rg -n --no-heading -e "$re" -- "${args[@]}" 2>/dev/null | wc -l | tr -d ' '
}

emit_imbalance() {
  local name="$1"
  local acq_re="$2"
  local rel_re="$3"
  local a b d
  a="$(count_only "$acq_re")"
  b="$(count_only "$rel_re")"
  d=$((a - b))
  echo "imbalance: ${name} acquire=${a} release=${b} delta=${d}"
}

run_pat "addEventListener" 'addEventListener\('
run_pat "removeEventListener" 'removeEventListener\('
run_pat "setInterval" 'setInterval\('
run_pat "setTimeout" 'setTimeout\('
run_pat "clearInterval" 'clearInterval\('
run_pat "clearTimeout" 'clearTimeout\('
run_pat "EventSource" 'new EventSource\(|EventSource\('
run_pat "WebSocket" 'new WebSocket\('
run_pat "createObjectURL" 'createObjectURL\('
run_pat "revokeObjectURL" 'revokeObjectURL\('
run_pat "AbortController" 'AbortController'
run_pat "subscribe" '\.subscribe\('
run_pat "useEffect" 'useEffect\(|useLayoutEffect\('
run_pat "observer" 'new (Mutation|Intersection|Resize)Observer\('
run_pat "requestAnimationFrame" 'requestAnimationFrame\('
run_pat "cancelAnimationFrame" 'cancelAnimationFrame\('
run_pat "debit_reserve" '\.debit\(|\.reserve\(|idempotencyKey'

echo "hits_total: ${HITS_TOTAL}"
emit_imbalance "addEventListener" 'addEventListener\(' 'removeEventListener\('
emit_imbalance "setInterval" 'setInterval\(' 'clearInterval\('
emit_imbalance "createObjectURL" 'createObjectURL\(' 'revokeObjectURL\('
emit_imbalance "requestAnimationFrame" 'requestAnimationFrame\(' 'cancelAnimationFrame\('
echo "END"
exit 0
