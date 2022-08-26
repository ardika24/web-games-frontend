export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/home",
    "/my-profile",
    "/edit-profile",
    "/user/:path*",
    "/rock-paper-scissor",
    "/rock-paper-scissor/play",
    "/tic-tac-toe",
    "/tic-tac-toe/play",
  ],
};
