import { AminoTypes } from "../../aminotypes";
import { AminoMsgRegisterExchange, AminoMsgUpdateRatemeter, createBexAminoConverters } from "./aminomessages";
import { MsgRegisterExchangeEncodeObject, MsgUpdateRatemeterEncodeObject } from "./messages";

describe("AminoTypes", () => {
  it("converts MsgRegisterExchange to amino and back", () => {
    const aminoTypes = new AminoTypes(createBexAminoConverters());
    const msg: MsgRegisterExchangeEncodeObject = {
      typeUrl: "/guru.bex.v1.MsgRegisterExchange",
      value: {
        adminAddress: "guru1admin",
        exchange: {
          id: "42",
          adminAddress: "guru1admin",
          reserveAddress: "guru1reserve",
          denomA: "uguru",
          ibcDenomA: "ibc/AAA",
          portA: "transfer",
          channelA: "channel-0",
          denomB: "uusdc",
          ibcDenomB: "ibc/BBB",
          portB: "transfer",
          channelB: "channel-1",
          fee: "0.005",
          limit: "1000000.0",
          oracleRequestId: BigInt(77),
          status: "active",
          metadata: {
            source: "test",
          },
        },
      },
    };

    const aminoMsg = aminoTypes.toAmino(msg) as AminoMsgRegisterExchange;
    expect(aminoMsg.type).toEqual("guru/bex/MsgRegisterExchange");
    expect(aminoMsg.value.exchange?.oracle_request_id).toEqual("77");
    expect(aminoMsg.value.exchange?.metadata).toEqual({ source: "test" });

    const decoded = aminoTypes.fromAmino(aminoMsg);
    expect(decoded).toEqual(msg);
  });

  it("converts MsgUpdateRatemeter to amino and back", () => {
    const aminoTypes = new AminoTypes(createBexAminoConverters());
    const msg: MsgUpdateRatemeterEncodeObject = {
      typeUrl: "/guru.bex.v1.MsgUpdateRatemeter",
      value: {
        moderatorAddress: "guru1moderator",
        ratemeter: {
          requestCountLimit: BigInt(500),
          requestPeriod: {
            seconds: BigInt(3600),
            nanos: 0,
          },
        },
      },
    };

    const aminoMsg = aminoTypes.toAmino(msg) as AminoMsgUpdateRatemeter;
    expect(aminoMsg.type).toEqual("guru/bex/MsgUpdateRatemeter");
    expect(aminoMsg.value.ratemeter?.request_count_limit).toEqual("500");
    expect(aminoMsg.value.ratemeter?.request_period?.seconds).toEqual("3600");

    const decoded = aminoTypes.fromAmino(aminoMsg);
    expect(decoded).toEqual(msg);
  });
});
