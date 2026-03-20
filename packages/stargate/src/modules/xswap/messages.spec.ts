import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

import { DenomCodec, MsgXswapExchangeCodec, MsgXswapTransferCodec, TokenCodec } from "./messages";

describe("xswap messages", () => {
  it("encodes and decodes Denom", () => {
    const source = {
      base: "uusdc",
      trace: [
        { portId: "transfer", channelId: "channel-0" },
        { portId: "transfer", channelId: "channel-7" },
      ],
    };

    const encoded = DenomCodec.encode(source).finish();
    const decoded = DenomCodec.decode(encoded);
    expect(decoded).toEqual(source);
  });

  it("encodes and decodes Token", () => {
    const source = {
      denom: {
        base: "agxn",
        trace: [{ portId: "transfer", channelId: "channel-1" }],
      },
      amount: "12345",
    };

    const encoded = TokenCodec.encode(source).finish();
    const decoded = TokenCodec.decode(encoded);
    expect(decoded).toEqual(source);
  });

  it("encodes and decodes MsgTransfer", () => {
    const source = {
      sourcePort: "transfer",
      sourceChannel: "channel-0",
      token: Coin.fromPartial({ denom: "agxn", amount: "1000" }),
      sender: "gxstable1sender",
      receiver: "gxstable1receiver",
      timeoutTimestamp: BigInt(1700000000),
      memo: "xswap transfer",
      encoding: "json",
    };

    const encoded = MsgXswapTransferCodec.encode(source).finish();
    const decoded = MsgXswapTransferCodec.decode(encoded);
    expect(decoded).toEqual(source);
  });

  it("encodes and decodes MsgExchange", () => {
    const source = {
      sourcePort: "transfer",
      sourceChannel: "channel-2",
      exchangeId: "station-7",
      token: Coin.fromPartial({ denom: "ibc/ABCD", amount: "999" }),
      sender: "gxstable1sender",
      receiver: "gxstable1receiver",
      timeoutTimestamp: BigInt(1700001111),
      memo: "xswap exchange",
      encoding: "",
    };

    const encoded = MsgXswapExchangeCodec.encode(source).finish();
    const decoded = MsgXswapExchangeCodec.decode(encoded);
    expect(decoded).toEqual(source);
  });
});
