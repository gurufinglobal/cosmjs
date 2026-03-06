import { EncodeObject, GeneratedType } from "@cosmjs/proto-signing";
import { BinaryReader, BinaryWriter } from "cosmjs-types/binary";

// ---- Enums ----

export enum OracleType {
  ORACLE_TYPE_UNSPECIFIED = 0,
  ORACLE_TYPE_MIN_GAS_PRICE = 1,
  ORACLE_TYPE_CURRENCY = 2,
  ORACLE_TYPE_STOCK = 3,
  ORACLE_TYPE_CRYPTO = 4,
}

export enum RequestStatus {
  REQUEST_STATUS_UNSPECIFIED = 0,
  REQUEST_STATUS_ENABLED = 1,
  REQUEST_STATUS_PAUSED = 2,
  REQUEST_STATUS_DISABLED = 3,
}

export enum AggregationRule {
  AGGREGATION_RULE_UNSPECIFIED = 0,
  AGGREGATION_RULE_AVG = 1,
  AGGREGATION_RULE_MIN = 2,
  AGGREGATION_RULE_MAX = 3,
  AGGREGATION_RULE_MEDIAN = 4,
}

// ---- Types ----

export interface OracleEndpoint {
  url: string;
  parseRule: string;
}

export interface OracleRequestDoc {
  requestId: bigint;
  oracleType: OracleType;
  name: string;
  description: string;
  period: number;
  accountList: string[];
  quorum: number;
  endpoints: OracleEndpoint[];
  aggregationRule: AggregationRule;
  status: RequestStatus;
  nonce: bigint;
}

export interface SubmitDataSet {
  requestId: bigint;
  nonce: bigint;
  rawData: string;
  provider: string;
  signature: Uint8Array;
}

export interface OracleParams {
  enableOracle: boolean;
  submitWindow: bigint;
  minSubmitPerWindow: string;
  slashFractionDowntime: string;
  maxAccountListSize: bigint;
}

// ---- Message Types ----

export interface MsgRegisterOracleRequestDoc {
  moderatorAddress: string;
  requestDoc: OracleRequestDoc;
}

export interface MsgRegisterOracleRequestDocResponse {
  requestId: bigint;
}

export interface MsgUpdateOracleRequestDoc {
  moderatorAddress: string;
  requestDoc: OracleRequestDoc;
  reason: string;
}

export interface MsgUpdateOracleRequestDocResponse {
  requestId: bigint;
}

export interface MsgSubmitOracleData {
  authorityAddress: string;
  dataSet?: SubmitDataSet;
}

export interface MsgSubmitOracleDataResponse {}

export interface MsgUpdateModeratorAddress {
  moderatorAddress: string;
  newModeratorAddress: string;
}

export interface MsgUpdateModeratorAddressResponse {}

export interface MsgOracleUpdateParams {
  authority: string;
  params: OracleParams;
}

export interface MsgOracleUpdateParamsResponse {}

// ---- DataSet (query-only) ----

export interface DataSet {
  requestId: bigint;
  nonce: bigint;
  blockHeight: bigint;
  blockTime: bigint;
  rawData: string;
}

// ---- Protobuf Codecs ----

