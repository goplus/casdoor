# Script for qpass to build the casdoor project
# See details in https://casdoor.org/docs/basic/server-installation/#production-mode
# pwd: casdoor/
set -e

# Build backend
CGO_ENABLED=0 go build

# Build frontend
cd web
yarn install --frozen-lockfile --network-timeout 1000000
FRONTEND_ENV=production yarn run build
cd ..

# Copy result
mkdir -p _package/web
cp -r web/build _package/web
cp ./casdoor _package
