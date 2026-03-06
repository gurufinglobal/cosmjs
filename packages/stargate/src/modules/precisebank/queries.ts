import { BinaryReader, BinaryWriter } from "cosmjs-types/binary";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

import { createProtobufRpcClient, QueryClient } from "../../queryclient";

// ---- Coin codec ----

const CoinCodec = {
  decode(input: BinaryReader | Uint8Array): Coin {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: Coin = { denom: "", amount: "" };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.denom = reader.string(); break;
        case 2: msg.amount = reader.string(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
};

// ---- Response codecs ----

const QueryRemainderResponse = {
  decode(input: Uint8Array): { remainder: Coin } {
    const reader = new BinaryReader(input);
    let remainder: Coin | undefined;
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: remainder = CoinCodec.decode(reader.bytes()); break;
        default: reader.skipType(tag & 7);
      }
    }
    if (!remainder) throw new Error("PrecisebankQueryRemainderResponse: remainder missing");
    return { remainder };
  },
};

const QueryFractionalBalanceRequest = {
  encode(address: string): Uint8Array {
    const writer = new BinaryWriter();
    if (address) writer.uint32(10).string(address);
    return writer.finish();
  },
};

const QueryFractionalBalanceResponse = {
  decode(input: Uint8Array): { fractionalBalance: Coin } {
    const reader = new BinaryReader(input);
    let fractionalBalance: Coin | undefined;
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: fractionalBalance = CoinCodec.decode(reader.bytes()); break;
        default: reader.skipType(tag & 7);
      }
    }
    if (!fractionalBalance) throw new Error("PrecisebankQueryFractionalBalanceResponse: fractionalBalance missing");
    return { fractionalBalance };
  },
};

// ---- Extension ----

export interface PrecisebankExtension {
  readonly precisebank: {
    readonly remainder: () => Promise<Coin>;
    readonly fractionalBalance: (address: string) => Promise<Coin>;
  };
}

export function setupPrecisebankExtension(base: QueryClient): PrecisebankExtension {
  const rpc = createProtobufRpcClient(base);

  return {
    precisebank: {
      remainder: async () => {
        const response = await rpc.request("cosmos.evm.precisebank.v1.Query", "Remainder", new Uint8Array());
        return QueryRemainderResponse.decode(response).remainder;
      },
      fractionalBalance: async (address: string) => {
        const response = await rpc.request(
          "cosmos.evm.precisebank.v1.Query",
          "FractionalBalance",
          QueryFractionalBalanceRequest.encode(address),
        );
        return QueryFractionalBalanceResponse.decode(response).fractionalBalance;
      },
    },
  };
}
