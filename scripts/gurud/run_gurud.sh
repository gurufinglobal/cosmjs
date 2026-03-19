#!/bin/sh
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

CHAIN_ID="${CHAIN_ID:-guru_631-1}"
LOGLEVEL="${LOGLEVEL:-info}"
DENOM="${DENOM:-agxn}"
HOME_DIR="${HOME_DIR:-/root/.gurud}"

/template/setup.sh

gurud start \
  --home "$HOME_DIR" \
  --pruning nothing \
  --log_level "$LOGLEVEL" \
  --minimum-gas-prices "0$DENOM" \
  --rpc.laddr tcp://0.0.0.0:26657 \
  --chain-id "$CHAIN_ID" \
  --json-rpc.api eth,txpool,personal,net,debug,web3
