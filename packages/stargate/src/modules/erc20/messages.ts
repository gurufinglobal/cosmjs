import { EncodeObject, GeneratedType } from "@cosmjs/proto-signing";
import { BinaryReader, BinaryWriter } from "cosmjs-types/binary";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

// ---- Enums ----

export enum Owner {
  OWNER_UNSPECIFIED = 0,
  OWNER_MODULE = 1,
  OWNER_EXTERNAL = 2,
}

// ---- Types ----

export interface TokenPair {
  erc20Address: string;
  denom: string;
  enabled: boolean;
  contractOwner: Owner;
}

export interface Erc20Params {
  enableErc20: boolean;
  permissionlessRegistration: boolean;
}

// ---- Message Types ----

export interface MsgConvertERC20 {
  contractAddress: string;
  amount: string;
  receiver: string;
  sender: string;
}

export interface MsgConvertERC20Response {}

export interface MsgConvertCoin {
  coin: Coin;
  receiver: string;
  sender: string;
}

export interface MsgConvertCoinResponse {}

export interface MsgRegisterERC20 {
  signer: string;
  erc20addresses: string[];
}

export interface MsgRegisterERC20Response {}

export interface MsgToggleConversion {
  authority: string;
  token: string;
}

export interface MsgToggleConversionResponse {}

// ---- Protobuf Codecs ----

