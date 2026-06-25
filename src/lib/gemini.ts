import { GoogleGenAI } from "@google/genai";

/**
 * Server-only factory. Ephemeral-token minting requires the v1alpha API version.
 * The key is read at runtime and never reaches the client.
 */
export function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set on the server.");
  }
  return new GoogleGenAI({ apiKey, httpOptions: { apiVersion: "v1alpha" } });
}
