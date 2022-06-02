# SWR Simple Fetcher

A simple fetcher for [swr](https://swr.vercel.app/).

Install:

```sh
npm install swr-simple-fetcher
# or
yarn add swr-simple-fetcher
```

Simple usage:

```tsx
const fetcher = createFetcher()

function useUsers() {
    const { data, error, ...etc } = useSWR("/users", fetcher)
}
```

An example with a url builder.

The request is deduped based on the keys `todoId` and `userId` _not_ the built url.

```tsx
function buildUrl(todoId: string, userId: string) {
    return `${baseUrl}/${userId}/todos/${todoId}`
}

const fetcher = createFetcher(buildUrl)

function useUserTodo(todoId: string, userId: string) {
    const { data, error, ...etc } = useSWR<ResponseType, ErrorType>(
        [todoId, userId],
        fetcher,
    )
}
```

An example with a custom requestor.

```tsx
import { QueryClient } from "react-query"

const queryClient = new QueryClient()

function requestor(url: string) {
    return queryClient.fetchQuery(url, queryFn)
}

function buildUrl(todoId: string) {
    return `/todos/${todoId}`
}

const fetcher = createFetcher(buildUrl, requestor)

function useUserTodo() {
    const { data, error, ...etc } = useSWR<ResponseType, ErrorType>(
        [todoId, userId],
        fetcher,
    )
}
```
