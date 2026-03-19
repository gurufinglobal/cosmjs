FROM golang:1.24.12-alpine AS builder

RUN apk add --no-cache git make gcc musl-dev linux-headers ca-certificates

WORKDIR /build

ARG GURUD_VERSION=main
RUN git clone https://github.com/gurufinglobal/guru.git && \
    cd guru && \
    git checkout ${GURUD_VERSION}

WORKDIR /build/guru
RUN GOTOOLCHAIN=auto go version && make build && \
    cp build/gurud /usr/local/bin/gurud

FROM alpine:latest

RUN apk add --no-cache bash curl jq libgcc libstdc++

COPY --from=builder /usr/local/bin/gurud /usr/local/bin/gurud
RUN chmod +x /usr/local/bin/gurud

WORKDIR /root

EXPOSE 26656 26657 1317 9090

CMD ["gurud"]
