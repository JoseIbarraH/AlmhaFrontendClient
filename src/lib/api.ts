import axios from "axios";

const baseURL = import.meta.env.PUBLIC_API_URL;

if (!baseURL) {
  throw new Error("API_URL is not defined");
}

export function createApi(lang: string) {
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": lang,
    },
  });

  return api;
}
