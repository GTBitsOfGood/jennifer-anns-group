import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  getBrowserName,
  getLogger,
  logVisitEventServer,
} from "./context/AnalyticsContext";

export async function middleware(request: NextRequest) {
  //Only takes in pages
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret });
  if (token) {
    const user_label = token.label;
    const current_date = Date();
    const logger = getLogger();
    await logger.authenticate(
      process.env.NEXT_PUBLIC_BOG_ANALYTICS_CLIENT_API_KEY as string,
    );
    const referrer = request.referrer;
    let user_agent = request.headers.get("user-agent");
    if (user_agent == null) {
      user_agent = "";
    }
    const browser_agent = getBrowserName(user_agent);
    logVisitEventServer(logger, {
      referrer: referrer ?? "None",
      userId: (token?._id as string) ?? "Unauthenticated",
      createdDate: current_date,
      browserAgent: browser_agent,
      userGroup: (user_label as string) ?? "Unauthenticated",
    });
  }
  return NextResponse.next();
}

export const config = {
  // routes that middleware applies to, exclude api, static, raw files, etc.
  matcher: "/((?!api|static|.*\\..*|_next|.*\\/raw).*)",
};
