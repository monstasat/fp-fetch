import { pipe } from 'fp-ts/lib/pipeable'
import { chain } from 'fp-ts/lib/TaskEither';

import { FetchTask, fetchText, fetchJSON } from '../src';

const result: FetchTask<unknown, string> = pipe(
  fetchText('https://example.com'),
  chain((body) => fetchJSON('https://example.com', { body })),
  chain((body) => fetchText('https://example.com', { body: JSON.stringify(body) }))
);
