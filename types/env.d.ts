declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FLICKR_ROOT: `http${string}`
    }
  }
}

export {}
