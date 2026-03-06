import { BinaryReader, BinaryWriter } from "cosmjs-types/binary";

import { createProtobufRpcClient, QueryClient } from "../../queryclient";
import { AccountDiscount, AccountDiscountCodec } from "./messages";

// ---- Response codecs ----

const QueryModeratorAddressResponse = {
  decode(input: Uint8Array): { moderatorAddress: string } {
    const reader = new BinaryReader(input);
    let moderatorAddress = "";
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: moderatorAddress = reader.string(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return { moderatorAddress };
  },
};

const QueryDiscountsRequest = {
  encode(paginationKey?: Uint8Array): Uint8Array {
    const writer = new BinaryWriter();
    if (paginationKey?.length) {
      writer.uint32(10).fork().uint32(10).bytes(paginationKey).ldelim();
    }
    return writer.finish();
  },
};

const QueryDiscountsResponse = {
  decode(input: Uint8Array): { discounts: AccountDiscount[]; nextKey?: Uint8Array } {
    const reader = new BinaryReader(input);
    const discounts: AccountDiscount[] = [];
    let nextKey: Uint8Array | undefined;
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: discounts.push(AccountDiscountCodec.decode(reader.bytes())); break;
        case 2: {
          // pagination response - just skip for now
          reader.skipType(tag & 7);
          break;
        }
        default: reader.skipType(tag & 7);
      }
    }
    return { discounts, nextKey };
  },
};

const QueryDiscountRequest = {
  encode(address: string): Uint8Array {
    const writer = new BinaryWriter();
    if (address) writer.uint32(10).string(address);
    return writer.finish();
  },
};

const QueryDiscountResponse = {
  decode(input: Uint8Array): { discount: AccountDiscount } {
    const reader = new BinaryReader(input);
    let discount: AccountDiscount | undefined;
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: discount = AccountDiscountCodec.decode(reader.bytes()); break;
        default: reader.skipType(tag & 7);
      }
    }
    if (!discount) throw new Error("FeepolicyQueryDiscountResponse: discount missing");
    return { discount };
  },
};

// ---- Extension ----

export interface FeepolicyExtension {
  readonly feepolicy: {
    readonly moderatorAddress: () => Promise<string>;
    readonly discounts: (paginationKey?: Uint8Array) => Promise<AccountDiscount[]>;
    readonly discount: (address: string) => Promise<AccountDiscount>;
  };
}

export function setupFeepolicyExtension(base: QueryClient): FeepolicyExtension {
  const rpc = createProtobufRpcClient(base);

  return {
    feepolicy: {
      moderatorAddress: async () => {
        const response = await rpc.request("guru.feepolicy.v1.Query", "ModeratorAddress", new Uint8Array());
        return QueryModeratorAddressResponse.decode(response).moderatorAddress;
      },
      discounts: async (paginationKey?: Uint8Array) => {
        const response = await rpc.request(
          "guru.feepolicy.v1.Query",
          "Discounts",
          QueryDiscountsRequest.encode(paginationKey),
        );
        return QueryDiscountsResponse.decode(response).discounts;
      },
      discount: async (address: string) => {
        const response = await rpc.request(
          "guru.feepolicy.v1.Query",
          "Discount",
          QueryDiscountRequest.encode(address),
        );
        return QueryDiscountResponse.decode(response).discount;
      },
    },
  };
}
