/* eslint-disable @typescript-eslint/naming-convention, no-bitwise */
import { EncodeObject, GeneratedType } from "@cosmjs/proto-signing";
import { BinaryReader, BinaryWriter } from "cosmjs-types/binary";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

export interface Hop {
  portId: string;
  channelId: string;
}

export interface Denom {
  base: string;
  trace: Hop[];
}

export interface Token {
  denom?: Denom;
  amount: string;
}

export interface MsgXswapTransfer {
  sourcePort: string;
  sourceChannel: string;
  token?: Coin;
  sender: string;
  receiver: string;
  timeoutTimestamp: bigint;
  memo: string;
  encoding: string;
}

export interface MsgXswapTransferResponse {
  sequence: bigint;
}

export interface MsgXswapExchange {
  sourcePort: string;
  sourceChannel: string;
  exchangeId: string;
  token?: Coin;
  sender: string;
  receiver: string;
  timeoutTimestamp: bigint;
  memo: string;
  encoding: string;
}

export interface MsgXswapExchangeResponse {
  sequence: bigint;
}

function createBaseHop(): Hop {
  return { portId: "", channelId: "" };
}

function createBaseDenom(): Denom {
  return { base: "", trace: [] };
}

function createBaseToken(): Token {
  return { denom: undefined, amount: "" };
}

function createBaseMsgXswapTransfer(): MsgXswapTransfer {
  return {
    sourcePort: "",
    sourceChannel: "",
    token: undefined,
    sender: "",
    receiver: "",
    timeoutTimestamp: BigInt(0),
    memo: "",
    encoding: "",
  };
}

function createBaseMsgXswapTransferResponse(): MsgXswapTransferResponse {
  return { sequence: BigInt(0) };
}

function createBaseMsgXswapExchange(): MsgXswapExchange {
  return {
    sourcePort: "",
    sourceChannel: "",
    exchangeId: "",
    token: undefined,
    sender: "",
    receiver: "",
    timeoutTimestamp: BigInt(0),
    memo: "",
    encoding: "",
  };
}

function createBaseMsgXswapExchangeResponse(): MsgXswapExchangeResponse {
  return { sequence: BigInt(0) };
}

