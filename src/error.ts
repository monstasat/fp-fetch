/**
 * Network error is returned when there is a network
 * failure detected or if anything prevented the request
 * from being completed
 */
export class NetworkError extends Error {
  public constructor(message = '') {
    super(message);
  }
}

/**
 * Parser error is returned when it is unable to convert
 * response body to the desired format
 */
export class ParserError extends Error {
  public constructor(message = '') {
    super(message);
  }
}

/**
 * Response error is returned when HTTP response status
 * is not equal to 200 (OK)
 */
export class ResponseError<E = never> extends Error {
  public readonly body: E | null;

  public readonly bodyParseError: ParserError | null;

  public readonly status: number;

  public constructor(
    message = '',
    status: number,
    body: E | null,
    parserError?: ParserError
  ) {
    super(message);

    this.status = status;

    this.body = body;

    this.bodyParseError = parserError ?? null;
  }
}

export type FetchError<E = never> =
  | NetworkError
  | ParserError
  | ResponseError<E>;
