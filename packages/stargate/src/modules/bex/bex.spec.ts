import { EncodeObject } from "@cosmjs/proto-signing";

import {
  MsgRegisterAdmin,
  MsgRegisterAdminCodec,
  bexTypes,
  isMsgChangeBexModeratorEncodeObject,
  isMsgRegisterAdminEncodeObject,
  isMsgRegisterExchangeEncodeObject,
  isMsgRemoveAdminEncodeObject,
  isMsgUpdateExchangeEncodeObject,
  isMsgUpdateRatemeterEncodeObject,
  isMsgWithdrawFeesEncodeObject,
} from "./messages";

describe("bex module", () => {
  it("contains all expected type URLs in bexTypes", () => {
    const typeUrls = bexTypes.map(([typeUrl]) => typeUrl);
    expect(typeUrls).toEqual([
      "/guru.bex.v1.MsgRegisterAdmin",
      "/guru.bex.v1.MsgRemoveAdmin",
      "/guru.bex.v1.MsgRegisterExchange",
      "/guru.bex.v1.MsgUpdateExchange",
      "/guru.bex.v1.MsgUpdateRatemeter",
      "/guru.bex.v1.MsgWithdrawFees",
      "/guru.bex.v1.MsgChangeBexModerator",
    ]);
  });

  it("round-trips MsgRegisterAdmin with codec", () => {
    const source: MsgRegisterAdmin = {
      moderatorAddress: "guru1moderator",
      adminAddress: "guru1admin",
      exchangeId: "42",
    };

    const encoded = MsgRegisterAdminCodec.encode(source).finish();
    const decoded = MsgRegisterAdminCodec.decode(encoded);
    expect(decoded).toEqual(source);
  });

  it("type guards identify each bex encode object", () => {
    const registerAdmin: EncodeObject = {
      typeUrl: "/guru.bex.v1.MsgRegisterAdmin",
      value: {},
    };
    const removeAdmin: EncodeObject = {
      typeUrl: "/guru.bex.v1.MsgRemoveAdmin",
      value: {},
    };
    const registerExchange: EncodeObject = {
      typeUrl: "/guru.bex.v1.MsgRegisterExchange",
      value: {},
    };
    const updateExchange: EncodeObject = {
      typeUrl: "/guru.bex.v1.MsgUpdateExchange",
      value: {},
    };
    const updateRatemeter: EncodeObject = {
      typeUrl: "/guru.bex.v1.MsgUpdateRatemeter",
      value: {},
    };
    const withdrawFees: EncodeObject = {
      typeUrl: "/guru.bex.v1.MsgWithdrawFees",
      value: {},
    };
    const changeModerator: EncodeObject = {
      typeUrl: "/guru.bex.v1.MsgChangeBexModerator",
      value: {},
    };
    const unknown: EncodeObject = {
      typeUrl: "/guru.bex.v1.MsgUnknown",
      value: {},
    };

    expect(isMsgRegisterAdminEncodeObject(registerAdmin)).toBeTrue();
    expect(isMsgRemoveAdminEncodeObject(removeAdmin)).toBeTrue();
    expect(isMsgRegisterExchangeEncodeObject(registerExchange)).toBeTrue();
    expect(isMsgUpdateExchangeEncodeObject(updateExchange)).toBeTrue();
    expect(isMsgUpdateRatemeterEncodeObject(updateRatemeter)).toBeTrue();
    expect(isMsgWithdrawFeesEncodeObject(withdrawFees)).toBeTrue();
    expect(isMsgChangeBexModeratorEncodeObject(changeModerator)).toBeTrue();

    expect(isMsgRegisterAdminEncodeObject(unknown)).toBeFalse();
    expect(isMsgRemoveAdminEncodeObject(unknown)).toBeFalse();
    expect(isMsgRegisterExchangeEncodeObject(unknown)).toBeFalse();
    expect(isMsgUpdateExchangeEncodeObject(unknown)).toBeFalse();
    expect(isMsgUpdateRatemeterEncodeObject(unknown)).toBeFalse();
    expect(isMsgWithdrawFeesEncodeObject(unknown)).toBeFalse();
    expect(isMsgChangeBexModeratorEncodeObject(unknown)).toBeFalse();
  });
});
