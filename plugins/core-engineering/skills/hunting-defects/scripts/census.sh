#!/usr/bin/env bash
# Mechanical surface census. Quote the RECEIPT. Completeness claims without it
# are skipped work.
# Usage: census.sh <path...>
# Kinds: review (product code) | test | docs | style | skip
# Completeness default = every `review:` line. Do not hunt docs/css unless asked.
# Compatible with macOS bash 3.2 (no mapfile). No pipefail.
set -eu

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"
WAVE_SIZE=30

if [[ $# -lt 1 ]]; then
  echo "RECEIPT"
  echo "note: pass at least one file or directory"
  echo "review_files: 0"
  echo "END"
  exit 0
fi

is_skip() {
  case "$1" in
    *.png|*.jpg|*.jpeg|*.gif|*.webp|*.mp4|*.webm|*.mov|*.woff|*.woff2|*.ttf|*.ico|*.pdf|*.zip|*.map|*.lock|*.min.js|*.d.ts)
      return 0
      ;;
  esac
  case "$1" in
    */node_modules/*|*/dist/*|*/coverage/*|*/.git/*|*/build/*|*/.next/*|*/generated/*|*/.turbo/*|*/out/*|*/target/debug/*|*/target/release/*|*/vendor/*)
      return 0
      ;;
  esac
  return 1
}

kind_of() {
  local f="$1"
  case "$f" in
    *.test.ts|*.test.tsx|*.test.js|*.test.mjs|*.spec.ts|*.spec.tsx|*.spec.js|*.contract.test.ts|*_test.go|*_test.rs|test_*.py|*_test.py|*_spec.rb)
      echo test
      return
      ;;
  esac
  case "$f" in
    *.md|*.mdx) echo docs; return ;;
    *.css) echo style; return ;;
    *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.py|*.go|*.rs|*.rb|*.java|*.kt|*.swift|*.cs|*.php|*.astro)
      echo review
      return
      ;;
  esac
  echo skip
}

collect() {
  local p="$1"
  if [[ -f "$p" ]]; then
    printf '%s\n' "$p"
    return
  fi
  if [[ ! -d "$p" ]]; then
    echo "missing: $p" >&2
    return
  fi
  find "$p" -type f \
    ! -path '*/node_modules/*' \
    ! -path '*/dist/*' \
    ! -path '*/coverage/*' \
    ! -path '*/.git/*' \
    ! -path '*/build/*' \
    ! -path '*/.next/*' \
    ! -path '*/.turbo/*' \
    ! -path '*/out/*' \
    ! -path '*/vendor/*' \
    2>/dev/null
}

ALL=""
for arg in "$@"; do
  while IFS= read -r f; do
    [[ -z "$f" ]] && continue
    ALL="${ALL}${f}"$'\n'
  done < <(collect "$arg")
done

REVIEW=0
TEST=0
DOCS=0
STYLE=0
SKIP=0
LINES=0

echo "RECEIPT"
while IFS= read -r f; do
  [[ -z "$f" ]] && continue
  if is_skip "$f"; then
    echo "skip: $f"
    SKIP=$((SKIP + 1))
    continue
  fi
  k="$(kind_of "$f")"
  if [[ "$k" == "skip" ]]; then
    echo "skip: $f"
    SKIP=$((SKIP + 1))
    continue
  fi
  n="$(wc -l < "$f" | tr -d ' ')"
  echo "${k}: $f  lines: $n"
  case "$k" in
    review) REVIEW=$((REVIEW + 1)); LINES=$((LINES + n)) ;;
    test) TEST=$((TEST + 1)) ;;
    docs) DOCS=$((DOCS + 1)) ;;
    style) STYLE=$((STYLE + 1)) ;;
  esac
done < <(printf '%s' "$ALL" | sort -u)

WAVES=0
if [[ "$REVIEW" -gt 0 ]]; then
  WAVES=$(( (REVIEW + WAVE_SIZE - 1) / WAVE_SIZE ))
fi

echo "review_files: ${REVIEW}"
echo "test_files: ${TEST}"
echo "docs_files: ${DOCS}"
echo "style_files: ${STYLE}"
echo "skip_files: ${SKIP}"
echo "review_lines: ${LINES}"
echo "wave_size: ${WAVE_SIZE}"
echo "waves_needed: ${WAVES}"
echo "END"
exit 0
