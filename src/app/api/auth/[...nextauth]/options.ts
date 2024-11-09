import dbConnect from "@/lib/db/dbConnection";
import UserModel from "@/model/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Email" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();

        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { password: credentials.identifier },
            ],
          });

          if (!user) throw new Error("No user found with this email");

          if (!user.isVerified)
            throw new Error("Please verify your account first before login");

          const isPasswordCorrect = await bcryptjs.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) return user;
          else throw new Error("Inccorect Password");
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user?.isVerified;
        token.isAcceptingMessages = user?.isAcceptingMessages;
        token.username = user?.username;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }

      return session;
    },
  },

  pages: { signIn: "/sign-in" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
