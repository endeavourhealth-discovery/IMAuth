import { it, describe, expect, afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { setupServer } from "msw/node";
import { DefaultBodyType, MockedRequest, RestHandler, rest } from "msw";
import { faker } from "@faker-js/faker";
import { factory, primaryKey, manyOf, nullable, oneOf } from "@mswjs/data";

const restHandlers: RestHandler<MockedRequest<DefaultBodyType>>[] = [];
const server = setupServer(...restHandlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  server.resetHandlers();
});
