/* eslint-disable @typescript-eslint/naming-convention */
import { AminoMsg } from "@cosmjs/amino";
import { Duration } from "cosmjs-types/google/protobuf/duration";

import { AminoConverters } from "../../aminotypes";
import {
  Exchange,
  MsgChangeBexModerator,
  MsgRegisterAdmin,
  MsgRegisterExchange,
  MsgRemoveAdmin,
  MsgUpdateExchange,
  MsgUpdateRatemeter,
  MsgWithdrawFees,
  Ratemeter,
} from "./messages";

export interface AminoMsgRegisterAdmin extends AminoMsg {
  readonly type: "guru/bex/MsgRegisterAdmin";
  readonly value: {
    readonly moderator_address: string;
    readonly admin_address: string;
    readonly exchange_id: string;
  };
}

export interface AminoMsgRemoveAdmin extends AminoMsg {
  readonly type: "guru/bex/MsgRemoveAdmin";
  readonly value: {
    readonly moderator_address: string;
    readonly admin_address: string;
  };
}

export interface AminoMsgRegisterExchange extends AminoMsg {
  readonly type: "guru/bex/MsgRegisterExchange";
  readonly value: {
    readonly admin_address: string;
    readonly exchange?: {
      readonly id: string;
      readonly admin_address: string;
      readonly reserve_address: string;
      readonly denom_a: string;
      readonly ibc_denom_a: string;
      readonly port_a: string;
      readonly channel_a: string;
      readonly denom_b: string;
      readonly ibc_denom_b: string;
      readonly port_b: string;
      readonly channel_b: string;
      readonly fee: string;
      readonly limit: string;
      readonly oracle_request_id: string;
      readonly status: string;
      readonly metadata: Record<string, string>;
    };
  };
}

export interface AminoMsgUpdateExchange extends AminoMsg {
  readonly type: "guru/bex/MsgUpdateExchange";
  readonly value: {
    readonly admin_address: string;
    readonly exchange_id: string;
    readonly key: string;
    readonly value: string;
  };
}

export interface AminoMsgUpdateRatemeter extends AminoMsg {
  readonly type: "guru/bex/MsgUpdateRatemeter";
  readonly value: {
    readonly moderator_address: string;
    readonly ratemeter?: {
      readonly request_count_limit: string;
      readonly request_period?: {
        readonly seconds: string;
        readonly nanos: number;
      };
    };
  };
}

export interface AminoMsgWithdrawFees extends AminoMsg {
  readonly type: "guru/bex/MsgWithdrawFees";
  readonly value: {
    readonly admin_address: string;
    readonly exchange_id: string;
    readonly withdraw_address: string;
  };
}

export interface AminoMsgChangeBexModerator extends AminoMsg {
  readonly type: "guru/bex/MsgChangeBexModerator";
  readonly value: {
    readonly moderator_address: string;
    readonly new_moderator_address: string;
  };
}

function exchangeToAmino(exchange: Exchange): NonNullable<AminoMsgRegisterExchange["value"]["exchange"]> {
  return {
    id: exchange.id,
    admin_address: exchange.adminAddress,
    reserve_address: exchange.reserveAddress,
    denom_a: exchange.denomA,
    ibc_denom_a: exchange.ibcDenomA,
    port_a: exchange.portA,
    channel_a: exchange.channelA,
    denom_b: exchange.denomB,
    ibc_denom_b: exchange.ibcDenomB,
    port_b: exchange.portB,
    channel_b: exchange.channelB,
    fee: exchange.fee,
    limit: exchange.limit,
    oracle_request_id: exchange.oracleRequestId.toString(),
    status: exchange.status,
    metadata: exchange.metadata,
  };
}

function exchangeFromAmino(exchange: NonNullable<AminoMsgRegisterExchange["value"]["exchange"]>): Exchange {
  return {
    id: exchange.id,
    adminAddress: exchange.admin_address,
    reserveAddress: exchange.reserve_address,
    denomA: exchange.denom_a,
    ibcDenomA: exchange.ibc_denom_a,
    portA: exchange.port_a,
    channelA: exchange.channel_a,
    denomB: exchange.denom_b,
    ibcDenomB: exchange.ibc_denom_b,
    portB: exchange.port_b,
    channelB: exchange.channel_b,
    fee: exchange.fee,
    limit: exchange.limit,
    oracleRequestId: BigInt(exchange.oracle_request_id),
    status: exchange.status,
    metadata: exchange.metadata ?? {},
  };
}

function ratemeterToAmino(ratemeter: Ratemeter): NonNullable<AminoMsgUpdateRatemeter["value"]["ratemeter"]> {
  return {
    request_count_limit: ratemeter.requestCountLimit.toString(),
    request_period: ratemeter.requestPeriod
      ? {
          seconds: ratemeter.requestPeriod.seconds.toString(),
          nanos: ratemeter.requestPeriod.nanos,
        }
      : undefined,
  };
}

