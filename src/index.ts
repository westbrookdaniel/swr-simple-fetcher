import { Requester } from "./types"

/**
 * Creates a fetcher for use with swr
 *
 * @param requestor - The Requester to use to make the http request. Defaults to DefaultRequester
 * @param buildUrl - Optional function that allows you to use any values as the key/arguments in useSWR
 * See: https://swr.vercel.app/docs/arguments for more details on keys and arguments
 * @property options - Options infered from the provided requestor
 *
 * @example
 *
 * function buildUrl(todoId: string, userId: string) {
 *     return `${baseUrl}/${userId}/todos/${todoId}`
 * };
 *
 * const fetcher = createFetcher(buildUrl);
 *
 * function useUserTodo()  {
 *   // The request is deduped based on the keys `todoId` and `userId` *not* the built url
 *   const { data, error, ...etc } = useSWR<ResponseType, ErrorType>([todoId, userId], fetcher);
 *   // Do something with the data
 * }
 */
export function createFetcher<
    Key extends Array<unknown>,
    Options,
    ResponseType,
>(
    buildUrl?: (...params: Key) => Promise<string> | string,
    requestor: Requester<Options, ResponseType> = DefaultRequester,
    options?: Options,
) {
    return async (...key: Key) => {
        const builtUrl = buildUrl ? await buildUrl(...key) : key[0]
        if (typeof builtUrl !== "string")
            throw new Error("Key is not of type string")
        return await requestor(builtUrl, options)
    }
}

export async function DefaultRequester<ResponseType>(
    uri: string,
    options?: RequestInit,
) {
    const res = await fetch(uri, options)
    const json: ResponseType = await res.json()
    return json
    /* c8 ignore next */
}
