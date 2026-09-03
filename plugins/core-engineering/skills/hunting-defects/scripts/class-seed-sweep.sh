#!/usr/bin/env bash
# Mechanical seeds for hunt classes that have no specialist skill (3–8).
# Quote RECEIPT. Hits are seeds, not bugs.
# Usage: class-seed-sweep.sh <path...>
# Optional overlay: ../references/project-seed-patterns.txt (tab-separated id<TAB>regex).
# Compatible with macOS bash 3.2. No pipefail.
set -eu

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SEED_OVERLAY="${SCRIPT_DIR}/../references/project-seed-patterns.txt"

is_code() {
  case "$1" in
    *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.py|*.go|*.rs|*.rb|*.java|*.kt|*.swift|*.cs|*.php|*.astro) ;;
    *) return 1 ;;
  esac
  case "$1" in
    *.test.ts|*.test.tsx|*.spec.ts|*.spec.js|*.contract.test.ts|*_test.go|*_test.rs|test_*.py|*_test.py) return 1 ;;
  esac
  [[ -f "$1" ]]
}

collect_paths() {
  if [[ $# -lt 1 ]]; then
    echo "RECEIPT"
    echo "note: pass a directory or file"
    echo "END"
    exit 0
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
  echo "note: no product-code files"
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

run_pat "race_map_set" 'new Map\(|new Set\('
run_pat "race_lock" 'Mutex|mutex|forUpdate\(|FOR UPDATE|compareAndSwap|\.cas\b|advisory.?lock|singletonKey'
run_pat "race_updated_at" 'updated_at|updatedAt'
run_pat "contract_safeParse" 'safeParse\('
run_pat "contract_zod_v3" 'from ["'\'']zod["'\'']'
run_pat "trust_html" 'dangerouslySetInnerHTML|innerHTML\s*='
run_pat "trust_eval" '\beval\(|new Function\('
run_pat "idempotency" 'idempotenc|onConflictDoNothing|exactlyOnce|dedup'
run_pat "latch" '\.reserve\(|statusMachine|stateMachine'
run_pat "unawaited_void_fetch" 'void fetch\('
run_pat "promise_all" 'Promise\.all\('

if [[ -f "$SEED_OVERLAY" ]]; then
  echo "overlay: ${SEED_OVERLAY}"
  while IFS="$(printf '\t')" read -r oid ore || [[ -n "${oid:-}" ]]; do
    [[ -z "${oid:-}" ]] && continue
    case "$oid" in
      \#*) continue ;;
    esac
    [[ -z "${ore:-}" ]] && continue
    run_pat "overlay_${oid}" "$ore"
  done < "$SEED_OVERLAY"
else
  echo "overlay: none"
fi

echo "hits_total: ${HITS_TOTAL}"
echo "END"
exit 0
