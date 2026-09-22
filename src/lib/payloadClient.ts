import payload from "payload";

import config from "@/payload.config";

const cached = globalThis as typeof globalThis & {
  payload?: typeof payload;
};

export async function getPayload() {
  if (!cached.payload) {
    cached.payload = await payload.init({
      config,
    });
  }

  return cached.payload;
}
