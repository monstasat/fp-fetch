export type Parser<T> = (response: Response) => Promise<T>;

export function arrayBufferParser(response: Response): Promise<ArrayBuffer> {
  return response.arrayBuffer();
}

export function blobParser(response: Response): Promise<Blob> {
  return response.blob();
}

export function formDataParser(response: Response): Promise<FormData> {
  return response.formData();
}

export function jsonParser<T = unknown>(response: Response): Promise<T> {
  return response.json();
}

export function rawParser(response: Response): Promise<Response> {
  return Promise.resolve(response);
}

export function textParser(response: Response): Promise<string> {
  return response.text();
}

export function voidParser(_: Response): Promise<void> {
  return Promise.resolve();
}
