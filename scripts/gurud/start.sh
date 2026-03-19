#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

# Please keep this in sync with the Ports overview in HACKING.md
TENDERMINT_PORT_GUEST="26657"
TENDERMINT_PORT_HOST="26663"
API_PORT_GUEST="1317"
API_PORT_HOST="1323"
GRPC_PORT_GUEST="9090"
GRPC_PORT_HOST="9093"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
# shellcheck source=./env
# shellcheck disable=SC1091
source "$SCRIPT_DIR"/env

TMP_DIR=$(mktemp -d "${TMPDIR:-/tmp}/gurud.XXXXXXXXX")
chmod 777 "$TMP_DIR"
echo "Using temporary dir $TMP_DIR"
GURUD_LOGFILE="$TMP_DIR/gurud.log"

docker volume rm -f gurud_data

docker run --rm \
  --name "$CONTAINER_NAME" \
  -p "$TENDERMINT_PORT_HOST":"$TENDERMINT_PORT_GUEST" \
  -p "$API_PORT_HOST":"$API_PORT_GUEST" \
  -p "$GRPC_PORT_HOST":"$GRPC_PORT_GUEST" \
  --mount type=bind,source="$SCRIPT_DIR",target=/template \
  --mount type=volume,source=gurud_data,target=/root \
  "$REPOSITORY:$VERSION" \
  /template/run_gurud.sh \
  >"$GURUD_LOGFILE" 2>&1 &

echo "gurud running on http://localhost:$TENDERMINT_PORT_HOST and logging into $GURUD_LOGFILE"

if [ -n "${CI:-}" ]; then
  sleep 0.5
  tail -f "$GURUD_LOGFILE"
fi
