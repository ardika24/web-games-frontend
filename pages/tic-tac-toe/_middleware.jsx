import { NextResponse } from "next/server";

export default function middleware(req) {
  const { token } = req.session;

  if (!token) {
    return NextResponse.redirect("/login");
  }
}
