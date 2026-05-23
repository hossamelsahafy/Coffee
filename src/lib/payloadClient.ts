import payload from "payload";
import config from "@/payload.config";

let cached = global as any;

export async function getPayload() {
  if (!cached.payload) {
    cached.payload = await payload.init({
      config,
    });
  }

  return cached.payload;
}
