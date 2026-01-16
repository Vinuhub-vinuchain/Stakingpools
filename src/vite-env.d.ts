/// <reference types="vite/client" />

// Vite environment variables
interface ImportMetaEnv {
  readonly VITE_FACTORY_ADDRESS: 0xEb82A52577AF54C2Fc40c3695f144aEa3FD7a4E3;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// MetaMask typing
interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    selectedAddress?: string;
    request: (args: { method: string; params?: any[] | object[] }) => Promise<any>;
    on: (eventName: string, callback: (...args: any[]) => void) => void;
    removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
  };
}


