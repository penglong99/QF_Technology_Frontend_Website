import { apiConfig, getAuthHeaders } from './apiConfig';
import { ApiError, NotFoundError } from './errors';

type QueryParams = Record<string, string | number | undefined>;

function buildUrl(path: string, params: QueryParams = {}): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value));
  }
  const search = query.toString();
  return `${apiConfig.posBaseUrl}${path}${search ? `?${search}` : ''}`;
}

/**
 * GETs JSON from the POS API. Throws `NotFoundError` for 404s and `ApiError` for every other
 * failure (network error, timeout, non-2xx status, invalid JSON).
 */
export async function getJson<T>(
  path: string,
  options: { params?: QueryParams; entity?: string } = {},
): Promise<T> {
  const url = buildUrl(path, options.params);
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json', ...getAuthHeaders() },
      signal: AbortSignal.timeout(apiConfig.requestTimeoutMs),
    });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === 'TimeoutError';
    throw new ApiError(
      timedOut ? `Request to ${path} timed out.` : `Could not reach ${path}.`,
      undefined,
      { cause: error },
    );
  }

  if (response.status === 404) throw new NotFoundError(options.entity ?? 'Resource', path);
  if (!response.ok) {
    throw new ApiError(
      `Request to ${path} failed with status ${response.status}.`,
      response.status,
    );
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    throw new ApiError(`Response from ${path} was not valid JSON.`, response.status, {
      cause: error,
    });
  }
}
