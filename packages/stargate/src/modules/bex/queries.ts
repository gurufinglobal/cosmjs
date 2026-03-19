/* eslint-disable @typescript-eslint/naming-convention, no-bitwise */
import { BinaryReader, BinaryWriter } from "cosmjs-types/binary";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

import { createProtobufRpcClient, QueryClient } from "../../queryclient";
import { Exchange, ExchangeCodec, Ratemeter, RatemeterCodec } from "./messages";

const QueryModeratorAddressRequest = {
  encode(): Uint8Array {
    return new Uint8Array();
  },
};

const QueryModeratorAddressResponse = {
  decode(input: Uint8Array): { moderatorAddress: string } {
    const reader = new BinaryReader(input);
    let moderatorAddress = "";
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          moderatorAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return { moderatorAddress };
  },
};

const QueryExchangesRequest = {
  encode(id?: string): Uint8Array {
    const writer = new BinaryWriter();
    if (id && id.length > 0) writer.uint32(10).string(id);
    return writer.finish();
  },
};

const QueryExchangesResponse = {
  decode(input: Uint8Array): { exchanges: Exchange[] } {
    const reader = new BinaryReader(input);
    const exchanges: Exchange[] = [];
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          exchanges.push(ExchangeCodec.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return { exchanges };
  },
};

const QueryIsAdminRequest = {
  encode(address: string): Uint8Array {
    const writer = new BinaryWriter();
    if (address) writer.uint32(10).string(address);
    return writer.finish();
  },
};

const QueryIsAdminResponse = {
  decode(input: Uint8Array): { isAdmin: boolean } {
    const reader = new BinaryReader(input);
    let isAdmin = false;
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          isAdmin = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return { isAdmin };
  },
};

const QueryNextExchangeIdRequest = {
  encode(): Uint8Array {
    return new Uint8Array();
  },
};

const QueryNextExchangeIdResponse = {
  decode(input: Uint8Array): { id: string } {
    const reader = new BinaryReader(input);
    let id = "";
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return { id };
  },
};

const QueryRatemeterRequest = {
  encode(): Uint8Array {
    return new Uint8Array();
  },
};

const QueryRatemeterResponse = {
  decode(input: Uint8Array): { ratemeter?: Ratemeter } {
    const reader = new BinaryReader(input);
    let ratemeter: Ratemeter | undefined;
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          ratemeter = RatemeterCodec.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return { ratemeter };
  },
};

const QueryCollectedFeesRequest = {
  encode(exchangeId?: string): Uint8Array {
    const writer = new BinaryWriter();
    if (exchangeId && exchangeId.length > 0) writer.uint32(10).string(exchangeId);
    return writer.finish();
  },
};

const QueryCollectedFeesResponse = {
  decode(input: Uint8Array): { coins: Coin[] } {
    const reader = new BinaryReader(input);
    const coins: Coin[] = [];
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          coins.push(Coin.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return { coins };
  },
};

const QueryLockedFeesRequest = {
  encode(exchangeId: string): Uint8Array {
    const writer = new BinaryWriter();
    if (exchangeId) writer.uint32(10).string(exchangeId);
    return writer.finish();
  },
};

const QueryLockedFeesResponse = QueryCollectedFeesResponse;

const QueryAvailableFeesRequest = {
  encode(exchangeId: string): Uint8Array {
    const writer = new BinaryWriter();
    if (exchangeId) writer.uint32(10).string(exchangeId);
    return writer.finish();
  },
};

const QueryAvailableFeesResponse = QueryCollectedFeesResponse;

export interface BexExtension {
  readonly bex: {
    readonly moderatorAddress: () => Promise<string>;
    readonly exchanges: (id?: string) => Promise<Exchange[]>;
    readonly isAdmin: (address: string) => Promise<boolean>;
    readonly nextExchangeId: () => Promise<string>;
    readonly ratemeter: () => Promise<Ratemeter | undefined>;
    readonly collectedFees: (exchangeId?: string) => Promise<Coin[]>;
    readonly lockedFees: (exchangeId: string) => Promise<Coin[]>;
    readonly availableFees: (exchangeId: string) => Promise<Coin[]>;
  };
}

export function setupBexExtension(base: QueryClient): BexExtension {
  const rpc = createProtobufRpcClient(base);

  return {
    bex: {
      moderatorAddress: async () => {
        const response = await rpc.request(
          "guru.bex.v1.Query",
          "ModeratorAddress",
          QueryModeratorAddressRequest.encode(),
        );
        return QueryModeratorAddressResponse.decode(response).moderatorAddress;
      },
      exchanges: async (id?: string) => {
        const response = await rpc.request(
          "guru.bex.v1.Query",
          "Exchanges",
          QueryExchangesRequest.encode(id),
        );
        return QueryExchangesResponse.decode(response).exchanges;
      },
      isAdmin: async (address: string) => {
        const response = await rpc.request(
          "guru.bex.v1.Query",
          "IsAdmin",
          QueryIsAdminRequest.encode(address),
        );
        return QueryIsAdminResponse.decode(response).isAdmin;
      },
      nextExchangeId: async () => {
        const response = await rpc.request(
          "guru.bex.v1.Query",
          "NextExchangeId",
          QueryNextExchangeIdRequest.encode(),
        );
        return QueryNextExchangeIdResponse.decode(response).id;
      },
      ratemeter: async () => {
        const response = await rpc.request("guru.bex.v1.Query", "Ratemeter", QueryRatemeterRequest.encode());
        return QueryRatemeterResponse.decode(response).ratemeter;
      },
      collectedFees: async (exchangeId?: string) => {
        const response = await rpc.request(
          "guru.bex.v1.Query",
          "CollectedFees",
          QueryCollectedFeesRequest.encode(exchangeId),
        );
        return QueryCollectedFeesResponse.decode(response).coins;
      },
      lockedFees: async (exchangeId: string) => {
        const response = await rpc.request(
          "guru.bex.v1.Query",
          "LockedFees",
          QueryLockedFeesRequest.encode(exchangeId),
        );
        return QueryLockedFeesResponse.decode(response).coins;
      },
      availableFees: async (exchangeId: string) => {
        const response = await rpc.request(
          "guru.bex.v1.Query",
          "AvailableFees",
          QueryAvailableFeesRequest.encode(exchangeId),
        );
        return QueryAvailableFeesResponse.decode(response).coins;
      },
    },
  };
}
