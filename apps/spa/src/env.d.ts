declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV?: string;
    readonly VITE_PROFILE_API_BASE_URL?: string;
    readonly VITE_INFURA_SEPOLIA_URL?: string;
    readonly VITE_INFURA_MAINNET_URL?: string;
    readonly VITE_ENS?: string;
  }
}

declare module '*.png' {
  const src: string;
  export default src;
}