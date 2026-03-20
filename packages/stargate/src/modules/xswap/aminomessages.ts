/* eslint-disable @typescript-eslint/naming-convention */
import { AminoMsg } from "@cosmjs/amino";

import { AminoConverters } from "../../aminotypes";
import { MsgXswapExchange, MsgXswapTransfer } from "./messages";

export interface AminoMsgXswapTransfer extends AminoMsg {
  readonly type: "gxstable/MsgTransfer";
  readonly value: {
    readonly source_port: string;
    readonly source_channel: string;
    readonly token?: {
      readonly denom: string;
      readonly amount: string;
    };
    readonly sender: string;
    readonly receiver: string;
    readonly timeout_timestamp: string;
    readonly memo: string;
    readonly encoding: string;
  };
}

export interface AminoMsgXswapExchange extends AminoMsg {
  readonly type: "gxstable/MsgExchange";
  readonly value: {
    readonly source_port: string;
    readonly source_channel: string;
    readonly exchange_id: string;
    readonly token?: {
      readonly denom: string;
      readonly amount: string;
    };
    readonly sender: string;
    readonly receiver: string;
    readonly timeout_timestamp: string;
    readonly memo: string;
    readonly encoding: string;
  };
}

export function createXswapAminoConverters(): AminoConverters {
  return {
    "/gxstable.xswap.v1.MsgTransfer": {
      aminoType: "gxstable/MsgTransfer",
      toAmino: ({
        sourcePort,
        sourceChannel,
        token,
        sender,
        receiver,
        timeoutTimestamp,
        memo,
        encoding,
      }: MsgXswapTransfer): AminoMsgXswapTransfer["value"] => ({
        source_port: sourcePort,
        source_channel: sourceChannel,
        token: token ? { denom: token.denom, amount: token.amount } : undefined,
        sender,
        receiver,
        timeout_timestamp: timeoutTimestamp.toString(),
        memo,
        encoding,
      }),
      fromAmino: ({
        source_port,
        source_channel,
        token,
        sender,
        receiver,
        timeout_timestamp,
        memo,
        encoding,
      }: AminoMsgXswapTransfer["value"]): MsgXswapTransfer => ({
        sourcePort: source_port,
        sourceChannel: source_channel,
        token: token ? { denom: token.denom, amount: token.amount } : undefined,
        sender,
        receiver,
        timeoutTimestamp: BigInt(timeout_timestamp),
        memo,
        encoding,
      }),
    },
    "/gxstable.xswap.v1.MsgExchange": {
      aminoType: "gxstable/MsgExchange",
      toAmino: ({
        sourcePort,
        sourceChannel,
        exchangeId,
        token,
        sender,
        receiver,
        timeoutTimestamp,
        memo,
        encoding,
      }: MsgXswapExchange): AminoMsgXswapExchange["value"] => ({
        source_port: sourcePort,
        source_channel: sourceChannel,
        exchange_id: exchangeId,
        token: token ? { denom: token.denom, amount: token.amount } : undefined,
        sender,
        receiver,
        timeout_timestamp: timeoutTimestamp.toString(),
        memo,
        encoding,
      }),
      fromAmino: ({
        source_port,
        source_channel,
        exchange_id,
        token,
        sender,
        receiver,
        timeout_timestamp,
        memo,
        encoding,
      }: AminoMsgXswapExchange["value"]): MsgXswapExchange => ({
        sourcePort: source_port,
        sourceChannel: source_channel,
        exchangeId: exchange_id,
        token: token ? { denom: token.denom, amount: token.amount } : undefined,
        sender,
        receiver,
        timeoutTimestamp: BigInt(timeout_timestamp),
        memo,
        encoding,
      }),
    },
  };
}
