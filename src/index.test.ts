import { describe, test, expect, vi } from "vitest"
import { createFetcher } from "."

const responseMock = { json: vi.fn().mockResolvedValue("json") }
const fetchMock = vi.fn().mockResolvedValue(responseMock)
vi.stubGlobal("fetch", fetchMock)

describe("createFetcher", () => {
    test("should use requestor without url builder", async () => {
        const requestor = vi.fn().mockResolvedValue("result")
        const fetcher = createFetcher(undefined, requestor)

        const result = await fetcher("/todo")

        expect(requestor).toHaveBeenCalledWith("/todo", undefined)
        expect(result).toBe("result")
    })

    test("should use requestor with options", async () => {
        const requestor = vi.fn().mockResolvedValue("result")
        const options = { isCoolOption: true }
        const fetcher = createFetcher(undefined, requestor, options)

        const result = await fetcher("/todo")

        expect(requestor).toHaveBeenCalledWith("/todo", options)
        expect(result).toBe("result")
    })

    test("should use default requestor", async () => {
        const fetcher = createFetcher()

        const result = await fetcher("/todo")

        expect(fetchMock).toHaveBeenCalledWith("/todo", undefined)
        expect(responseMock.json).toHaveBeenCalled()
        expect(result).toBe("json")
    })

    test("should build url", async () => {
        const requestor = vi.fn().mockResolvedValue("result")
        const buildUrl = vi.fn().mockResolvedValue("built/url")
        const fetcher = createFetcher(buildUrl, requestor)

        const result = await fetcher("/todo")

        expect(requestor).toHaveBeenCalledWith("built/url", undefined)
        expect(buildUrl).toHaveBeenCalledWith("/todo")
        expect(result).toBe("result")
    })

    test("should build with complex keys", async () => {
        const requestor = vi.fn().mockResolvedValue("result")
        const buildUrl = vi.fn().mockResolvedValue("built/url")
        const fetcher = createFetcher(buildUrl, requestor)

        const result = await fetcher({ foo: "bar" }, 42)

        expect(requestor).toHaveBeenCalledWith("built/url", undefined)
        expect(buildUrl).toHaveBeenCalledWith({ foo: "bar" }, 42)
        expect(result).toBe("result")
    })

    test("should throw if built url isnt a string", async () => {
        const requestor = vi.fn().mockResolvedValue("result")
        const buildUrl = vi.fn().mockResolvedValue({ foo: "bar" })
        const fetcher = createFetcher(buildUrl, requestor)

        expect(fetcher("/todo")).rejects.toThrow("Key is not of type string")

        expect(requestor).not.toHaveBeenCalled()
        expect(buildUrl).toHaveBeenCalledWith("/todo")
    })
})
