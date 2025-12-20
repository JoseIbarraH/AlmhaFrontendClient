import axios from "axios";

const baseURL = import.meta.env.PUBLIC_API_URL;

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
