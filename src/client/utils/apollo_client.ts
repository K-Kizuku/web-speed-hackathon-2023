import type { HttpOptions } from '@apollo/client';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const syncXhr: HttpOptions['fetch'] = (uri, options) => {
  return new Promise((resolve, reject) => {
    const method = options?.method;
    if (method === undefined) {
      return reject();
    }

    const body = options?.body;
    if (body instanceof ReadableStream) {
      return reject();
    }

    let res: Response;
    try {
      fetch(uri.toString(), {
        body: body,
        headers: {
          'content-type': 'application/json',
        },
        method: method,
      })
        .then((response) => (res = response))
        .then(() => {
          if (res.status >= 200 && res.status < 300) {
            return resolve(new Response(res.body));
          }
          reject();
        });
    } catch (err) {
      reject();
    }
  });
};

const link = new HttpLink({ fetch: syncXhr });

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: true,
  defaultOptions: {
    mutate: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
    watchQuery: {
      fetchPolicy: 'network-only',
    },
  },
  link,
  queryDeduplication: false,
  uri: '/graphql',
});
