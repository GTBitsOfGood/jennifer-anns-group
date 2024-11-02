import { Config } from "@netlify/functions";

export default async function handler(req: Request) {
  console.log("Updating game popularity");
  try {
    console.log("Making request to update game popularity");
    const res = await fetch(`${process.env.URL}/api/games/popularity`, {
      method: "POST",
      headers: [["x-api-key", process.env.GAME_POPULARITY_CRON_KEY ?? ""]],
    });
    console.log("Response from updating game popularity: ", res);

    if (!res.ok) {
      const { error } = await res.json();
      console.error("Failed to update game popularity: ", error);
      return new Response(`Failed to update game popularity: ${error}`, {
        status: 400,
      });
    }

    console.log("Successfully updated game popularity");
    return new Response("Success", { status: 200 });
  } catch (e: any) {
    console.error("Failed to update game popularity: ", e.message);
    return new Response(`Failed to update game popularity: ${e.message}`, {
      status: 500,
    });
  }
}

export const config: Config = {
  schedule: "@daily",
};
