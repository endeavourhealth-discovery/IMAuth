import { it, describe, expect, afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest";
import { setupServer } from "msw/node";

const restHandlers = [];
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