export const MsgConvertERC20Codec = {
  typeUrl: "/cosmos.evm.erc20.v1.MsgConvertERC20",
  encode(msg: MsgConvertERC20, writer = new BinaryWriter()): BinaryWriter {
    if (msg.contractAddress) writer.uint32(10).string(msg.contractAddress);
    if (msg.amount) writer.uint32(18).string(msg.amount);
    if (msg.receiver) writer.uint32(26).string(msg.receiver);
    if (msg.sender) writer.uint32(34).string(msg.sender);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgConvertERC20 {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: MsgConvertERC20 = { contractAddress: "", amount: "", receiver: "", sender: "" };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.contractAddress = reader.string(); break;
        case 2: msg.amount = reader.string(); break;
        case 3: msg.receiver = reader.string(); break;
        case 4: msg.sender = reader.string(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<MsgConvertERC20>): MsgConvertERC20 {
    return {
      contractAddress: obj.contractAddress ?? "",
      amount: obj.amount ?? "",
      receiver: obj.receiver ?? "",
      sender: obj.sender ?? "",
    };
  },
};

export const MsgConvertCoinCodec = {
  typeUrl: "/cosmos.evm.erc20.v1.MsgConvertCoin",
  encode(msg: MsgConvertCoin, writer = new BinaryWriter()): BinaryWriter {
    if (msg.coin) {
      writer.uint32(10).fork();
      if (msg.coin.denom) writer.uint32(10).string(msg.coin.denom);
      if (msg.coin.amount) writer.uint32(18).string(msg.coin.amount);
      writer.ldelim();
    }
    if (msg.receiver) writer.uint32(18).string(msg.receiver);
    if (msg.sender) writer.uint32(26).string(msg.sender);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgConvertCoin {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: MsgConvertCoin = { coin: { denom: "", amount: "" }, receiver: "", sender: "" };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          const coinBytes = reader.bytes();
          const coinReader = new BinaryReader(coinBytes);
          while (coinReader.pos < coinReader.len) {
            const t = coinReader.uint32();
            switch (t >>> 3) {
              case 1: msg.coin.denom = coinReader.string(); break;
              case 2: msg.coin.amount = coinReader.string(); break;
              default: coinReader.skipType(t & 7);
            }
          }
          break;
        }
        case 2: msg.receiver = reader.string(); break;
        case 3: msg.sender = reader.string(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<MsgConvertCoin>): MsgConvertCoin {
    return {
      coin: obj.coin ?? { denom: "", amount: "" },
      receiver: obj.receiver ?? "",
      sender: obj.sender ?? "",
    };
  },
};

export const MsgRegisterERC20Codec = {
  typeUrl: "/cosmos.evm.erc20.v1.MsgRegisterERC20",
  encode(msg: MsgRegisterERC20, writer = new BinaryWriter()): BinaryWriter {
    if (msg.signer) writer.uint32(10).string(msg.signer);
    for (const addr of msg.erc20addresses) writer.uint32(18).string(addr);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgRegisterERC20 {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: MsgRegisterERC20 = { signer: "", erc20addresses: [] };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.signer = reader.string(); break;
        case 2: msg.erc20addresses.push(reader.string()); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<MsgRegisterERC20>): MsgRegisterERC20 {
    return { signer: obj.signer ?? "", erc20addresses: obj.erc20addresses ?? [] };
  },
};

export const MsgToggleConversionCodec = {
  typeUrl: "/cosmos.evm.erc20.v1.MsgToggleConversion",
  encode(msg: MsgToggleConversion, writer = new BinaryWriter()): BinaryWriter {
    if (msg.authority) writer.uint32(10).string(msg.authority);
    if (msg.token) writer.uint32(18).string(msg.token);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgToggleConversion {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: MsgToggleConversion = { authority: "", token: "" };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.authority = reader.string(); break;
        case 2: msg.token = reader.string(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<MsgToggleConversion>): MsgToggleConversion {
    return { authority: obj.authority ?? "", token: obj.token ?? "" };
  },
};

// ---- GeneratedType array ----

export const erc20Types: ReadonlyArray<[string, GeneratedType]> = [
  [MsgConvertERC20Codec.typeUrl, MsgConvertERC20Codec as unknown as GeneratedType],
  [MsgConvertCoinCodec.typeUrl, MsgConvertCoinCodec as unknown as GeneratedType],
  [MsgRegisterERC20Codec.typeUrl, MsgRegisterERC20Codec as unknown as GeneratedType],
  [MsgToggleConversionCodec.typeUrl, MsgToggleConversionCodec as unknown as GeneratedType],
];

// ---- EncodeObject interfaces ----

export interface MsgConvertERC20EncodeObject extends EncodeObject {
  readonly typeUrl: "/cosmos.evm.erc20.v1.MsgConvertERC20";
  readonly value: Partial<MsgConvertERC20>;
}

export function isMsgConvertERC20EncodeObject(obj: EncodeObject): obj is MsgConvertERC20EncodeObject {
  return obj.typeUrl === "/cosmos.evm.erc20.v1.MsgConvertERC20";
}

export interface MsgConvertCoinEncodeObject extends EncodeObject {
  readonly typeUrl: "/cosmos.evm.erc20.v1.MsgConvertCoin";
  readonly value: Partial<MsgConvertCoin>;
}

export function isMsgConvertCoinEncodeObject(obj: EncodeObject): obj is MsgConvertCoinEncodeObject {
  return obj.typeUrl === "/cosmos.evm.erc20.v1.MsgConvertCoin";
}

export interface MsgRegisterERC20EncodeObject extends EncodeObject {
  readonly typeUrl: "/cosmos.evm.erc20.v1.MsgRegisterERC20";
  readonly value: Partial<MsgRegisterERC20>;
}

export function isMsgRegisterERC20EncodeObject(obj: EncodeObject): obj is MsgRegisterERC20EncodeObject {
  return obj.typeUrl === "/cosmos.evm.erc20.v1.MsgRegisterERC20";
}

export interface MsgToggleConversionEncodeObject extends EncodeObject {
  readonly typeUrl: "/cosmos.evm.erc20.v1.MsgToggleConversion";
  readonly value: Partial<MsgToggleConversion>;
}

export function isMsgToggleConversionEncodeObject(obj: EncodeObject): obj is MsgToggleConversionEncodeObject {
  return obj.typeUrl === "/cosmos.evm.erc20.v1.MsgToggleConversion";
}

// ---- TokenPair codec (for queries) ----

export const TokenPairCodec = {
  decode(input: BinaryReader | Uint8Array): TokenPair {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: TokenPair = { erc20Address: "", denom: "", enabled: false, contractOwner: 0 };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.erc20Address = reader.string(); break;
        case 2: msg.denom = reader.string(); break;
        case 3: msg.enabled = reader.bool(); break;
        case 4: msg.contractOwner = reader.int32(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
};

// ---- Erc20Params codec (for queries) ----

export const Erc20ParamsCodec = {
  decode(input: BinaryReader | Uint8Array): Erc20Params {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: Erc20Params = { enableErc20: false, permissionlessRegistration: false };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.enableErc20 = reader.bool(); break;
        case 5: msg.permissionlessRegistration = reader.bool(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
};
