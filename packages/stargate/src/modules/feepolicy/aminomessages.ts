/* eslint-disable @typescript-eslint/naming-convention */
import { AminoMsg } from "@cosmjs/amino";

import { AminoConverters } from "../../aminotypes";
import {
  AccountDiscount,
  Discount,
  ModuleDiscount,
  MsgChangeModerator,
  MsgRegisterDiscounts,
  MsgRemoveDiscounts,
} from "./messages";

export interface AminoMsgRegisterDiscounts extends AminoMsg {
  readonly type: "guru/feepolicy/MsgRegisterDiscounts";
  readonly value: {
    readonly moderator_address: string;
    readonly discounts: readonly {
      readonly address: string;
      readonly modules: readonly {
        readonly module: string;
        readonly discounts: readonly {
          readonly discountType: string;
          readonly msgType: string;
          readonly amount: string;
        }[];
      }[];
    }[];
  };
}

export interface AminoMsgRemoveDiscounts extends AminoMsg {
  readonly type: "guru/feepolicy/MsgRemoveDiscounts";
  readonly value: {
    readonly moderator_address: string;
    readonly address: string;
    readonly module: string;
    readonly msg_type: string;
  };
}

export interface AminoMsgChangeModerator extends AminoMsg {
  readonly type: "guru/feepolicy/MsgChangeModerator";
  readonly value: {
    readonly moderator_address: string;
    readonly new_moderator_address: string;
  };
}

export function createFeepolicyAminoConverters(): AminoConverters {
  return {
    "/guru.feepolicy.v1.MsgRegisterDiscounts": {
      aminoType: "guru/feepolicy/MsgRegisterDiscounts",
      toAmino: ({ moderatorAddress, discounts }: MsgRegisterDiscounts): AminoMsgRegisterDiscounts["value"] => ({
        moderator_address: moderatorAddress,
        discounts: discounts.map((d) => ({
          address: d.address,
          modules: d.modules.map((m) => ({
            module: m.module,
            discounts: m.discounts.map((disc) => ({
              discountType: disc.discountType,
              msgType: disc.msgType,
              amount: disc.amount,
            })),
          })),
        })),
      }),
      fromAmino: ({ moderator_address, discounts }: AminoMsgRegisterDiscounts["value"]): MsgRegisterDiscounts => ({
        moderatorAddress: moderator_address,
        discounts: discounts.map((d) => ({
          address: d.address,
          modules: d.modules.map((m) => ({
            module: m.module,
            discounts: m.discounts.map((disc) => ({
              discountType: disc.discountType,
              msgType: disc.msgType,
              amount: disc.amount,
            })),
          })),
        })),
      }),
    },
    "/guru.feepolicy.v1.MsgRemoveDiscounts": {
      aminoType: "guru/feepolicy/MsgRemoveDiscounts",
      toAmino: ({ moderatorAddress, address, module, msgType }: MsgRemoveDiscounts): AminoMsgRemoveDiscounts["value"] => ({
        moderator_address: moderatorAddress,
        address: address,
        module: module,
        msg_type: msgType,
      }),
      fromAmino: ({ moderator_address, address, module, msg_type }: AminoMsgRemoveDiscounts["value"]): MsgRemoveDiscounts => ({
        moderatorAddress: moderator_address,
        address: address,
        module: module,
        msgType: msg_type,
      }),
    },
    "/guru.feepolicy.v1.MsgChangeModerator": {
      aminoType: "guru/feepolicy/MsgChangeModerator",
      toAmino: ({ moderatorAddress, newModeratorAddress }: MsgChangeModerator): AminoMsgChangeModerator["value"] => ({
        moderator_address: moderatorAddress,
        new_moderator_address: newModeratorAddress,
      }),
      fromAmino: ({ moderator_address, new_moderator_address }: AminoMsgChangeModerator["value"]): MsgChangeModerator => ({
        moderatorAddress: moderator_address,
        newModeratorAddress: new_moderator_address,
      }),
    },
  };
}
