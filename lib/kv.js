import { Redis } from "@upstash/redis";

// Returns a Redis client if the storage env vars are present, else null.
// Works with either the Vercel KV naming (KV_REST_API_URL/TOKEN) or the
// Upstash marketplace naming (UPSTASH_REDIS_REST_URL/TOKEN).
export function getRedis() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export const RESPONSES_KEY = "dateapp:responses";
