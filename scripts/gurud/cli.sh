#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
# shellcheck source=./env
# shellcheck disable=SC1091
source "$SCRIPT_DIR"/env

HOME_DIR="/root"

docker run \
  --rm \
  -it \
  --mount type=volume,source=gurud_data,target=/root/.gurud \
  -w "$HOME_DIR" \
  --env "HOME=$HOME_DIR" \
  --net "container:$CONTAINER_NAME" \
  "$REPOSITORY:$VERSION" \
  gurud "$@"
