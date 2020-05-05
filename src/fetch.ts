import {
  TaskEither,
  tryCatch,
  chain,
  left
} from 'fp-ts/lib/TaskEither';
import { Either } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';

import {
  FetchError, NetworkError, ParserError, ResponseError
} from './error';
import {
  Parser,
  jsonParser,
  rawParser,
  textParser,
  voidParser
} from './parser';

/** Type of native fetch method */
export type NativeFetch = (
  input: RequestInfo,
  init?: RequestInit
) => Promise<Response>;

/**
 * `FetchTask<E, A>` represents asynchronous computation that either yields a value
 * of type `A` or fails yielding an error of type `FetchError<E>`
 */
export type FetchTask<E, A> = TaskEither<FetchError<E>, A>;

export type FetchResult<E, A> = Either<FetchError<E>, A>;

/** Type of functional fetch wrapper */
export type Fetch<E, A> = (
  input: RequestInfo,
  init?: RequestInit
) => FetchTask<E, A>;

/** Options for custom fetch function creation */
export type FetchOptions<E, A> = {
  errorParser: Parser<E>;
  parser: Parser<A>;
  fetch?: NativeFetch;
};

function onSuccess<E, T>(
  response: Response,
  parser: Parser<T>
): TaskEither<FetchError<E>, T> {
  return tryCatch(
    async () => parser(response),
    (error) => new ParserError((error as Error).message)
  );
}

function onFailure<E, T>(
  response: Response,
  parser: Parser<E>
): TaskEither<FetchError<E>, T> {
  return pipe(
    tryCatch(
      async () => parser(response).then(
        (body) => new ResponseError(response.statusText, response.status, body)
      ),
      (error) => new ResponseError(
        response.statusText,
        response.status,
        null as E | null,
        new ParserError((error as Error).message)
      )
    ),
    chain((e) => left<ResponseError<E>>(e))
  );
}

/**
 * Custom fetch helper creator
 */
export function fetchCustom<E, A>(
  options: FetchOptions<E, A>
): Fetch<E, A> {
  const { errorParser, parser, fetch = globalThis.fetch } = options;

  return (url: RequestInfo, init?: RequestInit): FetchTask<E, A> => pipe(
    tryCatch(
      async () => fetch(url, init),
      (error) => new NetworkError((error as Error).message)
    ),
    chain((response: Response) => (
      response.ok
        ? onSuccess(response, parser)
        : onFailure(response, errorParser)))
  );
}

/**
 * Fetch helper with returns raw Response object.
 * Callee is fully responsible for body parsing
 */
export function fetchRaw(
  url: RequestInfo,
  init?: RequestInit
): FetchTask<Response, Response> {
  return fetchCustom({
    parser: rawParser,
    errorParser: rawParser
  })(url, init);
}

/**
 * Fetch helper for requests with body in JSON format
 */
export function fetchJSON<E, T>(
  url: RequestInfo,
  init?: RequestInit
): FetchTask<E, T> {
  return fetchCustom<E, T>({
    parser: jsonParser,
    errorParser: jsonParser
  })(url, init);
}

/**
 * Fetch helper for requests with text body
 */
export function fetchText(
  url: RequestInfo,
  init?: RequestInit
): FetchTask<string, string> {
  return fetchCustom({
    parser: textParser,
    errorParser: textParser
  })(url, init);
}

/**
 * Fetch helper which discards response body.
 * May be useful if you just want to check for OK response
 */
export function fetchVoid(
  url: RequestInfo,
  init?: RequestInit
): FetchTask<void, void> {
  return fetchCustom({
    parser: voidParser,
    errorParser: voidParser
  })(url, init);
}
