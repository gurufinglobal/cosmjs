/* eslint-disable @typescript-eslint/naming-convention, no-bitwise, @typescript-eslint/no-use-before-define */
import { EncodeObject, GeneratedType } from "@cosmjs/proto-signing";
import { BinaryReader, BinaryWriter } from "cosmjs-types/binary";
import { Duration } from "cosmjs-types/google/protobuf/duration";

export interface Exchange {
  id: string;
  adminAddress: string;
  reserveAddress: string;
  denomA: string;
  ibcDenomA: string;
  portA: string;
  channelA: string;
  denomB: string;
  ibcDenomB: string;
  portB: string;
  channelB: string;
  fee: string;
  limit: string;
  oracleRequestId: bigint;
  status: string;
  metadata: Record<string, string>;
}

export interface Ratemeter {
  requestCountLimit: bigint;
  requestPeriod?: Duration;
}

export interface RateRegistry {
  requestCount: bigint;
  startWindow: bigint;
}

export interface MsgRegisterAdmin {
  moderatorAddress: string;
  adminAddress: string;
  exchangeId: string;
}

export interface MsgRegisterAdminResponse {}

export interface MsgRemoveAdmin {
  moderatorAddress: string;
  adminAddress: string;
}

export interface MsgRemoveAdminResponse {}

export interface MsgRegisterExchange {
  adminAddress: string;
  exchange?: Exchange;
}

export interface MsgRegisterExchangeResponse {}

export interface MsgUpdateExchange {
  adminAddress: string;
  exchangeId: string;
  key: string;
  value: string;
}

export interface MsgUpdateExchangeResponse {}

export interface MsgUpdateRatemeter {
  moderatorAddress: string;
  ratemeter?: Ratemeter;
}

export interface MsgUpdateRatemeterResponse {}

export interface MsgWithdrawFees {
  adminAddress: string;
  exchangeId: string;
  withdrawAddress: string;
}

export interface MsgWithdrawFeesResponse {}

export interface MsgChangeBexModerator {
  moderatorAddress: string;
  newModeratorAddress: string;
}

export interface MsgChangeBexModeratorResponse {}

function createBaseExchange(): Exchange {
  return {
    id: "",
    adminAddress: "",
    reserveAddress: "",
    denomA: "",
    ibcDenomA: "",
    portA: "",
    channelA: "",
    denomB: "",
    ibcDenomB: "",
    portB: "",
    channelB: "",
    fee: "",
    limit: "",
    oracleRequestId: BigInt(0),
    status: "",
    metadata: {},
  };
}

function createBaseRatemeter(): Ratemeter {
  return {
    requestCountLimit: BigInt(0),
    requestPeriod: undefined,
  };
}

function createBaseRateRegistry(): RateRegistry {
  return {
    requestCount: BigInt(0),
    startWindow: BigInt(0),
  };
}

