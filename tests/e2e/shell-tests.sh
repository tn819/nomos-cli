#!/bin/bash
set -e

echo "=== Shell-based E2E Tests ==="
echo

CLI="./dist/cli.js"

echo "Test 1: Help command"
$CLI help | grep -q "Usage:"
echo "✓ Help works"
echo

echo "Test 2: Versions command"
OUTPUT=$($CLI versions)
echo "$OUTPUT" | grep -q "2026-01-29.edison"
echo "$OUTPUT" | grep -q "(latest)"
echo "✓ Versions listed"
echo

echo "Test 3: Operations command"
OUTPUT=$($CLI operations)
[ $(echo "$OUTPUT" | wc -l) -gt 0 ]
echo "$OUTPUT" | grep -q "get-subscriptions"
echo "✓ Operations listed"
echo

echo "Test 4: Capabilities command"
OUTPUT=$($CLI capabilities)
echo "$OUTPUT" | grep -q "Spec version:"
echo "$OUTPUT" | grep -q "Total operations:"
echo "✓ Capabilities shown"
echo

echo "Test 5: New-endpoints command"
OUTPUT=$($CLI new-endpoints)
echo "$OUTPUT" | grep -q "Base:"
echo "$OUTPUT" | grep -q "Latest:"
echo "$OUTPUT" | grep -q "Added:"
echo "✓ New endpoints shown"
echo

echo "Test 6: Grid-fee-reductions help"
$CLI grid-fee-reductions --help | grep -q "Usage:"
echo "✓ Grid-fee-reductions help works"
echo

echo "Test 7: Meter-orders help"
$CLI meter-orders --help | grep -q "Usage:"
echo "✓ Meter-orders help works"
echo

echo "Test 8: Login help"
$CLI login --help | grep -q "Usage:"
echo "✓ Login help works"
echo

echo "=== All Shell Tests Passed ==="
