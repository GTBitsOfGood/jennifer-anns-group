async function updateGamePopularity() {
  console.log("Updating game popularity");
  try {
    if (!process.env.URL || !process.env.CRON_KEY) {
      throw new Error(
        "Missing required environment variables (URL or CRON_KEY)",
      );
    }

    console.log("Making request to update game popularity");
    const res = await fetch(`${process.env.URL}/api/games/popularity`, {
      method: "POST",
      headers: [["x-api-key", process.env.CRON_KEY ?? ""]],
    });
    console.log("Response from updating game popularity: ", res);

    if (!res.ok) {
      const { error } = await res.json();
      console.error("Failed to update game popularity: ", error);
      process.exit(1);
    }

    console.log("Successfully updated game popularity");
    process.exit(0);
  } catch (e: any) {
    console.error("Failed to update game popularity: ", e.message);
    process.exit(1);
  }
}

updateGamePopularity();
