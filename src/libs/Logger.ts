// Client-safe logger interface
type Logger = {
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  debug: (...args: any[]) => void;
};

// Server-side logger (only imported server-side)
function createServerLogger(): Logger {
  // This code only runs on server, so dynamic imports are safe
  try {
    // For server-side, we'll use console for now to avoid worker_threads issues
    return {
      info: (...args: any[]) => {
        // eslint-disable-next-line no-console
        console.log('[INFO]', ...args);
      },
      warn: (...args: any[]) => {
        console.warn('[WARN]', ...args);
      },
      error: (...args: any[]) => {
        console.error('[ERROR]', ...args);
      },
      debug: (...args: any[]) => {
        // eslint-disable-next-line no-console
        console.debug('[DEBUG]', ...args);
      },
    };
  } catch {
    // Fallback to console
    return {
      info: (...args: any[]) => {
        // eslint-disable-next-line no-console
        console.log('[INFO]', ...args);
      },
      warn: (...args: any[]) => {
        console.warn('[WARN]', ...args);
      },
      error: (...args: any[]) => {
        console.error('[ERROR]', ...args);
      },
      debug: (...args: any[]) => {
        // eslint-disable-next-line no-console
        console.debug('[DEBUG]', ...args);
      },
    };
  }
}

// Create a browser-safe logger
function createBrowserLogger(): Logger {
  if (typeof window === 'undefined') {
    // Server-side: Use actual pino logger
    return createServerLogger();
  }

  // Client-side: Use console with formatting
  return {
    info: (...args: any[]) => {
      // eslint-disable-next-line no-console
      console.log('[INFO]', ...args);
    },
    warn: (...args: any[]) => {
      console.warn('[WARN]', ...args);
    },
    error: (...args: any[]) => {
      console.error('[ERROR]', ...args);
    },
    debug: (...args: any[]) => {
      // eslint-disable-next-line no-console
      console.debug('[DEBUG]', ...args);
    },
  };
}

export const logger: Logger = createBrowserLogger();
