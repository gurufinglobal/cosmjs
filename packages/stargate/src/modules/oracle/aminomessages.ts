/* eslint-disable @typescript-eslint/naming-convention */
import { AminoMsg } from "@cosmjs/amino";

import { AminoConverters } from "../../aminotypes";
import {
  AggregationRule,
  MsgRegisterOracleRequestDoc,
  MsgSubmitOracleData,
  MsgUpdateModeratorAddress,
  MsgUpdateOracleRequestDoc,
  OracleRequestDoc,
  OracleType,
  RequestStatus,
  SubmitDataSet,
} from "./messages";

export interface AminoMsgRegisterOracleRequestDoc extends AminoMsg {
  readonly type: "guru/oracle/MsgRegisterOracleRequestDoc";
  readonly value: {
    readonly moderator_address: string;
    readonly request_doc: {
      readonly request_id: string;
      readonly oracle_type: number;
      readonly name: string;
      readonly description: string;
      readonly period: number;
      readonly account_list: readonly string[];
      readonly quorum: number;
      readonly endpoints: readonly { readonly url: string; readonly parse_rule: string }[];
      readonly aggregation_rule: number;
      readonly status: number;
      readonly nonce: string;
    };
  };
}

export interface AminoMsgUpdateOracleRequestDoc extends AminoMsg {
  readonly type: "guru/oracle/MsgUpdateOracleRequestDoc";
  readonly value: {
    readonly moderator_address: string;
    readonly request_doc: {
      readonly request_id: string;
      readonly oracle_type: number;
      readonly name: string;
      readonly description: string;
      readonly period: number;
      readonly account_list: readonly string[];
      readonly quorum: number;
      readonly endpoints: readonly { readonly url: string; readonly parse_rule: string }[];
      readonly aggregation_rule: number;
      readonly status: number;
      readonly nonce: string;
    };
    readonly reason: string;
  };
}

export interface AminoMsgSubmitOracleData extends AminoMsg {
  readonly type: "guru/oracle/MsgSubmitOracleData";
  readonly value: {
    readonly authority_address: string;
    readonly data_set?: {
      readonly request_id: string;
      readonly nonce: string;
      readonly raw_data: string;
      readonly provider: string;
      readonly signature: string;
    };
  };
}

export interface AminoMsgUpdateModeratorAddress extends AminoMsg {
  readonly type: "guru/oracle/MsgUpdateModeratorAddress";
  readonly value: {
    readonly moderator_address: string;
    readonly new_moderator_address: string;
  };
}

function requestDocToAmino(doc: OracleRequestDoc): AminoMsgRegisterOracleRequestDoc["value"]["request_doc"] {
  return {
    request_id: doc.requestId.toString(),
    oracle_type: doc.oracleType,
    name: doc.name,
    description: doc.description,
    period: doc.period,
    account_list: doc.accountList,
    quorum: doc.quorum,
    endpoints: doc.endpoints.map((e) => ({ url: e.url, parse_rule: e.parseRule })),
    aggregation_rule: doc.aggregationRule,
    status: doc.status,
    nonce: doc.nonce.toString(),
  };
}

function requestDocFromAmino(doc: AminoMsgRegisterOracleRequestDoc["value"]["request_doc"]): OracleRequestDoc {
  return {
    requestId: BigInt(doc.request_id),
    oracleType: doc.oracle_type as OracleType,
    name: doc.name,
    description: doc.description,
    period: doc.period,
    accountList: [...doc.account_list],
    quorum: doc.quorum,
    endpoints: doc.endpoints.map((e) => ({ url: e.url, parseRule: e.parse_rule })),
    aggregationRule: doc.aggregation_rule as AggregationRule,
    status: doc.status as RequestStatus,
    nonce: BigInt(doc.nonce),
  };
}

export function createOracleAminoConverters(): AminoConverters {
  return {
    "/guru.oracle.v1.MsgRegisterOracleRequestDoc": {
      aminoType: "guru/oracle/MsgRegisterOracleRequestDoc",
      toAmino: ({ moderatorAddress, requestDoc }: MsgRegisterOracleRequestDoc): AminoMsgRegisterOracleRequestDoc["value"] => ({
        moderator_address: moderatorAddress,
        request_doc: requestDocToAmino(requestDoc),
      }),
      fromAmino: ({ moderator_address, request_doc }: AminoMsgRegisterOracleRequestDoc["value"]): MsgRegisterOracleRequestDoc => ({
        moderatorAddress: moderator_address,
        requestDoc: requestDocFromAmino(request_doc),
      }),
    },
    "/guru.oracle.v1.MsgUpdateOracleRequestDoc": {
      aminoType: "guru/oracle/MsgUpdateOracleRequestDoc",
      toAmino: ({ moderatorAddress, requestDoc, reason }: MsgUpdateOracleRequestDoc): AminoMsgUpdateOracleRequestDoc["value"] => ({
        moderator_address: moderatorAddress,
        request_doc: requestDocToAmino(requestDoc),
        reason: reason,
      }),
      fromAmino: ({ moderator_address, request_doc, reason }: AminoMsgUpdateOracleRequestDoc["value"]): MsgUpdateOracleRequestDoc => ({
        moderatorAddress: moderator_address,
        requestDoc: requestDocFromAmino(request_doc),
        reason: reason,
      }),
    },
    "/guru.oracle.v1.MsgSubmitOracleData": {
      aminoType: "guru/oracle/MsgSubmitOracleData",
      toAmino: ({ authorityAddress, dataSet }: MsgSubmitOracleData): AminoMsgSubmitOracleData["value"] => ({
        authority_address: authorityAddress,
        data_set: dataSet
          ? {
              request_id: dataSet.requestId.toString(),
              nonce: dataSet.nonce.toString(),
              raw_data: dataSet.rawData,
              provider: dataSet.provider,
              signature: Buffer.from(dataSet.signature).toString("base64"),
            }
          : undefined,
      }),
      fromAmino: ({ authority_address, data_set }: AminoMsgSubmitOracleData["value"]): MsgSubmitOracleData => ({
        authorityAddress: authority_address,
        dataSet: data_set
          ? {
              requestId: BigInt(data_set.request_id),
              nonce: BigInt(data_set.nonce),
              rawData: data_set.raw_data,
              provider: data_set.provider,
              signature: Buffer.from(data_set.signature, "base64"),
            }
          : undefined,
      }),
    },
    "/guru.oracle.v1.MsgUpdateModeratorAddress": {
      aminoType: "guru/oracle/MsgUpdateModeratorAddress",
      toAmino: ({ moderatorAddress, newModeratorAddress }: MsgUpdateModeratorAddress): AminoMsgUpdateModeratorAddress["value"] => ({
        moderator_address: moderatorAddress,
        new_moderator_address: newModeratorAddress,
      }),
      fromAmino: ({ moderator_address, new_moderator_address }: AminoMsgUpdateModeratorAddress["value"]): MsgUpdateModeratorAddress => ({
        moderatorAddress: moderator_address,
        newModeratorAddress: new_moderator_address,
      }),
    },
  };
}
