import { NextApiRequest, NextApiResponse } from "next";
import { HTTP_STATUS_CODE } from "@/utils/consts";
import connectMongoDB from "@/server/db/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { testConnection, testRender, testNetlifyEnv } = req.query;

  try {
    // Test database connection
    if (testConnection === "true") {
      const connection = await connectMongoDB();
      if (connection.readyState === 1) {
        return res.status(HTTP_STATUS_CODE.OK).json({
          message: "Database connection successful",
          databaseName: connection.db.databaseName,
          state: connection.readyState,
        });
      } else {
        return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
          error: "Database connection not ready",
          state: connection.readyState,
        });
      }
    }

    // Test rendering response
    if (testRender === "true") {
      return res.status(HTTP_STATUS_CODE.OK).json({
        message: "Render test successful",
      });
    }

    // if (testNetlifyEnv === "true") {
    //   return res.status(HTTP_STATUS_CODE.OK).json({
    //     message: JSON.stringify(process.env),
    //   });
    // }

    // Default response if no test params provided
    return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
      error: "No test parameter specified",
    });
  } catch (error: any) {
    console.error("Error in API handler:", error);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      error: error.message || "An unexpected error occurred",
    });
  }
}
