import { SecondFactorMethod } from "@models/Methods";
import { UserInfo } from "@models/UserInfo";
import { UserInfo2FAMethodPath, UserInfoPath } from "@services/Api";
import { Get, Post, PostWithOptionalResponse } from "@services/Client";

export type Method2FA = "webauthn" | "totp" | "mobile_push";

export interface UserInfoPayload {
    display_name: string;
    emails: string[];
    method: Method2FA;
    has_webauthn: boolean;
    has_totp: boolean;
    has_duo: boolean;
}

export interface MethodPreferencePayload {
    method: Method2FA;
}

export function isMethod2FA(method: string) {
    return ["webauthn", "totp", "mobile_push"].includes(method);
}

export function toSecondFactorMethod(method: Method2FA): SecondFactorMethod {
    switch (method) {
        case "totp":
            return SecondFactorMethod.TOTP;
        case "webauthn":
            return SecondFactorMethod.WebAuthn;
        case "mobile_push":
            return SecondFactorMethod.MobilePush;
    }
}

export function toMethod2FA(method: SecondFactorMethod): Method2FA {
    switch (method) {
        case SecondFactorMethod.TOTP:
            return "totp";
        case SecondFactorMethod.WebAuthn:
            return "webauthn";
        case SecondFactorMethod.MobilePush:
            return "mobile_push";
    }
}

export async function postUserInfo(): Promise<UserInfo> {
    const res = await Post<UserInfoPayload>(UserInfoPath);
    return { ...res, method: toSecondFactorMethod(res.method) };
}

export async function getUserInfo(): Promise<UserInfo> {
    const res = await Get<UserInfoPayload>(UserInfoPath);
    return { ...res, method: toSecondFactorMethod(res.method) };
}

export function setPreferred2FAMethod(method: SecondFactorMethod) {
    return PostWithOptionalResponse(UserInfo2FAMethodPath, { method: toMethod2FA(method) } as MethodPreferencePayload);
}
