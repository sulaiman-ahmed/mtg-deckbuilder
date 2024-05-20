declare module 'js-cookie' {
    interface CookiesStatic<T = string> {
      get(key: string): T;
      set(key: string, value: T, options?: Cookies.CookieAttributes): void;
      remove(key: string, options?: Cookies.CookieAttributes): void;
    }
  
    const Cookies: CookiesStatic;
    export default Cookies;
  }