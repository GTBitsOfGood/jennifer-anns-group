import { Config } from "@netlify/functions";

export default async function handler(req: Request) {
  const res = await fetch(`${process.env.URL}/api/games/popularity`, {
    method: "POST",
    headers: [["x-api-key", process.env.GAME_POPULARITY_CRON_KEY ?? ""]],
  });

  if (!res.ok) {
    const { error } = await res.json();
    console.error("Failed to update game popularity: ", error);
    return new Response(`Failed to update game popularity: ${error}`, {
      status: 400,
    });
  }
  return new Response("Success", { status: 200 });
}

export const config: Config = {
  schedule: "@daily",
};
