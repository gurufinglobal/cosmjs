/* eslint-disable no-bitwise */
import { BinaryReader, BinaryWriter } from "cosmjs-types/binary";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

import { QueryClient } from "../../queryclient";
import { ExchangeCodec, RatemeterCodec } from "./messages";
import { setupBexExtension } from "./queries";

describe("BexExtension", () => {
  it("queries moderatorAddress", async () => {
    const base = {
      queryAbci: jasmine.createSpy("queryAbci").and.callFake(async (path: string, _data: Uint8Array) => {
        expect(path).toEqual("/guru.bex.v1.Query/ModeratorAddress");
        const writer = new BinaryWriter();
        writer.uint32(10).string("guru1moderator");
        return { value: writer.finish(), height: 1 };
      }),
    } as unknown as QueryClient;

    const extension = setupBexExtension(base);
    const moderatorAddress = await extension.bex.moderatorAddress();
    expect(moderatorAddress).toEqual("guru1moderator");
  });

  it("queries exchanges with optional id filter", async () => {
    const base = {
      queryAbci: jasmine.createSpy("queryAbci").and.callFake(async (path: string, data: Uint8Array) => {
        expect(path).toEqual("/guru.bex.v1.Query/Exchanges");

        const reader = new BinaryReader(data);
        let id = "";
        while (reader.pos < reader.len) {
          const tag = reader.uint32();
          if (tag >>> 3 === 1) {
            id = reader.string();
          } else {
            reader.skipType(tag & 7);
          }
        }
        expect(id).toEqual("42");

        const writer = new BinaryWriter();
        writer.uint32(10).fork();
        ExchangeCodec.encode(
          {
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
            oracleRequestId: BigInt(1),
            status: "active",
            metadata: { source: "test" },
          },
          writer,
        );
        writer.ldelim();
        return { value: writer.finish(), height: 1 };
      }),
    } as unknown as QueryClient;

    const extension = setupBexExtension(base);
    const exchanges = await extension.bex.exchanges("42");
    expect(exchanges).toEqual([
      {
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
        oracleRequestId: BigInt(1),
        status: "active",
        metadata: { source: "test" },
      },
    ]);
  });

  it("queries ratemeter and fee collections", async () => {
    const base = {
      queryAbci: jasmine.createSpy("queryAbci").and.callFake(async (path: string) => {
        if (path === "/guru.bex.v1.Query/Ratemeter") {
          const writer = new BinaryWriter();
          writer.uint32(10).fork();
          RatemeterCodec.encode(
            {
              requestCountLimit: BigInt(100),
              requestPeriod: { seconds: BigInt(60), nanos: 0 },
            },
            writer,
          );
          writer.ldelim();
          return { value: writer.finish(), height: 1 };
        }

        const feeWriter = new BinaryWriter();
        feeWriter.uint32(10).fork();
        Coin.encode({ denom: "uguru", amount: "123" }, feeWriter);
        feeWriter.ldelim();
        return { value: feeWriter.finish(), height: 1 };
      }),
    } as unknown as QueryClient;

    const extension = setupBexExtension(base);
    const ratemeter = await extension.bex.ratemeter();
    const collected = await extension.bex.collectedFees("42");
    const available = await extension.bex.availableFees("42");

    expect(ratemeter).toEqual({
      requestCountLimit: BigInt(100),
      requestPeriod: { seconds: BigInt(60), nanos: 0 },
    });
    expect(collected).toEqual([{ denom: "uguru", amount: "123" }]);
    expect(available).toEqual([{ denom: "uguru", amount: "123" }]);
  });
});
