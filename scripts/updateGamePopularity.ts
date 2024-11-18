import axios from "axios";

async function updateGamePopularity() {
  const url = process.env.URL;
  const cronKey = process.env.CRON_KEY;

  if (!url || !cronKey) {
    throw new Error("Missing required environment variables (URL or CRON_KEY)");
  }

  try {
    console.log(`Making request to ${url}/api/games/popularity`);

    const response = await axios({
      method: "POST",
      url: `${url}/api/games/popularity`,
      headers: {
        "x-api-key": cronKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {},
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    console.log("Response data:", response.data);

    if (response.status === 200) {
      console.log("Game popularities updated successfully.");
      process.exit(0);
    } else {
      throw new Error(`Unexpected status code: ${response.status}`);
    }
  } catch (error) {
    console.error("Error updating game popularities:");
    if (axios.isAxiosError(error)) {
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      console.error("Headers:", error.response?.headers);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

updateGamePopularity();
