// next-auth v4 types import CookieSerializeOptions from "cookie",
// but cookie@1.x renamed it to SerializeOptions.
// This ambient module augmentation re-adds the alias globally.
declare module 'cookie' {
  interface CookieSerializeOptions {
    domain?: string | undefined
    encode?(value: string): string
    expires?: Date | undefined
    httpOnly?: boolean | undefined
    maxAge?: number | undefined
    path?: string | undefined
    priority?: 'low' | 'medium' | 'high' | undefined
    sameSite?: true | false | 'lax' | 'strict' | 'none' | undefined
    secure?: boolean | undefined
  }
}
