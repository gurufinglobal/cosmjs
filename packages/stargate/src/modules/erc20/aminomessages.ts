/* eslint-disable @typescript-eslint/naming-convention */
import { AminoMsg, Coin } from "@cosmjs/amino";

import { AminoConverters } from "../../aminotypes";
import { MsgConvertCoin, MsgConvertERC20, MsgRegisterERC20, MsgToggleConversion } from "./messages";

export interface AminoMsgConvertERC20 extends AminoMsg {
  readonly type: "cosmos/evm/MsgConvertERC20";
  readonly value: {
    readonly contract_address: string;
    readonly amount: string;
    readonly receiver: string;
    readonly sender: string;
  };
}

export interface AminoMsgConvertCoin extends AminoMsg {
  readonly type: "cosmos/evm/x/erc20/MsgConvertCoin";
  readonly value: {
    readonly coin: Coin;
    readonly receiver: string;
    readonly sender: string;
  };
}

export interface AminoMsgRegisterERC20 extends AminoMsg {
  readonly type: "cosmos/evm/x/erc20/MsgRegisterERC20";
  readonly value: {
    readonly signer: string;
    readonly erc20addresses: readonly string[];
  };
}

export interface AminoMsgToggleConversion extends AminoMsg {
  readonly type: "cosmos/evm/x/erc20/MsgToggleConversion";
  readonly value: {
    readonly authority: string;
    readonly token: string;
  };
}

export function createErc20AminoConverters(): AminoConverters {
  return {
    "/cosmos.evm.erc20.v1.MsgConvertERC20": {
      aminoType: "cosmos/evm/MsgConvertERC20",
      toAmino: ({ contractAddress, amount, receiver, sender }: MsgConvertERC20): AminoMsgConvertERC20["value"] => ({
        contract_address: contractAddress,
        amount: amount,
        receiver: receiver,
        sender: sender,
      }),
      fromAmino: ({ contract_address, amount, receiver, sender }: AminoMsgConvertERC20["value"]): MsgConvertERC20 => ({
        contractAddress: contract_address,
        amount: amount,
        receiver: receiver,
        sender: sender,
      }),
    },
    "/cosmos.evm.erc20.v1.MsgConvertCoin": {
      aminoType: "cosmos/evm/x/erc20/MsgConvertCoin",
      toAmino: ({ coin, receiver, sender }: MsgConvertCoin): AminoMsgConvertCoin["value"] => ({
        coin: coin,
        receiver: receiver,
        sender: sender,
      }),
      fromAmino: ({ coin, receiver, sender }: AminoMsgConvertCoin["value"]): MsgConvertCoin => ({
        coin: coin,
        receiver: receiver,
        sender: sender,
      }),
    },
    "/cosmos.evm.erc20.v1.MsgRegisterERC20": {
      aminoType: "cosmos/evm/x/erc20/MsgRegisterERC20",
      toAmino: ({ signer, erc20addresses }: MsgRegisterERC20): AminoMsgRegisterERC20["value"] => ({
        signer: signer,
        erc20addresses: [...erc20addresses],
      }),
      fromAmino: ({ signer, erc20addresses }: AminoMsgRegisterERC20["value"]): MsgRegisterERC20 => ({
        signer: signer,
        erc20addresses: [...erc20addresses],
      }),
    },
    "/cosmos.evm.erc20.v1.MsgToggleConversion": {
      aminoType: "cosmos/evm/x/erc20/MsgToggleConversion",
      toAmino: ({ authority, token }: MsgToggleConversion): AminoMsgToggleConversion["value"] => ({
        authority: authority,
        token: token,
      }),
      fromAmino: ({ authority, token }: AminoMsgToggleConversion["value"]): MsgToggleConversion => ({
        authority: authority,
        token: token,
      }),
    },
  };
}
