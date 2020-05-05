import { isLeft } from 'fp-ts/lib/Either';
import {
  NetworkError,
  ParserError,
  ResponseError,
  fetchJSON
} from '../src';

(async function() {
  const result = await fetchJSON('https://postman-echo.com/get?foo=bar')();

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
})();
