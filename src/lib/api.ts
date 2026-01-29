import axios from "axios";

const defaultBaseURL = import.meta.env.PUBLIC_API_URL ?? process.env.PUBLIC_API_URL;

export function createApi(lang: string, apiUrl?: string) {
  const baseURL = apiUrl || defaultBaseURL;

  if (!baseURL) {
    console.warn("PUBLIC_API_URL is not defined in environment or passed as argument");
    // Optional: throw here if strictness is required, or let axios fail later
  }

  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": lang,
    },
  });
}
