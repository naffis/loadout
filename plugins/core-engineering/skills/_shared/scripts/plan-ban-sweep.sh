#!/usr/bin/env bash
# Mechanical create-plan / review-plan ban receipt. Quote RECEIPT in reports.
# Usage: plan-ban-sweep.sh <plan.md> [more.md]
# Compatible with macOS bash 3.2. No pipefail (`rg | head` SIGPIPEs).
set -eu

_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

if [[ $# -lt 1 ]]; then
  echo "RECEIPT"
  echo "note: no plan paths — pass workspace .cursor/plans/*.md"
  echo "END"
  exit 0
fi

echo "RECEIPT"
FILE_COUNT=0
EXISTING=""
for p in "$@"; do
  FILE_COUNT=$((FILE_COUNT + 1))
  echo "file: $p"
  if [[ -f "$p" ]]; then
    EXISTING="${EXISTING}${p}"$'\n'
  else
    echo "missing: $p"
  fi
done
echo "files: ${FILE_COUNT}"

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

run_pat "ban_tbd" '\bTBD\b|\bTODO\b|\bFIXME\b|\?\?\?|\bTBC\b'
run_pat "ban_defer" 'figure out during|fill in during|decide during implementation|decide later'
run_pat "ban_followup" 'follow-up PR|nice to have later|out of scope for now'
run_pat "ban_hedge" '\bwe could\b|\bprobably\b|\broughly\b|something like'
run_pat "unsourced_best_practice" 'best practice'

echo "hits_total: ${HITS_TOTAL}"
echo "END"
exit 0
