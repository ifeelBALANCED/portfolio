export interface RecordedRequest {
  readonly url: string;
  readonly headers: Readonly<Record<string, string>>;
}

export interface FakeFetch {
  readonly fetch: typeof fetch;
  readonly requests: readonly RecordedRequest[];
}

const headersOf = (init: RequestInit | undefined): Record<string, string> =>
  Object.fromEntries(new Headers(init?.headers).entries());

/** A `fetch` that answers every call with the same JSON body and records what it was asked. */
export const fakeFetch = (body: unknown, status = 200): FakeFetch => {
  const requests: RecordedRequest[] = [];
  const impl: typeof fetch = async (input, init) => {
    requests.push({ url: String(input), headers: headersOf(init) });
    return new Response(JSON.stringify(body), { status });
  };
  return { fetch: impl, requests };
};

/** A `fetch` that answers 200 with a raw, possibly non-JSON, body. */
export const textFetch =
  (text: string): typeof fetch =>
  async () =>
    new Response(text);

/** A `fetch` that rejects, as it does when the network is down. */
export const brokenFetch =
  (reason: unknown): typeof fetch =>
  async () => {
    throw reason;
  };
