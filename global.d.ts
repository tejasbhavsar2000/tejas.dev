export {};

declare global {
  interface ViewTransition {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
    skipTransition(): void;
  }
  interface Document {
    startViewTransition?: (cb: () => void | Promise<void>) => ViewTransition;
  }
}
