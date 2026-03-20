/* eslint-disable no-bitwise */
import { BinaryReader, BinaryWriter } from "cosmjs-types/binary";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";

import { QueryClient } from "../../queryclient";
import { DenomCodec } from "./messages";
import { setupXswapExtension } from "./queries";

describe("XswapExtension", () => {
  it("queries denoms with pagination key", async () => {
    const base = {
      queryAbci: jasmine.createSpy("queryAbci").and.callFake(async (path: string, data: Uint8Array) => {
        expect(path).toEqual("/gxstable.xswap.v1.Query/Denoms");
        const reader = new BinaryReader(data);
        let hasPagination = false;
        while (reader.pos < reader.len) {
          const tag = reader.uint32();
          if (tag >>> 3 === 1) {
            hasPagination = true;
            reader.skipType(tag & 7);
          } else {
            reader.skipType(tag & 7);
          }
        }
        expect(hasPagination).toBeTrue();

        const writer = new BinaryWriter();
        writer.uint32(10).fork();
        DenomCodec.encode(
          {
            base: "agxn",
            trace: [{ portId: "transfer", channelId: "channel-0" }],
          },
          writer,
        );
        writer.ldelim();
        return { value: writer.finish(), height: 1 };
      }),
    } as unknown as QueryClient;

    const extension = setupXswapExtension(base);
    const denoms = await extension.xswap.denoms(new Uint8Array([1]));
    expect(denoms).toEqual([
      {
        base: "agxn",
        trace: [{ portId: "transfer", channelId: "channel-0" }],
      },
    ]);
  });

  it("queries denom, denom hash and escrow address", async () => {
    const base = {
      queryAbci: jasmine.createSpy("queryAbci").and.callFake(async (path: string) => {
        if (path === "/gxstable.xswap.v1.Query/Denom") {
          const writer = new BinaryWriter();
          writer.uint32(10).fork();
          DenomCodec.encode(
            {
              base: "uusdc",
              trace: [{ portId: "transfer", channelId: "channel-2" }],
            },
            writer,
          );
          writer.ldelim();
          return { value: writer.finish(), height: 1 };
        }
        if (path === "/gxstable.xswap.v1.Query/DenomHash") {
          const writer = new BinaryWriter();
          writer.uint32(10).string("ABCD1234");
          return { value: writer.finish(), height: 1 };
        }
        const escrowWriter = new BinaryWriter();
        escrowWriter.uint32(10).string("gxstable1escrow");
        return { value: escrowWriter.finish(), height: 1 };
      }),
    } as unknown as QueryClient;

    const extension = setupXswapExtension(base);
    const denom = await extension.xswap.denom("ibc/ABCD1234");
    const hash = await extension.xswap.denomHash("transfer/channel-0/agxn");
    const escrow = await extension.xswap.escrowAddress("transfer", "channel-0");

    expect(denom).toEqual({
      base: "uusdc",
      trace: [{ portId: "transfer", channelId: "channel-2" }],
    });
    expect(hash).toEqual("ABCD1234");
    expect(escrow).toEqual("gxstable1escrow");
  });

  it("queries total escrow for denom", async () => {
    const base = {
      queryAbci: jasmine.createSpy("queryAbci").and.callFake(async (path: string) => {
        expect(path).toEqual("/gxstable.xswap.v1.Query/TotalEscrowForDenom");
        const writer = new BinaryWriter();
        writer.uint32(10).fork();
        Coin.encode({ denom: "agxn", amount: "777" }, writer);
        writer.ldelim();
        return { value: writer.finish(), height: 1 };
      }),
    } as unknown as QueryClient;

    const extension = setupXswapExtension(base);
    const amount = await extension.xswap.totalEscrowForDenom("agxn");
    expect(amount).toEqual({ denom: "agxn", amount: "777" });
  });
});
