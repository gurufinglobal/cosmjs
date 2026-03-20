/* eslint-disable @typescript-eslint/naming-convention, no-bitwise */
import { BinaryReader, BinaryWriter } from "cosmjs-types/binary";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { PageRequest } from "cosmjs-types/cosmos/base/query/v1beta1/pagination";

import { createPagination, createProtobufRpcClient, QueryClient } from "../../queryclient";
import { Denom, DenomCodec } from "./messages";

const QueryDenomsRequest = {
  encode(paginationKey?: Uint8Array): Uint8Array {
    const writer = new BinaryWriter();
    if (paginationKey?.length) {
      writer.uint32(10).fork();
      PageRequest.encode(createPagination(paginationKey), writer);
      writer.ldelim();
    }
    return writer.finish();
  },
};

const QueryDenomsResponse = {
  decode(input: Uint8Array): { denoms: Denom[] } {
    const reader = new BinaryReader(input);
    const denoms: Denom[] = [];
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          denoms.push(DenomCodec.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return { denoms };
  },
};

const QueryDenomRequest = {
  encode(hash: string): Uint8Array {
    const writer = new BinaryWriter();
    if (hash) writer.uint32(10).string(hash);
    return writer.finish();
  },
};

const QueryDenomResponse = {
  decode(input: Uint8Array): { denom: Denom } {
    const reader = new BinaryReader(input);
    let denom: Denom | undefined;
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          denom = DenomCodec.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    if (!denom) throw new Error("XswapQueryDenomResponse: denom missing");
    return { denom };
  },
};

const QueryDenomHashRequest = {
  encode(trace: string): Uint8Array {
    const writer = new BinaryWriter();
    if (trace) writer.uint32(10).string(trace);
    return writer.finish();
  },
};

const QueryDenomHashResponse = {
  decode(input: Uint8Array): { hash: string } {
    const reader = new BinaryReader(input);
    let hash = "";
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          hash = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return { hash };
  },
};

const QueryEscrowAddressRequest = {
  encode(portId: string, channelId: string): Uint8Array {
    const writer = new BinaryWriter();
    if (portId) writer.uint32(10).string(portId);
    if (channelId) writer.uint32(18).string(channelId);
    return writer.finish();
  },
};

const QueryEscrowAddressResponse = {
  decode(input: Uint8Array): { escrowAddress: string } {
    const reader = new BinaryReader(input);
    let escrowAddress = "";
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          escrowAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return { escrowAddress };
  },
};

const QueryTotalEscrowForDenomRequest = {
  encode(denom: string): Uint8Array {
    const writer = new BinaryWriter();
    if (denom) writer.uint32(10).string(denom);
    return writer.finish();
  },
};

const QueryTotalEscrowForDenomResponse = {
  decode(input: Uint8Array): { amount: Coin } {
    const reader = new BinaryReader(input);
    let amount: Coin | undefined;
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          amount = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    if (!amount) throw new Error("XswapQueryTotalEscrowForDenomResponse: amount missing");
    return { amount };
  },
};

export interface XswapExtension {
  readonly xswap: {
    readonly denoms: (paginationKey?: Uint8Array) => Promise<Denom[]>;
    readonly denom: (hash: string) => Promise<Denom>;
    readonly denomHash: (trace: string) => Promise<string>;
    readonly escrowAddress: (portId: string, channelId: string) => Promise<string>;
    readonly totalEscrowForDenom: (denom: string) => Promise<Coin>;
  };
}

export function setupXswapExtension(base: QueryClient): XswapExtension {
  const rpc = createProtobufRpcClient(base);

  return {
    xswap: {
      denoms: async (paginationKey?: Uint8Array) => {
        const response = await rpc.request(
          "gxstable.xswap.v1.Query",
          "Denoms",
          QueryDenomsRequest.encode(paginationKey),
        );
        return QueryDenomsResponse.decode(response).denoms;
      },
      denom: async (hash: string) => {
        const response = await rpc.request("gxstable.xswap.v1.Query", "Denom", QueryDenomRequest.encode(hash));
        return QueryDenomResponse.decode(response).denom;
      },
      denomHash: async (trace: string) => {
        const response = await rpc.request(
          "gxstable.xswap.v1.Query",
          "DenomHash",
          QueryDenomHashRequest.encode(trace),
        );
        return QueryDenomHashResponse.decode(response).hash;
      },
      escrowAddress: async (portId: string, channelId: string) => {
        const response = await rpc.request(
          "gxstable.xswap.v1.Query",
          "EscrowAddress",
          QueryEscrowAddressRequest.encode(portId, channelId),
        );
        return QueryEscrowAddressResponse.decode(response).escrowAddress;
      },
      totalEscrowForDenom: async (denom: string) => {
        const response = await rpc.request(
          "gxstable.xswap.v1.Query",
          "TotalEscrowForDenom",
          QueryTotalEscrowForDenomRequest.encode(denom),
        );
        return QueryTotalEscrowForDenomResponse.decode(response).amount;
      },
    },
  };
}
