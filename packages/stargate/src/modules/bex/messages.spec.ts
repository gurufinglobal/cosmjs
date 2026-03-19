import {
  ExchangeCodec,
  MsgRegisterAdminCodec,
  MsgRegisterExchangeCodec,
  MsgUpdateRatemeterCodec,
  RatemeterCodec,
} from "./messages";

describe("bex messages", () => {
  it("encodes and decodes Exchange", () => {
    const source = {
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
      fee: "0.003",
      limit: "1000000",
      oracleRequestId: BigInt(7),
      status: "active",
      metadata: {
        tier: "gold",
        source: "spec",
      },
    };

    const encoded = ExchangeCodec.encode(source).finish();
    const decoded = ExchangeCodec.decode(encoded);
    expect(decoded).toEqual(source);
  });

  it("encodes and decodes Ratemeter", () => {
    const source = {
      requestCountLimit: BigInt(500),
      requestPeriod: {
        seconds: BigInt(3600),
        nanos: 0,
      },
    };

    const encoded = RatemeterCodec.encode(source).finish();
    const decoded = RatemeterCodec.decode(encoded);
    expect(decoded).toEqual(source);
  });

  it("encodes and decodes MsgRegisterAdmin", () => {
    const source = {
      moderatorAddress: "guru1moderator",
      adminAddress: "guru1admin",
      exchangeId: "42",
    };

    const encoded = MsgRegisterAdminCodec.encode(source).finish();
    const decoded = MsgRegisterAdminCodec.decode(encoded);
    expect(decoded).toEqual(source);
  });

  it("encodes and decodes MsgRegisterExchange", () => {
    const source = {
      adminAddress: "guru1admin",
      exchange: {
        id: "99",
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
        fee: "0.001",
        limit: "500000",
        oracleRequestId: BigInt(1),
        status: "active",
        metadata: { source: "msg" },
      },
    };

    const encoded = MsgRegisterExchangeCodec.encode(source).finish();
    const decoded = MsgRegisterExchangeCodec.decode(encoded);
    expect(decoded).toEqual(source);
  });

  it("encodes and decodes MsgUpdateRatemeter", () => {
    const source = {
      moderatorAddress: "guru1moderator",
      ratemeter: {
        requestCountLimit: BigInt(1000),
        requestPeriod: {
          seconds: BigInt(60),
          nanos: 10,
        },
      },
    };

    const encoded = MsgUpdateRatemeterCodec.encode(source).finish();
    const decoded = MsgUpdateRatemeterCodec.decode(encoded);
    expect(decoded).toEqual(source);
  });
});
