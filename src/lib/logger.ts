/**
 * Production-safe logger.
 * 
 * - logger.log() only prints in development
 * - logger.warn() and logger.error() always print
 */

const isDev = import.meta.env.DEV;

/* eslint-disable @typescript-eslint/no-explicit-any */
export const logger = {
  log: (...args: any[]) => { if (isDev) console.log(...args); },
  warn: (...args: any[]) => { console.warn(...args); },
  error: (...args: any[]) => { console.error(...args); },
};
