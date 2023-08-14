export {};

declare global {
  export interface Error {
    status?: number;
    path?: string;
    errors?: Error[];
  }
}
