import { pipe } from 'fp-ts/lib/pipeable'
import { TaskEither, chain } from 'fp-ts/lib/TaskEither';

import { FetchError, fetchText, fetchJSON } from '../src';

const result: TaskEither<FetchError, string> = pipe(
  fetchText('https://example.com'),
  chain((body) => fetchJSON('https://example.com', { body })),
  chain((body) => fetchText('https://example.com', { body: JSON.stringify(body) }))
);
