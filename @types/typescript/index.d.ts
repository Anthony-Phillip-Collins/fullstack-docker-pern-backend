export {};

declare global {
  export interface Error {
    name?: string;
    status?: number;
    path?: string;
    errors?: Error[];
  }
}
