import { BinaryReader, BinaryWriter } from "cosmjs-types/binary";

import { createProtobufRpcClient, QueryClient } from "../../queryclient";
import { Erc20Params, Erc20ParamsCodec, TokenPair, TokenPairCodec } from "./messages";

// ---- Request codecs ----

const QueryTokenPairsRequest = {
  encode(paginationKey?: Uint8Array): Uint8Array {
    const writer = new BinaryWriter();
    if (paginationKey?.length) {
      writer.uint32(10).fork().uint32(10).bytes(paginationKey).ldelim();
    }
    return writer.finish();
  },
};

const QueryTokenPairRequest = {
  encode(token: string): Uint8Array {
    const writer = new BinaryWriter();
    if (token) writer.uint32(10).string(token);
    return writer.finish();
  },
};

// ---- Response codecs ----

const QueryTokenPairsResponse = {
  decode(input: Uint8Array): { tokenPairs: TokenPair[] } {
    const reader = new BinaryReader(input);
    const tokenPairs: TokenPair[] = [];
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: tokenPairs.push(TokenPairCodec.decode(reader.bytes())); break;
        default: reader.skipType(tag & 7);
      }
    }
    return { tokenPairs };
  },
};

const QueryTokenPairResponse = {
  decode(input: Uint8Array): { tokenPair: TokenPair } {
    const reader = new BinaryReader(input);
    let tokenPair: TokenPair | undefined;
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: tokenPair = TokenPairCodec.decode(reader.bytes()); break;
        default: reader.skipType(tag & 7);
      }
    }
    if (!tokenPair) throw new Error("Erc20QueryTokenPairResponse: tokenPair missing");
    return { tokenPair };
  },
};

const QueryParamsResponse = {
  decode(input: Uint8Array): { params: Erc20Params } {
    const reader = new BinaryReader(input);
    let params: Erc20Params | undefined;
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: params = Erc20ParamsCodec.decode(reader.bytes()); break;
        default: reader.skipType(tag & 7);
      }
    }
    if (!params) throw new Error("Erc20QueryParamsResponse: params missing");
    return { params };
  },
};

// ---- Extension ----

export interface Erc20Extension {
  readonly erc20: {
    readonly tokenPairs: (paginationKey?: Uint8Array) => Promise<TokenPair[]>;
    readonly tokenPair: (token: string) => Promise<TokenPair>;
    readonly params: () => Promise<Erc20Params>;
  };
}

export function setupErc20Extension(base: QueryClient): Erc20Extension {
  const rpc = createProtobufRpcClient(base);

  return {
    erc20: {
      tokenPairs: async (paginationKey?: Uint8Array) => {
        const response = await rpc.request(
          "cosmos.evm.erc20.v1.Query",
          "TokenPairs",
          QueryTokenPairsRequest.encode(paginationKey),
        );
        return QueryTokenPairsResponse.decode(response).tokenPairs;
      },
      tokenPair: async (token: string) => {
        const response = await rpc.request(
          "cosmos.evm.erc20.v1.Query",
          "TokenPair",
          QueryTokenPairRequest.encode(token),
        );
        return QueryTokenPairResponse.decode(response).tokenPair;
      },
      params: async () => {
        const response = await rpc.request("cosmos.evm.erc20.v1.Query", "Params", new Uint8Array());
        return QueryParamsResponse.decode(response).params;
      },
    },
  };
}
