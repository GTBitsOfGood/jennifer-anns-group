import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  getBrowserName,
  getLogger,
  logVisitEventServer,
} from "./lib/analytics";

export async function middleware(request: NextRequest) {
  //Only takes in pages
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret });
  if (token && token.tracked) {
    const user_label = token.label;
    const current_date = Date();
    const logger = getLogger();
    const referrer = request.headers.get("referer");
    const pageUrl = request.nextUrl.href;
    let user_agent = request.headers.get("user-agent");
    if (user_agent == null) {
      user_agent = "";
    }
    const browser_agent = getBrowserName(user_agent);
    logVisitEventServer(logger, {
      referrer: referrer ?? "None",
      pageUrl,
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
