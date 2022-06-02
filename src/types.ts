export type Requester<Options, ResponseType> = (
    uri: string,
    options?: Options,
) => Promise<ResponseType>

export interface WithMessage {
    message: string
}
