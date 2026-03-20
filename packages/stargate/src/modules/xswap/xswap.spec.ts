import { EncodeObject } from "@cosmjs/proto-signing";

import {
  MsgXswapExchange,
  MsgXswapExchangeCodec,
  isMsgXswapExchangeEncodeObject,
  isMsgXswapTransferEncodeObject,
  xswapTypes,
} from "./messages";

describe("xswap module", () => {
  it("contains all expected type URLs in xswapTypes", () => {
    const typeUrls = xswapTypes.map(([typeUrl]) => typeUrl);
    expect(typeUrls).toEqual(["/gxstable.xswap.v1.MsgTransfer", "/gxstable.xswap.v1.MsgExchange"]);
  });

  it("round-trips MsgExchange with codec", () => {
    const source: MsgXswapExchange = {
      sourcePort: "transfer",
      sourceChannel: "channel-7",
      exchangeId: "station-42",
      token: { denom: "agxn", amount: "100" },
      sender: "gxstable1sender",
      receiver: "gxstable1receiver",
      timeoutTimestamp: BigInt(777),
      memo: "integration",
      encoding: "",
    };

    const encoded = MsgXswapExchangeCodec.encode(source).finish();
    const decoded = MsgXswapExchangeCodec.decode(encoded);
    expect(decoded).toEqual(source);
  });

  it("type guards identify each xswap encode object", () => {
    const transfer: EncodeObject = {
      typeUrl: "/gxstable.xswap.v1.MsgTransfer",
      value: {},
    };
    const exchange: EncodeObject = {
      typeUrl: "/gxstable.xswap.v1.MsgExchange",
      value: {},
    };
    const unknown: EncodeObject = {
      typeUrl: "/gxstable.xswap.v1.MsgUnknown",
      value: {},
    };

    expect(isMsgXswapTransferEncodeObject(transfer)).toBeTrue();
    expect(isMsgXswapExchangeEncodeObject(exchange)).toBeTrue();
    expect(isMsgXswapTransferEncodeObject(unknown)).toBeFalse();
    expect(isMsgXswapExchangeEncodeObject(unknown)).toBeFalse();
  });
});
