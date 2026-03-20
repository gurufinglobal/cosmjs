import { AminoTypes } from "../../aminotypes";
import { AminoMsgXswapExchange, AminoMsgXswapTransfer, createXswapAminoConverters } from "./aminomessages";
import { MsgXswapExchangeEncodeObject, MsgXswapTransferEncodeObject } from "./messages";

describe("Xswap AminoTypes", () => {
  it("converts MsgTransfer to amino and back", () => {
    const aminoTypes = new AminoTypes(createXswapAminoConverters());
    const msg: MsgXswapTransferEncodeObject = {
      typeUrl: "/gxstable.xswap.v1.MsgTransfer",
      value: {
        sourcePort: "transfer",
        sourceChannel: "channel-0",
        token: {
          denom: "agxn",
          amount: "1234",
        },
        sender: "gxstable1sender",
        receiver: "gxstable1receiver",
        timeoutTimestamp: BigInt(123456),
        memo: "memo",
        encoding: "json",
      },
    };

    const aminoMsg = aminoTypes.toAmino(msg) as AminoMsgXswapTransfer;
    expect(aminoMsg.type).toEqual("gxstable/MsgTransfer");
    expect(aminoMsg.value.timeout_timestamp).toEqual("123456");

    const decoded = aminoTypes.fromAmino(aminoMsg);
    expect(decoded).toEqual(msg);
  });

  it("converts MsgExchange to amino and back", () => {
    const aminoTypes = new AminoTypes(createXswapAminoConverters());
    const msg: MsgXswapExchangeEncodeObject = {
      typeUrl: "/gxstable.xswap.v1.MsgExchange",
      value: {
        sourcePort: "transfer",
        sourceChannel: "channel-1",
        exchangeId: "station-1",
        token: {
          denom: "ibc/EFGH",
          amount: "50",
        },
        sender: "gxstable1sender",
        receiver: "gxstable1receiver",
        timeoutTimestamp: BigInt(999),
        memo: "",
        encoding: "",
      },
    };

    const aminoMsg = aminoTypes.toAmino(msg) as AminoMsgXswapExchange;
    expect(aminoMsg.type).toEqual("gxstable/MsgExchange");
    expect(aminoMsg.value.exchange_id).toEqual("station-1");
    expect(aminoMsg.value.timeout_timestamp).toEqual("999");

    const decoded = aminoTypes.fromAmino(aminoMsg);
    expect(decoded).toEqual(msg);
  });
});
