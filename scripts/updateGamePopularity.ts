async function updateGamePopularity() {
  console.log("Updating game popularity");
  try {
    if (
      !process.env.MONGODB_URI ||
      !process.env.NEXT_PUBLIC_BOG_ANALYTICS_CLIENT_API_KEY
    ) {
      throw new Error(
        "Missing required environment variables (MONGODB_URI or NEXT_PUBLIC_BOG_ANALYTICS_CLIENT_API_KEY)",
      );
    }

    console.log("Updating game popularity");
    updateGamePopularity();
    console.log("Finished updating game popularity");
    process.exit(0);
  } catch (e: any) {
    console.error("Failed to update game popularity: ", e.message);
    process.exit(1);
  }
}

updateGamePopularity();
