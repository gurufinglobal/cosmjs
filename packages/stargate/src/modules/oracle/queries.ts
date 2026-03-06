import { BinaryReader, BinaryWriter } from "cosmjs-types/binary";

import { createProtobufRpcClient, QueryClient } from "../../queryclient";
import {
  DataSet,
  OracleParams,
  OracleRequestDoc,
  OracleRequestDocCodec,
  RequestStatus,
  SubmitDataSet,
} from "./messages";

// ---- DataSet codec (query-only type) ----
const DataSetCodec = {
  decode(input: BinaryReader | Uint8Array): DataSet {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: DataSet = {
      requestId: BigInt(0),
      nonce: BigInt(0),
      blockHeight: BigInt(0),
      blockTime: BigInt(0),
      rawData: "",
    };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.requestId = reader.uint64() as bigint; break;
        case 2: msg.nonce = reader.uint64() as bigint; break;
        case 3: msg.blockHeight = reader.uint64() as bigint; break;
        case 4: msg.blockTime = reader.uint64() as bigint; break;
        case 5: msg.rawData = reader.string(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
};

const SubmitDataSetCodec = {
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
};

const OracleParamsCodec = {
  decode(input: BinaryReader | Uint8Array): OracleParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: OracleParams = { enableOracle: false, submitWindow: BigInt(0), minSubmitPerWindow: "", slashFractionDowntime: "", maxAccountListSize: BigInt(0) };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.enableOracle = reader.bool(); break;
        case 2: msg.submitWindow = reader.uint64() as bigint; break;
        case 3: msg.minSubmitPerWindow = reader.string(); break;
        case 4: msg.slashFractionDowntime = reader.string(); break;
        case 5: msg.maxAccountListSize = reader.uint64() as bigint; break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
};

// ---- Request/Response codecs ----

const QueryParamsRequest = { encode(): Uint8Array { return new Uint8Array(); } };

const QueryParamsResponse = {
  decode(input: Uint8Array): { params: OracleParams } {
    const reader = new BinaryReader(input);
    let params: OracleParams | undefined;
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: params = OracleParamsCodec.decode(reader.bytes()); break;
        default: reader.skipType(tag & 7);
      }
    }
    if (!params) throw new Error("OracleParamsResponse: params missing");
    return { params };
  },
};

const QueryOracleSubmitDataRequest = {
  encode(msg: { requestId: bigint; nonce: bigint; provider: string }): Uint8Array {
    const writer = new BinaryWriter();
    if (msg.requestId) writer.uint32(8).uint64(msg.requestId);
    if (msg.nonce) writer.uint32(16).uint64(msg.nonce);
    if (msg.provider) writer.uint32(26).string(msg.provider);
    return writer.finish();
  },
};

const QueryOracleSubmitDataResponse = {
  decode(input: Uint8Array): { submitDatas: SubmitDataSet[] } {
    const reader = new BinaryReader(input);
    const submitDatas: SubmitDataSet[] = [];
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: submitDatas.push(SubmitDataSetCodec.decode(reader.bytes())); break;
        default: reader.skipType(tag & 7);
      }
    }
    return { submitDatas };
  },
};

const QueryOracleDataRequest = {
  encode(msg: { requestId: bigint }): Uint8Array {
    const writer = new BinaryWriter();
    if (msg.requestId) writer.uint32(8).uint64(msg.requestId);
    return writer.finish();
  },
};

const QueryOracleDataResponse = {
  decode(input: Uint8Array): { dataSet?: DataSet } {
    const reader = new BinaryReader(input);
    let dataSet: DataSet | undefined;
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: dataSet = DataSetCodec.decode(reader.bytes()); break;
        default: reader.skipType(tag & 7);
      }
    }
    return { dataSet };
  },
};

const QueryOracleRequestDocRequest = {
  encode(msg: { requestId: bigint }): Uint8Array {
    const writer = new BinaryWriter();
    if (msg.requestId) writer.uint32(8).uint64(msg.requestId);
    return writer.finish();
  },
};

