import imageUrlBuilder from "@sanity/image-url";
import { getClient } from "./client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  const client = getClient();
  if (!client) return null;
  return imageUrlBuilder(client).image(source);
}
