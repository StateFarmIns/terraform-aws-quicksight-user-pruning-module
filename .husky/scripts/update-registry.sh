#!/bin/bash

# Define registries first
PRIVATE="packages.ic1.statefarm/artifactory/api/npm/npm-virtual"
PUBLIC_NODE="registry.npmjs.org"
PUBLIC_YARN="registry.yarnpkg.com"

# If private registry not resolvable, force public registries
# Ensures commits never contain internal endpoints outside corp network
if ! nslookup packages.ic1.statefarm >/dev/null 2>&1; then
  sed -i "s|${PRIVATE}|${PUBLIC_NODE}|g" package-lock.json 2>/dev/null || true
  sed -i "s|${PRIVATE}|${PUBLIC_YARN}|g" yarn.lock 2>/dev/null || true
  exit 0
fi

# Invoke: .husky/scripts/update-registry.sh to-private # Turn to private
#         .husky/scripts/update-registry.sh to-public  # Turn to public
# Read direction from command line argument
DIRECTION="$1"

if [ "$DIRECTION" == "to-private" ]; then
  echo 'making private'
  sed -i "s|${PUBLIC_NODE}|${PRIVATE}|g" package-lock.json 2>/dev/null || true
  sed -i "s|${PUBLIC_YARN}|${PRIVATE}|g" yarn.lock 2>/dev/null || true
else
  sed -i "s|${PRIVATE}|${PUBLIC_NODE}|g" package-lock.json 2>/dev/null || true
  sed -i "s|${PRIVATE}|${PUBLIC_YARN}|g" yarn.lock 2>/dev/null || true
fi
