# fp-fetch

Functional style, non-throwing utils for data fetching

## Installation

To install the stable version:

```bash
npm install fp-fetch
```

## Usage

### Basic example

```typescript
import { isLeft } from 'fp-ts/lib/Either';
import {
  NetworkError,
  ParserError,
  ResponseError,
  fetchJSON
} from 'fp-fetch';

const result = await fetchJSON('http://example.com')();

if (isLeft(result)) {
  // handle error here
  const { left: error } = result;
  if (error instanceof NetworkError) {
    console.log(`network error occured, message=${error.message}`);
  }
  if (error instanceof ParserError) {
    console.log(`parser error occured, message=${error.message}`);
  }
  if (error instanceof ResponseError) {
    const { message, body } = error;
    console.log(`response error occured, message=${message}, body=${body}`);
  }
} else {
  // handle ok here
  const { right: payload } = result;
  console.log(`got ok response, payload=${payload}`);
};
```
