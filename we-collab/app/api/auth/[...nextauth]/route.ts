import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import { toast } from "sonner";
export const authOptions = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization:{
                params :{
                    scope: "openid email profile https://www.googleapis.com/auth/youtube.upload",
                    redirect_uri :'http://localhost:3000/api/auth/callback/google',
                    access_type: "offline",
                    prompt : "consent",
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                if (!account.scope?.includes("youtube.upload")) {
                    throw new Error("Missing required permissions: youtube.upload");
                }
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at; 
                const cookieStore = cookies();
                const sessionToken = cookieStore.get("token")?.value;
                if (!sessionToken) {
                     throw new Error("Missing session token");
                }
                try {
                  const res=  await axios.post("http://localhost:3010/user/api/v1/user/storeTokens", {
                        access_token: account.access_token,
                        refresh_token: account.refresh_token,
                        expiry_date: account.expires_at,
                    },{
                        withCredentials : true, headers: {
                            Authorization: `Bearer ${sessionToken}`
                        }
                    });
                } catch (error) {
                    throw new Error("Failed to store authentication tokens.");
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                name: token.name,
                email: token.email,
                image: token.picture,
              };
           
            return session;
            },       
         },
        
});

export { authOptions as GET, authOptions as POST };
