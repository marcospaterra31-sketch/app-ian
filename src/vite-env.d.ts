/// <reference types="vite/client" />

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*firebase-applet-config.json" {
  const value: any;
  export default value;
}
