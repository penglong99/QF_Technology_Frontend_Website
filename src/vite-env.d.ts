/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** `mock` (default) or `pos`. */
  readonly VITE_PRODUCT_SOURCE?: string;
  readonly VITE_POS_API_BASE_URL?: string;
  readonly VITE_POS_IMAGE_BASE_URL?: string;
  readonly VITE_API_TIMEOUT_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
