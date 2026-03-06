import { BinaryReader, BinaryWriter } from "cosmjs-types/binary";

import { createProtobufRpcClient, QueryClient } from "../../queryclient";

// ---- Types ----

export interface EvmFeemarketParams {
  noBaseFee: boolean;
  baseFeeChangeDenominator: number;
  elasticityMultiplier: number;
  enableHeight: bigint;
  baseFee: string;
  minGasPrice: string;
  minGasMultiplier: string;
  gasPriceAdjustmentFactor: string;
  maxChangeRate: string;
}

// ---- Response codecs ----

const EvmFeemarketParamsCodec = {
  decode(input: BinaryReader | Uint8Array): EvmFeemarketParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const msg: EvmFeemarketParams = {
      noBaseFee: false,
      baseFeeChangeDenominator: 0,
      elasticityMultiplier: 0,
      enableHeight: BigInt(0),
      baseFee: "",
      minGasPrice: "",
      minGasMultiplier: "",
      gasPriceAdjustmentFactor: "",
      maxChangeRate: "",
    };
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: msg.noBaseFee = reader.bool(); break;
        case 2: msg.baseFeeChangeDenominator = reader.uint32(); break;
        case 3: msg.elasticityMultiplier = reader.uint32(); break;
        case 5: msg.enableHeight = reader.int64() as bigint; break;
        case 6: msg.baseFee = reader.string(); break;
        case 7: msg.minGasPrice = reader.string(); break;
        case 8: msg.minGasMultiplier = reader.string(); break;
        case 9: msg.gasPriceAdjustmentFactor = reader.string(); break;
        case 10: msg.maxChangeRate = reader.string(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return msg;
  },
};

const QueryParamsResponse = {
  decode(input: Uint8Array): { params: EvmFeemarketParams } {
    const reader = new BinaryReader(input);
    let params: EvmFeemarketParams | undefined;
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: params = EvmFeemarketParamsCodec.decode(reader.bytes()); break;
        default: reader.skipType(tag & 7);
      }
    }
    if (!params) throw new Error("EvmFeemarketQueryParamsResponse: params missing");
    return { params };
  },
};

const QueryBaseFeeResponse = {
  decode(input: Uint8Array): { baseFee: string } {
    const reader = new BinaryReader(input);
    let baseFee = "";
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: baseFee = reader.string(); break;
        default: reader.skipType(tag & 7);
      }
    }
    return { baseFee };
  },
};

const QueryBlockGasResponse = {
  decode(input: Uint8Array): { gas: bigint } {
    const reader = new BinaryReader(input);
    let gas = BigInt(0);
    while (reader.pos < reader.len) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: gas = reader.int64() as bigint; break;
        default: reader.skipType(tag & 7);
      }
    }
    return { gas };
  },
};

// ---- Extension ----

export interface EvmFeemarketExtension {
  readonly evmFeemarket: {
    readonly params: () => Promise<EvmFeemarketParams>;
    readonly baseFee: () => Promise<string>;
    readonly blockGas: () => Promise<bigint>;
  };
}

export function setupEvmFeemarketExtension(base: QueryClient): EvmFeemarketExtension {
  const rpc = createProtobufRpcClient(base);

  return {
    evmFeemarket: {
      params: async () => {
        const response = await rpc.request("cosmos.evm.feemarket.v1.Query", "Params", new Uint8Array());
        return QueryParamsResponse.decode(response).params;
      },
      baseFee: async () => {
        const response = await rpc.request("cosmos.evm.feemarket.v1.Query", "BaseFee", new Uint8Array());
        return QueryBaseFeeResponse.decode(response).baseFee;
      },
      blockGas: async () => {
        const response = await rpc.request("cosmos.evm.feemarket.v1.Query", "BlockGas", new Uint8Array());
        return QueryBlockGasResponse.decode(response).gas;
      },
    },
  };
}