export const HopCodec = {
  encode(message: Hop, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.portId !== "") writer.uint32(10).string(message.portId);
    if (message.channelId !== "") writer.uint32(18).string(message.channelId);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Hop {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHop();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.portId = reader.string();
          break;
        case 2:
          message.channelId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(object: Partial<Hop>): Hop {
    return {
      portId: object.portId ?? "",
      channelId: object.channelId ?? "",
    };
  },
};

export const DenomCodec = {
  encode(message: Denom, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.base !== "") writer.uint32(10).string(message.base);
    for (const hop of message.trace) {
      writer.uint32(26).fork();
      HopCodec.encode(hop, writer);
      writer.ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Denom {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDenom();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.base = reader.string();
          break;
        case 3:
          message.trace.push(HopCodec.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(object: Partial<Denom>): Denom {
    return {
      base: object.base ?? "",
      trace: object.trace?.map((hop) => HopCodec.fromPartial(hop)) ?? [],
    };
  },
};

export const TokenCodec = {
  encode(message: Token, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.denom) {
      writer.uint32(10).fork();
      DenomCodec.encode(message.denom, writer);
      writer.ldelim();
    }
    if (message.amount !== "") writer.uint32(18).string(message.amount);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): Token {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseToken();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.denom = DenomCodec.decode(reader, reader.uint32());
          break;
        case 2:
          message.amount = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(object: Partial<Token>): Token {
    return {
      denom: object.denom ? DenomCodec.fromPartial(object.denom) : undefined,
      amount: object.amount ?? "",
    };
  },
};

export const MsgXswapTransferCodec = {
  typeUrl: "/gxstable.xswap.v1.MsgTransfer",
  encode(message: MsgXswapTransfer, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.sourcePort !== "") writer.uint32(10).string(message.sourcePort);
    if (message.sourceChannel !== "") writer.uint32(18).string(message.sourceChannel);
    if (message.token) {
      writer.uint32(26).fork();
      Coin.encode(message.token, writer);
      writer.ldelim();
    }
    if (message.sender !== "") writer.uint32(34).string(message.sender);
    if (message.receiver !== "") writer.uint32(42).string(message.receiver);
    if (message.timeoutTimestamp !== BigInt(0)) writer.uint32(48).uint64(message.timeoutTimestamp);
    if (message.memo !== "") writer.uint32(58).string(message.memo);
    if (message.encoding !== "") writer.uint32(66).string(message.encoding);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgXswapTransfer {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgXswapTransfer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sourcePort = reader.string();
          break;
        case 2:
          message.sourceChannel = reader.string();
          break;
        case 3:
          message.token = Coin.decode(reader, reader.uint32());
          break;
        case 4:
          message.sender = reader.string();
          break;
        case 5:
          message.receiver = reader.string();
          break;
        case 6:
          message.timeoutTimestamp = reader.uint64();
          break;
        case 7:
          message.memo = reader.string();
          break;
        case 8:
          message.encoding = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgXswapTransfer>): MsgXswapTransfer {
    return {
      sourcePort: object.sourcePort ?? "",
      sourceChannel: object.sourceChannel ?? "",
      token: object.token ? Coin.fromPartial(object.token) : undefined,
      sender: object.sender ?? "",
      receiver: object.receiver ?? "",
      timeoutTimestamp: object.timeoutTimestamp ?? BigInt(0),
      memo: object.memo ?? "",
      encoding: object.encoding ?? "",
    };
  },
};

export const MsgXswapTransferResponseCodec = {
  encode(message: MsgXswapTransferResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.sequence !== BigInt(0)) writer.uint32(8).uint64(message.sequence);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgXswapTransferResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgXswapTransferResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sequence = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgXswapTransferResponse>): MsgXswapTransferResponse {
    return { sequence: object.sequence ?? BigInt(0) };
  },
};

export const MsgXswapExchangeCodec = {
  typeUrl: "/gxstable.xswap.v1.MsgExchange",
  encode(message: MsgXswapExchange, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.sourcePort !== "") writer.uint32(10).string(message.sourcePort);
    if (message.sourceChannel !== "") writer.uint32(18).string(message.sourceChannel);
    if (message.exchangeId !== "") writer.uint32(26).string(message.exchangeId);
    if (message.token) {
      writer.uint32(34).fork();
      Coin.encode(message.token, writer);
      writer.ldelim();
    }
    if (message.sender !== "") writer.uint32(42).string(message.sender);
    if (message.receiver !== "") writer.uint32(50).string(message.receiver);
    if (message.timeoutTimestamp !== BigInt(0)) writer.uint32(56).uint64(message.timeoutTimestamp);
    if (message.memo !== "") writer.uint32(66).string(message.memo);
    if (message.encoding !== "") writer.uint32(74).string(message.encoding);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgXswapExchange {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgXswapExchange();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sourcePort = reader.string();
          break;
        case 2:
          message.sourceChannel = reader.string();
          break;
        case 3:
          message.exchangeId = reader.string();
          break;
        case 4:
          message.token = Coin.decode(reader, reader.uint32());
          break;
        case 5:
          message.sender = reader.string();
          break;
        case 6:
          message.receiver = reader.string();
          break;
        case 7:
          message.timeoutTimestamp = reader.uint64();
          break;
        case 8:
          message.memo = reader.string();
          break;
        case 9:
          message.encoding = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgXswapExchange>): MsgXswapExchange {
    return {
      sourcePort: object.sourcePort ?? "",
      sourceChannel: object.sourceChannel ?? "",
      exchangeId: object.exchangeId ?? "",
      token: object.token ? Coin.fromPartial(object.token) : undefined,
      sender: object.sender ?? "",
      receiver: object.receiver ?? "",
      timeoutTimestamp: object.timeoutTimestamp ?? BigInt(0),
      memo: object.memo ?? "",
      encoding: object.encoding ?? "",
    };
  },
};

export const MsgXswapExchangeResponseCodec = {
  encode(message: MsgXswapExchangeResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.sequence !== BigInt(0)) writer.uint32(8).uint64(message.sequence);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array, length?: number): MsgXswapExchangeResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgXswapExchangeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sequence = reader.uint64();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgXswapExchangeResponse>): MsgXswapExchangeResponse {
    return { sequence: object.sequence ?? BigInt(0) };
  },
};

export const xswapTypes: ReadonlyArray<[string, GeneratedType]> = [
  [MsgXswapTransferCodec.typeUrl, MsgXswapTransferCodec as unknown as GeneratedType],
  [MsgXswapExchangeCodec.typeUrl, MsgXswapExchangeCodec as unknown as GeneratedType],
];

export interface MsgXswapTransferEncodeObject extends EncodeObject {
  readonly typeUrl: "/gxstable.xswap.v1.MsgTransfer";
  readonly value: Partial<MsgXswapTransfer>;
}

export interface MsgXswapExchangeEncodeObject extends EncodeObject {
  readonly typeUrl: "/gxstable.xswap.v1.MsgExchange";
  readonly value: Partial<MsgXswapExchange>;
}

export function isMsgXswapTransferEncodeObject(obj: EncodeObject): obj is MsgXswapTransferEncodeObject {
  return obj.typeUrl === "/gxstable.xswap.v1.MsgTransfer";
}

export function isMsgXswapExchangeEncodeObject(obj: EncodeObject): obj is MsgXswapExchangeEncodeObject {
  return obj.typeUrl === "/gxstable.xswap.v1.MsgExchange";
}
