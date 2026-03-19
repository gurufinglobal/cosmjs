# Local Guru development network

## Building the Docker Image

`gurud` prebuilt images are not used here. Build from source:

```bash
cd scripts/gurud
./build.sh
```

This will:
- Clone `https://github.com/gurufinglobal/guru`
- Build the `gurud` binary
- Create a Docker image tagged as `cosmjs/gurud:main`

### Building a Different Ref

You can build a specific branch/tag/commit:

```bash
GURUD_VERSION=v2.0.0 ./build.sh
```

## Start the blockchain

```bash
cd scripts/gurud
./start.sh && ./init.sh
```

## CLI

Use `./cli.sh` for Docker-friendly `gurud` access.

```bash
./cli.sh status
./cli.sh keys list --keyring-backend test
```

## Stop

```bash
./stop.sh
```

## Ports

The `gurud` test chain uses:
- **26663**: Tendermint RPC (container 26657)
- **1323**: REST API (container 1317)
- **9093**: gRPC (container 9090)

## Notes

- Home directory is persisted in Docker volume `gurud_data`.
- Chain init is automatically performed on first start via `setup.sh`.
- Default chain id is `guru-testing` (override with `CHAIN_ID` env var).
