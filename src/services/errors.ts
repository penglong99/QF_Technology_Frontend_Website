/** Errors the data layer throws. Pages check for these to choose the right empty/error state. */

/** The requested record does not exist (or is not shown on the website). */
export class NotFoundError extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} "${id}" was not found.`);
    this.name = 'NotFoundError';
  }
}

/** A request to the POS API failed: network error, timeout or a non-2xx response. */
export class ApiError extends Error {
  /** HTTP status, or undefined when the request never got a response. */
  readonly status: number | undefined;

  constructor(message: string, status?: number, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'ApiError';
    this.status = status;
  }
}
