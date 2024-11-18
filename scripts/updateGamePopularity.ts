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
      timeout: 30000,
      data: {},
      validateStatus: (status) => {
        return status === 200;
      },
      responseType: "json",
    });

    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid response format");
    }

    console.log("Game popularities updated successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error updating game popularities:");
    if (axios.isAxiosError(error)) {
      console.error("Status:", error.response?.status);
      if (error.response?.data) {
        console.error(
          "Response data:",
          typeof error.response.data === "string"
            ? error.response.data.substring(0, 200)
            : error.response.data,
        );
      }
      console.error("Request URL:", error.config?.url);
      if (error.code === "ECONNABORTED") {
        console.error("Request timed out");
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

updateGamePopularity();