export const ExchangeCodec = {
  encode(message: Exchange, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") writer.uint32(10).string(message.id);
    if (message.adminAddress !== "") writer.uint32(18).string(message.adminAddress);
    if (message.reserveAddress !== "") writer.uint32(26).string(message.reserveAddress);
    if (message.denomA !== "") writer.uint32(34).string(message.denomA);
    if (message.ibcDenomA !== "") writer.uint32(42).string(message.ibcDenomA);
    if (message.portA !== "") writer.uint32(50).string(message.portA);
    if (message.channelA !== "") writer.uint32(58).string(message.channelA);
    if (message.denomB !== "") writer.uint32(66).string(message.denomB);
    if (message.ibcDenomB !== "") writer.uint32(74).string(message.ibcDenomB);
    if (message.portB !== "") writer.uint32(82).string(message.portB);
    if (message.channelB !== "") writer.uint32(90).string(message.channelB);
    if (message.fee !== "") writer.uint32(98).string(message.fee);
    if (message.limit !== "") writer.uint32(106).string(message.limit);
    if (message.oracleRequestId !== BigInt(0)) writer.uint32(112).uint64(message.oracleRequestId);
    if (message.status !== "") writer.uint32(122).string(message.status);

    Object.entries(message.metadata).forEach(([key, value]) => {
      writer.uint32(130).fork();
      writer.uint32(10).string(key);
      writer.uint32(18).string(value);
      writer.ldelim();
    });

    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Exchange {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExchange();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.adminAddress = reader.string();
          break;
        case 3:
          message.reserveAddress = reader.string();
          break;
        case 4:
          message.denomA = reader.string();
          break;
        case 5:
          message.ibcDenomA = reader.string();
          break;
        case 6:
          message.portA = reader.string();
          break;
        case 7:
          message.channelA = reader.string();
          break;
        case 8:
          message.denomB = reader.string();
          break;
        case 9:
          message.ibcDenomB = reader.string();
          break;
        case 10:
          message.portB = reader.string();
          break;
        case 11:
          message.channelB = reader.string();
          break;
        case 12:
          message.fee = reader.string();
          break;
        case 13:
          message.limit = reader.string();
          break;
        case 14:
          message.oracleRequestId = reader.uint64();
          break;
        case 15:
          message.status = reader.string();
          break;
        case 16: {
          const entry = ExchangeMetadataEntryCodec.decode(reader, reader.uint32());
          if (entry.value !== undefined) {
            message.metadata[entry.key] = entry.value;
          }
          break;
        }
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },

  fromPartial(object: Partial<Exchange>): Exchange {
    return {
      id: object.id ?? "",
      adminAddress: object.adminAddress ?? "",
      reserveAddress: object.reserveAddress ?? "",
      denomA: object.denomA ?? "",
      ibcDenomA: object.ibcDenomA ?? "",
      portA: object.portA ?? "",
      channelA: object.channelA ?? "",
      denomB: object.denomB ?? "",
      ibcDenomB: object.ibcDenomB ?? "",
      portB: object.portB ?? "",
      channelB: object.channelB ?? "",
      fee: object.fee ?? "",
      limit: object.limit ?? "",
      oracleRequestId: object.oracleRequestId ?? BigInt(0),
      status: object.status ?? "",
      metadata: object.metadata ?? {},
    };
  },
};

const ExchangeMetadataEntryCodec = {
  encode(message: { key: string; value: string }, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.key !== "") writer.uint32(10).string(message.key);
    if (message.value !== "") writer.uint32(18).string(message.value);
    return writer;
  },

  decode(reader: BinaryReader, length: number): { key: string; value: string } {
    const end = reader.pos + length;
    const message = { key: "", value: "" };
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
};

export const RatemeterCodec = {
  encode(message: Ratemeter, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.requestCountLimit !== BigInt(0)) writer.uint32(8).uint64(message.requestCountLimit);
    if (message.requestPeriod) {
      writer.uint32(18).fork();
      Duration.encode(message.requestPeriod, writer);
      writer.ldelim();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Ratemeter {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRatemeter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.requestCountLimit = reader.uint64();
          break;
        case 2:
          message.requestPeriod = Duration.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },

  fromPartial(object: Partial<Ratemeter>): Ratemeter {
    return {
      requestCountLimit: object.requestCountLimit ?? BigInt(0),
      requestPeriod: object.requestPeriod ? Duration.fromPartial(object.requestPeriod) : undefined,
    };
  },
};

export const RateRegistryCodec = {
  encode(message: RateRegistry, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.requestCount !== BigInt(0)) writer.uint32(8).uint64(message.requestCount);
    if (message.startWindow !== BigInt(0)) writer.uint32(16).int64(message.startWindow);
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RateRegistry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRateRegistry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.requestCount = reader.uint64();
          break;
        case 2:
          message.startWindow = reader.int64();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },

  fromPartial(object: Partial<RateRegistry>): RateRegistry {
    return {
      requestCount: object.requestCount ?? BigInt(0),
      startWindow: object.startWindow ?? BigInt(0),
    };
  },
};

function createBaseMsgRegisterAdmin(): MsgRegisterAdmin {
  return { moderatorAddress: "", adminAddress: "", exchangeId: "" };
}

function createBaseMsgRemoveAdmin(): MsgRemoveAdmin {
  return { moderatorAddress: "", adminAddress: "" };
}

function createBaseMsgRegisterExchange(): MsgRegisterExchange {
  return { adminAddress: "", exchange: undefined };
}

function createBaseMsgUpdateExchange(): MsgUpdateExchange {
  return { adminAddress: "", exchangeId: "", key: "", value: "" };
}

function createBaseMsgUpdateRatemeter(): MsgUpdateRatemeter {
  return { moderatorAddress: "", ratemeter: undefined };
}

function createBaseMsgWithdrawFees(): MsgWithdrawFees {
  return { adminAddress: "", exchangeId: "", withdrawAddress: "" };
}

function createBaseMsgChangeBexModerator(): MsgChangeBexModerator {
  return { moderatorAddress: "", newModeratorAddress: "" };
}

export const MsgRegisterAdminCodec = {
  typeUrl: "/guru.bex.v1.MsgRegisterAdmin",
  encode(message: MsgRegisterAdmin, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.moderatorAddress !== "") writer.uint32(10).string(message.moderatorAddress);
    if (message.adminAddress !== "") writer.uint32(18).string(message.adminAddress);
    if (message.exchangeId !== "") writer.uint32(26).string(message.exchangeId);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgRegisterAdmin {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const message = createBaseMsgRegisterAdmin();
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.moderatorAddress = reader.string();
          break;
        case 2:
          message.adminAddress = reader.string();
          break;
        case 3:
          message.exchangeId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgRegisterAdmin>): MsgRegisterAdmin {
    return {
      moderatorAddress: object.moderatorAddress ?? "",
      adminAddress: object.adminAddress ?? "",
      exchangeId: object.exchangeId ?? "",
    };
  },
};

export const MsgRemoveAdminCodec = {
  typeUrl: "/guru.bex.v1.MsgRemoveAdmin",
  encode(message: MsgRemoveAdmin, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.moderatorAddress !== "") writer.uint32(10).string(message.moderatorAddress);
    if (message.adminAddress !== "") writer.uint32(18).string(message.adminAddress);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgRemoveAdmin {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const message = createBaseMsgRemoveAdmin();
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.moderatorAddress = reader.string();
          break;
        case 2:
          message.adminAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgRemoveAdmin>): MsgRemoveAdmin {
    return {
      moderatorAddress: object.moderatorAddress ?? "",
      adminAddress: object.adminAddress ?? "",
    };
  },
};

export const MsgRegisterExchangeCodec = {
  typeUrl: "/guru.bex.v1.MsgRegisterExchange",
  encode(message: MsgRegisterExchange, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.adminAddress !== "") writer.uint32(10).string(message.adminAddress);
    if (message.exchange) {
      writer.uint32(26).fork();
      ExchangeCodec.encode(message.exchange, writer);
      writer.ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgRegisterExchange {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const message = createBaseMsgRegisterExchange();
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.adminAddress = reader.string();
          break;
        case 3:
          message.exchange = ExchangeCodec.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgRegisterExchange>): MsgRegisterExchange {
    return {
      adminAddress: object.adminAddress ?? "",
      exchange: object.exchange ? ExchangeCodec.fromPartial(object.exchange) : undefined,
    };
  },
};

export const MsgUpdateExchangeCodec = {
  typeUrl: "/guru.bex.v1.MsgUpdateExchange",
  encode(message: MsgUpdateExchange, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.adminAddress !== "") writer.uint32(10).string(message.adminAddress);
    if (message.exchangeId !== "") writer.uint32(18).string(message.exchangeId);
    if (message.key !== "") writer.uint32(26).string(message.key);
    if (message.value !== "") writer.uint32(34).string(message.value);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgUpdateExchange {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const message = createBaseMsgUpdateExchange();
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.adminAddress = reader.string();
          break;
        case 2:
          message.exchangeId = reader.string();
          break;
        case 3:
          message.key = reader.string();
          break;
        case 4:
          message.value = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgUpdateExchange>): MsgUpdateExchange {
    return {
      adminAddress: object.adminAddress ?? "",
      exchangeId: object.exchangeId ?? "",
      key: object.key ?? "",
      value: object.value ?? "",
    };
  },
};

export const MsgUpdateRatemeterCodec = {
  typeUrl: "/guru.bex.v1.MsgUpdateRatemeter",
  encode(message: MsgUpdateRatemeter, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.moderatorAddress !== "") writer.uint32(10).string(message.moderatorAddress);
    if (message.ratemeter) {
      writer.uint32(18).fork();
      RatemeterCodec.encode(message.ratemeter, writer);
      writer.ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgUpdateRatemeter {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const message = createBaseMsgUpdateRatemeter();
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.moderatorAddress = reader.string();
          break;
        case 2:
          message.ratemeter = RatemeterCodec.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgUpdateRatemeter>): MsgUpdateRatemeter {
    return {
      moderatorAddress: object.moderatorAddress ?? "",
      ratemeter: object.ratemeter ? RatemeterCodec.fromPartial(object.ratemeter) : undefined,
    };
  },
};

export const MsgWithdrawFeesCodec = {
  typeUrl: "/guru.bex.v1.MsgWithdrawFees",
  encode(message: MsgWithdrawFees, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.adminAddress !== "") writer.uint32(10).string(message.adminAddress);
    if (message.exchangeId !== "") writer.uint32(18).string(message.exchangeId);
    if (message.withdrawAddress !== "") writer.uint32(26).string(message.withdrawAddress);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgWithdrawFees {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const message = createBaseMsgWithdrawFees();
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.adminAddress = reader.string();
          break;
        case 2:
          message.exchangeId = reader.string();
          break;
        case 3:
          message.withdrawAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgWithdrawFees>): MsgWithdrawFees {
    return {
      adminAddress: object.adminAddress ?? "",
      exchangeId: object.exchangeId ?? "",
      withdrawAddress: object.withdrawAddress ?? "",
    };
  },
};

export const MsgChangeBexModeratorCodec = {
  typeUrl: "/guru.bex.v1.MsgChangeBexModerator",
  encode(message: MsgChangeBexModerator, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.moderatorAddress !== "") writer.uint32(10).string(message.moderatorAddress);
    if (message.newModeratorAddress !== "") writer.uint32(18).string(message.newModeratorAddress);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgChangeBexModerator {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const message = createBaseMsgChangeBexModerator();
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.moderatorAddress = reader.string();
          break;
        case 2:
          message.newModeratorAddress = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(object: Partial<MsgChangeBexModerator>): MsgChangeBexModerator {
    return {
      moderatorAddress: object.moderatorAddress ?? "",
      newModeratorAddress: object.newModeratorAddress ?? "",
    };
  },
};

export const bexTypes: ReadonlyArray<[string, GeneratedType]> = [
  [MsgRegisterAdminCodec.typeUrl, MsgRegisterAdminCodec as unknown as GeneratedType],
  [MsgRemoveAdminCodec.typeUrl, MsgRemoveAdminCodec as unknown as GeneratedType],
  [MsgRegisterExchangeCodec.typeUrl, MsgRegisterExchangeCodec as unknown as GeneratedType],
  [MsgUpdateExchangeCodec.typeUrl, MsgUpdateExchangeCodec as unknown as GeneratedType],
  [MsgUpdateRatemeterCodec.typeUrl, MsgUpdateRatemeterCodec as unknown as GeneratedType],
  [MsgWithdrawFeesCodec.typeUrl, MsgWithdrawFeesCodec as unknown as GeneratedType],
  [MsgChangeBexModeratorCodec.typeUrl, MsgChangeBexModeratorCodec as unknown as GeneratedType],
];

export interface MsgRegisterAdminEncodeObject extends EncodeObject {
  readonly typeUrl: "/guru.bex.v1.MsgRegisterAdmin";
  readonly value: Partial<MsgRegisterAdmin>;
}

export function isMsgRegisterAdminEncodeObject(obj: EncodeObject): obj is MsgRegisterAdminEncodeObject {
  return obj.typeUrl === "/guru.bex.v1.MsgRegisterAdmin";
}

export interface MsgRemoveAdminEncodeObject extends EncodeObject {
  readonly typeUrl: "/guru.bex.v1.MsgRemoveAdmin";
  readonly value: Partial<MsgRemoveAdmin>;
}

export function isMsgRemoveAdminEncodeObject(obj: EncodeObject): obj is MsgRemoveAdminEncodeObject {
  return obj.typeUrl === "/guru.bex.v1.MsgRemoveAdmin";
}

export interface MsgRegisterExchangeEncodeObject extends EncodeObject {
  readonly typeUrl: "/guru.bex.v1.MsgRegisterExchange";
  readonly value: Partial<MsgRegisterExchange>;
}

export function isMsgRegisterExchangeEncodeObject(obj: EncodeObject): obj is MsgRegisterExchangeEncodeObject {
  return obj.typeUrl === "/guru.bex.v1.MsgRegisterExchange";
}

export interface MsgUpdateExchangeEncodeObject extends EncodeObject {
  readonly typeUrl: "/guru.bex.v1.MsgUpdateExchange";
  readonly value: Partial<MsgUpdateExchange>;
}

export function isMsgUpdateExchangeEncodeObject(obj: EncodeObject): obj is MsgUpdateExchangeEncodeObject {
  return obj.typeUrl === "/guru.bex.v1.MsgUpdateExchange";
}

export interface MsgUpdateRatemeterEncodeObject extends EncodeObject {
  readonly typeUrl: "/guru.bex.v1.MsgUpdateRatemeter";
  readonly value: Partial<MsgUpdateRatemeter>;
}

export function isMsgUpdateRatemeterEncodeObject(obj: EncodeObject): obj is MsgUpdateRatemeterEncodeObject {
  return obj.typeUrl === "/guru.bex.v1.MsgUpdateRatemeter";
}

export interface MsgWithdrawFeesEncodeObject extends EncodeObject {
  readonly typeUrl: "/guru.bex.v1.MsgWithdrawFees";
  readonly value: Partial<MsgWithdrawFees>;
}

export function isMsgWithdrawFeesEncodeObject(obj: EncodeObject): obj is MsgWithdrawFeesEncodeObject {
  return obj.typeUrl === "/guru.bex.v1.MsgWithdrawFees";
}

export interface MsgChangeBexModeratorEncodeObject extends EncodeObject {
  readonly typeUrl: "/guru.bex.v1.MsgChangeBexModerator";
  readonly value: Partial<MsgChangeBexModerator>;
}

export function isMsgChangeBexModeratorEncodeObject(
  obj: EncodeObject,
): obj is MsgChangeBexModeratorEncodeObject {
  return obj.typeUrl === "/guru.bex.v1.MsgChangeBexModerator";
}