const QueryOracleRequestDocResponse = {
  decode(input: Uint8Array): { requestDoc: OracleRequestDoc } {
    const reader = new BinaryReader(input);
    let requestDoc: OracleRequestDoc | undefined;
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: requestDoc = OracleRequestDocCodec.decode(reader.bytes()); break;
        default: reader.skipType(tag & 7);
      }
    }
    if (!requestDoc) throw new Error("OracleRequestDocResponse: requestDoc missing");
    return { requestDoc };
  },
};

const QueryOracleRequestDocsRequest = {
  encode(msg: { status: RequestStatus }): Uint8Array {
    const writer = new BinaryWriter();
    if (msg.status !== 0) writer.uint32(8).int32(msg.status);
    return writer.finish();
  },
};

const QueryOracleRequestDocsResponse = {
  decode(input: Uint8Array): { oracleRequestDocs: OracleRequestDoc[] } {
    const reader = new BinaryReader(input);
    const docs: OracleRequestDoc[] = [];
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: docs.push(OracleRequestDocCodec.decode(reader.bytes())); break;
        default: reader.skipType(tag & 7);
      }
    }
    return { oracleRequestDocs: docs };
  },
};

const QueryModeratorAddressRequest = { encode(): Uint8Array { return new Uint8Array(); } };

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

// ---- Extension ----

export interface OracleExtension {
  readonly oracle: {
    readonly params: () => Promise<OracleParams>;
    readonly oracleSubmitData: (requestId: bigint, nonce: bigint, provider: string) => Promise<SubmitDataSet[]>;
    readonly oracleData: (requestId: bigint) => Promise<DataSet | undefined>;
    readonly oracleRequestDoc: (requestId: bigint) => Promise<OracleRequestDoc>;
    readonly oracleRequestDocs: (status?: RequestStatus) => Promise<OracleRequestDoc[]>;
    readonly moderatorAddress: () => Promise<string>;
  };
}

export function setupOracleExtension(base: QueryClient): OracleExtension {
  const rpc = createProtobufRpcClient(base);

  return {
    oracle: {
      params: async () => {
        const response = await rpc.request("guru.oracle.v1.Query", "Params", QueryParamsRequest.encode());
        return QueryParamsResponse.decode(response).params;
      },
      oracleSubmitData: async (requestId: bigint, nonce: bigint, provider: string) => {
        const response = await rpc.request(
          "guru.oracle.v1.Query",
          "OracleSubmitData",
          QueryOracleSubmitDataRequest.encode({ requestId, nonce, provider }),
        );
        return QueryOracleSubmitDataResponse.decode(response).submitDatas;
      },
      oracleData: async (requestId: bigint) => {
        const response = await rpc.request(
          "guru.oracle.v1.Query",
          "OracleData",
          QueryOracleDataRequest.encode({ requestId }),
        );
        return QueryOracleDataResponse.decode(response).dataSet;
      },
      oracleRequestDoc: async (requestId: bigint) => {
        const response = await rpc.request(
          "guru.oracle.v1.Query",
          "OracleRequestDoc",
          QueryOracleRequestDocRequest.encode({ requestId }),
        );
        return QueryOracleRequestDocResponse.decode(response).requestDoc;
      },
      oracleRequestDocs: async (status: RequestStatus = RequestStatus.REQUEST_STATUS_UNSPECIFIED) => {
        const response = await rpc.request(
          "guru.oracle.v1.Query",
          "OracleRequestDocs",
          QueryOracleRequestDocsRequest.encode({ status }),
        );
        return QueryOracleRequestDocsResponse.decode(response).oracleRequestDocs;
      },
      moderatorAddress: async () => {
        const response = await rpc.request(
          "guru.oracle.v1.Query",
          "ModeratorAddress",
          QueryModeratorAddressRequest.encode(),
        );
        return QueryModeratorAddressResponse.decode(response).moderatorAddress;
      },
    },
  };
}