function ratemeterFromAmino(
  ratemeter: NonNullable<AminoMsgUpdateRatemeter["value"]["ratemeter"]>,
): Ratemeter {
  return {
    requestCountLimit: BigInt(ratemeter.request_count_limit),
    requestPeriod: ratemeter.request_period
      ? Duration.fromPartial({
          seconds: BigInt(ratemeter.request_period.seconds),
          nanos: ratemeter.request_period.nanos,
        })
      : undefined,
  };
}

export function createBexAminoConverters(): AminoConverters {
  return {
    "/guru.bex.v1.MsgRegisterAdmin": {
      aminoType: "guru/bex/MsgRegisterAdmin",
      toAmino: ({
        moderatorAddress,
        adminAddress,
        exchangeId,
      }: MsgRegisterAdmin): AminoMsgRegisterAdmin["value"] => ({
        moderator_address: moderatorAddress,
        admin_address: adminAddress,
        exchange_id: exchangeId,
      }),
      fromAmino: ({
        moderator_address,
        admin_address,
        exchange_id,
      }: AminoMsgRegisterAdmin["value"]): MsgRegisterAdmin => ({
        moderatorAddress: moderator_address,
        adminAddress: admin_address,
        exchangeId: exchange_id,
      }),
    },
    "/guru.bex.v1.MsgRemoveAdmin": {
      aminoType: "guru/bex/MsgRemoveAdmin",
      toAmino: ({ moderatorAddress, adminAddress }: MsgRemoveAdmin): AminoMsgRemoveAdmin["value"] => ({
        moderator_address: moderatorAddress,
        admin_address: adminAddress,
      }),
      fromAmino: ({ moderator_address, admin_address }: AminoMsgRemoveAdmin["value"]): MsgRemoveAdmin => ({
        moderatorAddress: moderator_address,
        adminAddress: admin_address,
      }),
    },
    "/guru.bex.v1.MsgRegisterExchange": {
      aminoType: "guru/bex/MsgRegisterExchange",
      toAmino: ({ adminAddress, exchange }: MsgRegisterExchange): AminoMsgRegisterExchange["value"] => ({
        admin_address: adminAddress,
        exchange: exchange ? exchangeToAmino(exchange) : undefined,
      }),
      fromAmino: ({ admin_address, exchange }: AminoMsgRegisterExchange["value"]): MsgRegisterExchange => ({
        adminAddress: admin_address,
        exchange: exchange ? exchangeFromAmino(exchange) : undefined,
      }),
    },
    "/guru.bex.v1.MsgUpdateExchange": {
      aminoType: "guru/bex/MsgUpdateExchange",
      toAmino: ({
        adminAddress,
        exchangeId,
        key,
        value,
      }: MsgUpdateExchange): AminoMsgUpdateExchange["value"] => ({
        admin_address: adminAddress,
        exchange_id: exchangeId,
        key,
        value,
      }),
      fromAmino: ({
        admin_address,
        exchange_id,
        key,
        value,
      }: AminoMsgUpdateExchange["value"]): MsgUpdateExchange => ({
        adminAddress: admin_address,
        exchangeId: exchange_id,
        key,
        value,
      }),
    },
    "/guru.bex.v1.MsgUpdateRatemeter": {
      aminoType: "guru/bex/MsgUpdateRatemeter",
      toAmino: ({ moderatorAddress, ratemeter }: MsgUpdateRatemeter): AminoMsgUpdateRatemeter["value"] => ({
        moderator_address: moderatorAddress,
        ratemeter: ratemeter ? ratemeterToAmino(ratemeter) : undefined,
      }),
      fromAmino: ({
        moderator_address,
        ratemeter,
      }: AminoMsgUpdateRatemeter["value"]): MsgUpdateRatemeter => ({
        moderatorAddress: moderator_address,
        ratemeter: ratemeter ? ratemeterFromAmino(ratemeter) : undefined,
      }),
    },
    "/guru.bex.v1.MsgWithdrawFees": {
      aminoType: "guru/bex/MsgWithdrawFees",
      toAmino: ({
        adminAddress,
        exchangeId,
        withdrawAddress,
      }: MsgWithdrawFees): AminoMsgWithdrawFees["value"] => ({
        admin_address: adminAddress,
        exchange_id: exchangeId,
        withdraw_address: withdrawAddress,
      }),
      fromAmino: ({
        admin_address,
        exchange_id,
        withdraw_address,
      }: AminoMsgWithdrawFees["value"]): MsgWithdrawFees => ({
        adminAddress: admin_address,
        exchangeId: exchange_id,
        withdrawAddress: withdraw_address,
      }),
    },
    "/guru.bex.v1.MsgChangeBexModerator": {
      aminoType: "guru/bex/MsgChangeBexModerator",
      toAmino: ({
        moderatorAddress,
        newModeratorAddress,
      }: MsgChangeBexModerator): AminoMsgChangeBexModerator["value"] => ({
        moderator_address: moderatorAddress,
        new_moderator_address: newModeratorAddress,
      }),
      fromAmino: ({
        moderator_address,
        new_moderator_address,
      }: AminoMsgChangeBexModerator["value"]): MsgChangeBexModerator => ({
        moderatorAddress: moderator_address,
        newModeratorAddress: new_moderator_address,
      }),
    },
  };
}
