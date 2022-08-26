import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import apiFetch from "../../../utils/apiFetch";

export const authOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req) {
        const authResponse = await apiFetch("/api/v1/auth/login", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const authData = await authResponse.json();
        if (!authResponse.ok || !authData) return null;

        const userResponse = await apiFetch("/api/v1/auth/whoami", {
          headers: {
            Authorization: authData.accessToken,
          },
        });
        const user = await userResponse.json();
        if (!userResponse.ok || !user) return null;

        return {
          accessToken: authData.accessToken,
          ...user,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const userResponse = await apiFetch("/api/v1/auth/whoami", {
        headers: {
          Authorization: token.user.accessToken,
        },
      });
      const userData = await userResponse.json();
      session.user = { accessToken: token.user.accessToken, ...userData };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLsif
      if (url.startsWith("/")) {
        if (url === "/") {
          return `${baseUrl}/home`;
        }

        return `${baseUrl}${url}`;
      }
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) {
        const parseUrl = new URL(url);
        if (parseUrl.pathname === "/") {
          return `${baseUrl}/home`;
        }

        return url;
      }

      return baseUrl;
    },
  },
};

export default NextAuth(authOptions);
