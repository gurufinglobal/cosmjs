import { EncodeObject, GeneratedType } from "@cosmjs/proto-signing";
import { BinaryWriter, BinaryReader } from "cosmjs-types/binary";

// ---- Types ----

export interface Discount {
  discountType: string;
  msgType: string;
  amount: string;
}

export interface ModuleDiscount {
  module: string;
  discounts: Discount[];
}

export interface AccountDiscount {
  address: string;
  modules: ModuleDiscount[];
}

// ---- Message Types ----

export interface MsgRegisterDiscounts {
  moderatorAddress: string;
  discounts: AccountDiscount[];
}

export interface MsgRegisterDiscountsResponse {}

export interface MsgRemoveDiscounts {
  moderatorAddress: string;
  address: string;
  module: string;
  msgType: string;
}

export interface MsgRemoveDiscountsResponse {}

export interface MsgChangeModerator {
  moderatorAddress: string;
  newModeratorAddress: string;
}

export interface MsgChangeModeratorResponse {}

// ---- Protobuf Codecs ----

const DiscountCodec = {
  encode(msg: Discount, writer = new BinaryWriter()): BinaryWriter {
    if (msg.discountType) writer.uint32(10).string(msg.discountType);
    if (msg.msgType) writer.uint32(18).string(msg.msgType);
    if (msg.amount) writer.uint32(26).string(msg.amount);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): Discount {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: Discount = { discountType: "", msgType: "", amount: "" };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.discountType = reader.string(); break;
        case 2: msg.msgType = reader.string(); break;
        case 3: msg.amount = reader.string(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<Discount>): Discount {
    return { discountType: obj.discountType ?? "", msgType: obj.msgType ?? "", amount: obj.amount ?? "" };
  },
};

const ModuleDiscountCodec = {
  encode(msg: ModuleDiscount, writer = new BinaryWriter()): BinaryWriter {
    if (msg.module) writer.uint32(10).string(msg.module);
    for (const d of msg.discounts) {
      writer.uint32(18).fork();
      DiscountCodec.encode(d, writer);
      writer.ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): ModuleDiscount {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: ModuleDiscount = { module: "", discounts: [] };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.module = reader.string(); break;
        case 2: msg.discounts.push(DiscountCodec.decode(reader.bytes())); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<ModuleDiscount>): ModuleDiscount {
    return { module: obj.module ?? "", discounts: obj.discounts ?? [] };
  },
};

export const AccountDiscountCodec = {
  encode(msg: AccountDiscount, writer = new BinaryWriter()): BinaryWriter {
    if (msg.address) writer.uint32(10).string(msg.address);
    for (const m of msg.modules) {
      writer.uint32(18).fork();
      ModuleDiscountCodec.encode(m, writer);
      writer.ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): AccountDiscount {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: AccountDiscount = { address: "", modules: [] };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.address = reader.string(); break;
        case 2: msg.modules.push(ModuleDiscountCodec.decode(reader.bytes())); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<AccountDiscount>): AccountDiscount {
    return { address: obj.address ?? "", modules: obj.modules ?? [] };
  },
};

export const MsgRegisterDiscountsCodec = {
  typeUrl: "/guru.feepolicy.v1.MsgRegisterDiscounts",
  encode(msg: MsgRegisterDiscounts, writer = new BinaryWriter()): BinaryWriter {
    if (msg.moderatorAddress) writer.uint32(10).string(msg.moderatorAddress);
    for (const d of msg.discounts) {
      writer.uint32(18).fork();
      AccountDiscountCodec.encode(d, writer);
      writer.ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgRegisterDiscounts {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: MsgRegisterDiscounts = { moderatorAddress: "", discounts: [] };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.moderatorAddress = reader.string(); break;
        case 2: msg.discounts.push(AccountDiscountCodec.decode(reader.bytes())); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<MsgRegisterDiscounts>): MsgRegisterDiscounts {
    return { moderatorAddress: obj.moderatorAddress ?? "", discounts: obj.discounts ?? [] };
  },
};

export const MsgRemoveDiscountsCodec = {
  typeUrl: "/guru.feepolicy.v1.MsgRemoveDiscounts",
  encode(msg: MsgRemoveDiscounts, writer = new BinaryWriter()): BinaryWriter {
    if (msg.moderatorAddress) writer.uint32(10).string(msg.moderatorAddress);
    if (msg.address) writer.uint32(18).string(msg.address);
    if (msg.module) writer.uint32(26).string(msg.module);
    if (msg.msgType) writer.uint32(34).string(msg.msgType);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgRemoveDiscounts {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: MsgRemoveDiscounts = { moderatorAddress: "", address: "", module: "", msgType: "" };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.moderatorAddress = reader.string(); break;
        case 2: msg.address = reader.string(); break;
        case 3: msg.module = reader.string(); break;
        case 4: msg.msgType = reader.string(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<MsgRemoveDiscounts>): MsgRemoveDiscounts {
    return {
      moderatorAddress: obj.moderatorAddress ?? "",
      address: obj.address ?? "",
      module: obj.module ?? "",
      msgType: obj.msgType ?? "",
    };
  },
};

export const MsgChangeModeratorCodec = {
  typeUrl: "/guru.feepolicy.v1.MsgChangeModerator",
  encode(msg: MsgChangeModerator, writer = new BinaryWriter()): BinaryWriter {
    if (msg.moderatorAddress) writer.uint32(10).string(msg.moderatorAddress);
    if (msg.newModeratorAddress) writer.uint32(18).string(msg.newModeratorAddress);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgChangeModerator {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: MsgChangeModerator = { moderatorAddress: "", newModeratorAddress: "" };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.moderatorAddress = reader.string(); break;
        case 2: msg.newModeratorAddress = reader.string(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<MsgChangeModerator>): MsgChangeModerator {
    return { moderatorAddress: obj.moderatorAddress ?? "", newModeratorAddress: obj.newModeratorAddress ?? "" };
  },
};

// ---- GeneratedType array ----

export const feepolicyTypes: ReadonlyArray<[string, GeneratedType]> = [
  [MsgRegisterDiscountsCodec.typeUrl, MsgRegisterDiscountsCodec as unknown as GeneratedType],
  [MsgRemoveDiscountsCodec.typeUrl, MsgRemoveDiscountsCodec as unknown as GeneratedType],
  [MsgChangeModeratorCodec.typeUrl, MsgChangeModeratorCodec as unknown as GeneratedType],
];

// ---- EncodeObject interfaces ----

export interface MsgRegisterDiscountsEncodeObject extends EncodeObject {
  readonly typeUrl: "/guru.feepolicy.v1.MsgRegisterDiscounts";
  readonly value: Partial<MsgRegisterDiscounts>;
}

export function isMsgRegisterDiscountsEncodeObject(obj: EncodeObject): obj is MsgRegisterDiscountsEncodeObject {
  return obj.typeUrl === "/guru.feepolicy.v1.MsgRegisterDiscounts";
}

export interface MsgRemoveDiscountsEncodeObject extends EncodeObject {
  readonly typeUrl: "/guru.feepolicy.v1.MsgRemoveDiscounts";
  readonly value: Partial<MsgRemoveDiscounts>;
}

export function isMsgRemoveDiscountsEncodeObject(obj: EncodeObject): obj is MsgRemoveDiscountsEncodeObject {
  return obj.typeUrl === "/guru.feepolicy.v1.MsgRemoveDiscounts";
}

export interface MsgChangeModeratorEncodeObject extends EncodeObject {
  readonly typeUrl: "/guru.feepolicy.v1.MsgChangeModerator";
  readonly value: Partial<MsgChangeModerator>;
}

export function isMsgChangeModeratorEncodeObject(obj: EncodeObject): obj is MsgChangeModeratorEncodeObject {
  return obj.typeUrl === "/guru.feepolicy.v1.MsgChangeModerator";
}