const OracleEndpointCodec = {
  encode(msg: OracleEndpoint, writer = new BinaryWriter()): BinaryWriter {
    if (msg.url) writer.uint32(10).string(msg.url);
    if (msg.parseRule) writer.uint32(18).string(msg.parseRule);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): OracleEndpoint {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const message: OracleEndpoint = { url: "", parseRule: "" };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: message.url = reader.string(); break;
        case 2: message.parseRule = reader.string(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return message;
  },
  fromPartial(obj: Partial<OracleEndpoint>): OracleEndpoint {
    return { url: obj.url ?? "", parseRule: obj.parseRule ?? "" };
  },
};

export const OracleRequestDocCodec = {
  encode(msg: OracleRequestDoc, writer = new BinaryWriter()): BinaryWriter {
    if (msg.requestId !== BigInt(0)) writer.uint32(8).uint64(msg.requestId);
    if (msg.oracleType !== 0) writer.uint32(16).int32(msg.oracleType);
    if (msg.name) writer.uint32(26).string(msg.name);
    if (msg.description) writer.uint32(34).string(msg.description);
    if (msg.period !== 0) writer.uint32(40).uint32(msg.period);
    for (const a of msg.accountList) writer.uint32(50).string(a);
    if (msg.quorum !== 0) writer.uint32(56).uint32(msg.quorum);
    for (const e of msg.endpoints) {
      writer.uint32(66).fork();
      OracleEndpointCodec.encode(e, writer);
      writer.ldelim();
    }
    if (msg.aggregationRule !== 0) writer.uint32(72).int32(msg.aggregationRule);
    if (msg.status !== 0) writer.uint32(80).int32(msg.status);
    if (msg.nonce !== BigInt(0)) writer.uint32(96).uint64(msg.nonce);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): OracleRequestDoc {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: OracleRequestDoc = {
      requestId: BigInt(0), oracleType: 0, name: "", description: "",
      period: 0, accountList: [], quorum: 0, endpoints: [],
      aggregationRule: 0, status: 0, nonce: BigInt(0),
    };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.requestId = reader.uint64() as bigint; break;
        case 2: msg.oracleType = reader.int32(); break;
        case 3: msg.name = reader.string(); break;
        case 4: msg.description = reader.string(); break;
        case 5: msg.period = reader.uint32(); break;
        case 6: msg.accountList.push(reader.string()); break;
        case 7: msg.quorum = reader.uint32(); break;
        case 8: msg.endpoints.push(OracleEndpointCodec.decode(reader.bytes())); break;
        case 9: msg.aggregationRule = reader.int32(); break;
        case 10: msg.status = reader.int32(); break;
        case 12: msg.nonce = reader.uint64() as bigint; break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<OracleRequestDoc>): OracleRequestDoc {
    return {
      requestId: obj.requestId ?? BigInt(0),
      oracleType: obj.oracleType ?? 0,
      name: obj.name ?? "",
      description: obj.description ?? "",
      period: obj.period ?? 0,
      accountList: obj.accountList ?? [],
      quorum: obj.quorum ?? 0,
      endpoints: obj.endpoints ?? [],
      aggregationRule: obj.aggregationRule ?? 0,
      status: obj.status ?? 0,
      nonce: obj.nonce ?? BigInt(0),
    };
  },
};

const SubmitDataSetCodec = {
  encode(msg: SubmitDataSet, writer = new BinaryWriter()): BinaryWriter {
    if (msg.requestId !== BigInt(0)) writer.uint32(8).uint64(msg.requestId);
    if (msg.nonce !== BigInt(0)) writer.uint32(16).uint64(msg.nonce);
    if (msg.rawData) writer.uint32(26).string(msg.rawData);
    if (msg.provider) writer.uint32(34).string(msg.provider);
    if (msg.signature?.length) writer.uint32(42).bytes(msg.signature);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): SubmitDataSet {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: SubmitDataSet = { requestId: BigInt(0), nonce: BigInt(0), rawData: "", provider: "", signature: new Uint8Array() };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.requestId = reader.uint64() as bigint; break;
        case 2: msg.nonce = reader.uint64() as bigint; break;
        case 3: msg.rawData = reader.string(); break;
        case 4: msg.provider = reader.string(); break;
        case 5: msg.signature = reader.bytes(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<SubmitDataSet>): SubmitDataSet {
    return {
      requestId: obj.requestId ?? BigInt(0),
      nonce: obj.nonce ?? BigInt(0),
      rawData: obj.rawData ?? "",
      provider: obj.provider ?? "",
      signature: obj.signature ?? new Uint8Array(),
    };
  },
};

export const MsgRegisterOracleRequestDocCodec = {
  typeUrl: "/guru.oracle.v1.MsgRegisterOracleRequestDoc",
  encode(msg: MsgRegisterOracleRequestDoc, writer = new BinaryWriter()): BinaryWriter {
    if (msg.moderatorAddress) writer.uint32(10).string(msg.moderatorAddress);
    writer.uint32(18).fork();
    OracleRequestDocCodec.encode(msg.requestDoc, writer);
    writer.ldelim();
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgRegisterOracleRequestDoc {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: MsgRegisterOracleRequestDoc = {
      moderatorAddress: "",
      requestDoc: OracleRequestDocCodec.fromPartial({}),
    };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.moderatorAddress = reader.string(); break;
        case 2: msg.requestDoc = OracleRequestDocCodec.decode(reader.bytes()); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<MsgRegisterOracleRequestDoc>): MsgRegisterOracleRequestDoc {
    return {
      moderatorAddress: obj.moderatorAddress ?? "",
      requestDoc: OracleRequestDocCodec.fromPartial(obj.requestDoc ?? {}),
    };
  },
};

export const MsgUpdateOracleRequestDocCodec = {
  typeUrl: "/guru.oracle.v1.MsgUpdateOracleRequestDoc",
  encode(msg: MsgUpdateOracleRequestDoc, writer = new BinaryWriter()): BinaryWriter {
    if (msg.moderatorAddress) writer.uint32(10).string(msg.moderatorAddress);
    writer.uint32(18).fork();
    OracleRequestDocCodec.encode(msg.requestDoc, writer);
    writer.ldelim();
    if (msg.reason) writer.uint32(26).string(msg.reason);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgUpdateOracleRequestDoc {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: MsgUpdateOracleRequestDoc = {
      moderatorAddress: "",
      requestDoc: OracleRequestDocCodec.fromPartial({}),
      reason: "",
    };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.moderatorAddress = reader.string(); break;
        case 2: msg.requestDoc = OracleRequestDocCodec.decode(reader.bytes()); break;
        case 3: msg.reason = reader.string(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<MsgUpdateOracleRequestDoc>): MsgUpdateOracleRequestDoc {
    return {
      moderatorAddress: obj.moderatorAddress ?? "",
      requestDoc: OracleRequestDocCodec.fromPartial(obj.requestDoc ?? {}),
      reason: obj.reason ?? "",
    };
  },
};

export const MsgSubmitOracleDataCodec = {
  typeUrl: "/guru.oracle.v1.MsgSubmitOracleData",
  encode(msg: MsgSubmitOracleData, writer = new BinaryWriter()): BinaryWriter {
    if (msg.authorityAddress) writer.uint32(10).string(msg.authorityAddress);
    if (msg.dataSet) {
      writer.uint32(18).fork();
      SubmitDataSetCodec.encode(msg.dataSet, writer);
      writer.ldelim();
    }
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgSubmitOracleData {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: MsgSubmitOracleData = { authorityAddress: "" };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.authorityAddress = reader.string(); break;
        case 2: msg.dataSet = SubmitDataSetCodec.decode(reader.bytes()); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
  fromPartial(obj: Partial<MsgSubmitOracleData>): MsgSubmitOracleData {
    return {
      authorityAddress: obj.authorityAddress ?? "",
      dataSet: obj.dataSet ? SubmitDataSetCodec.fromPartial(obj.dataSet) : undefined,
    };
  },
};

export const MsgUpdateModeratorAddressCodec = {
  typeUrl: "/guru.oracle.v1.MsgUpdateModeratorAddress",
  encode(msg: MsgUpdateModeratorAddress, writer = new BinaryWriter()): BinaryWriter {
    if (msg.moderatorAddress) writer.uint32(10).string(msg.moderatorAddress);
    if (msg.newModeratorAddress) writer.uint32(18).string(msg.newModeratorAddress);
    return writer;
  },
  decode(input: BinaryReader | Uint8Array): MsgUpdateModeratorAddress {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: MsgUpdateModeratorAddress = { moderatorAddress: "", newModeratorAddress: "" };
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
  fromPartial(obj: Partial<MsgUpdateModeratorAddress>): MsgUpdateModeratorAddress {
    return {
      moderatorAddress: obj.moderatorAddress ?? "",
      newModeratorAddress: obj.newModeratorAddress ?? "",
    };
  },
};

// ---- GeneratedType array ----

export const oracleTypes: ReadonlyArray<[string, GeneratedType]> = [
  [MsgRegisterOracleRequestDocCodec.typeUrl, MsgRegisterOracleRequestDocCodec as unknown as GeneratedType],
  [MsgUpdateOracleRequestDocCodec.typeUrl, MsgUpdateOracleRequestDocCodec as unknown as GeneratedType],
  [MsgSubmitOracleDataCodec.typeUrl, MsgSubmitOracleDataCodec as unknown as GeneratedType],
  [MsgUpdateModeratorAddressCodec.typeUrl, MsgUpdateModeratorAddressCodec as unknown as GeneratedType],
];

// ---- EncodeObject interfaces ----

export interface MsgRegisterOracleRequestDocEncodeObject extends EncodeObject {
  readonly typeUrl: "/guru.oracle.v1.MsgRegisterOracleRequestDoc";
  readonly value: Partial<MsgRegisterOracleRequestDoc>;
}

export function isMsgRegisterOracleRequestDocEncodeObject(
  obj: EncodeObject,
): obj is MsgRegisterOracleRequestDocEncodeObject {
  return obj.typeUrl === "/guru.oracle.v1.MsgRegisterOracleRequestDoc";
}

export interface MsgUpdateOracleRequestDocEncodeObject extends EncodeObject {
  readonly typeUrl: "/guru.oracle.v1.MsgUpdateOracleRequestDoc";
  readonly value: Partial<MsgUpdateOracleRequestDoc>;
}

export function isMsgUpdateOracleRequestDocEncodeObject(
  obj: EncodeObject,
): obj is MsgUpdateOracleRequestDocEncodeObject {
  return obj.typeUrl === "/guru.oracle.v1.MsgUpdateOracleRequestDoc";
}

export interface MsgSubmitOracleDataEncodeObject extends EncodeObject {
  readonly typeUrl: "/guru.oracle.v1.MsgSubmitOracleData";
  readonly value: Partial<MsgSubmitOracleData>;
}

export function isMsgSubmitOracleDataEncodeObject(
  obj: EncodeObject,
): obj is MsgSubmitOracleDataEncodeObject {
  return obj.typeUrl === "/guru.oracle.v1.MsgSubmitOracleData";
}

export interface MsgUpdateModeratorAddressEncodeObject extends EncodeObject {
  readonly typeUrl: "/guru.oracle.v1.MsgUpdateModeratorAddress";
  readonly value: Partial<MsgUpdateModeratorAddress>;
}

export function isMsgUpdateModeratorAddressEncodeObject(
  obj: EncodeObject,
): obj is MsgUpdateModeratorAddressEncodeObject {
  return obj.typeUrl === "/guru.oracle.v1.MsgUpdateModeratorAddress";
}
