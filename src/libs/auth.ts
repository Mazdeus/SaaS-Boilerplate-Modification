import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/libs/DB';
import { cmsUser } from '@/models/SchemaCMS';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/utils/auth';

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@brodo.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          return null;
        }

        try {
          // Find user by email
          const users = await db
            .select()
            .from(cmsUser)
            .where(eq(cmsUser.email, email))
            .limit(1);

          const user = users[0];

          if (!user) {
            return null;
          }

          // Check if user is active
          if (!user.isActive) {
            return null;
          }

          // Verify password
          const isPasswordValid = await verifyPassword(
            password,
            user.passwordHash,
          );

          if (!isPasswordValid) {
            return null;
          }

          // Update last login
          await db
            .update(cmsUser)
            .set({ lastLogin: new Date() })
            .where(eq(cmsUser.id, user.id));

          // Return user object (will be stored in session)
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.username,
            role: user.role || 'editor',
          };
        }
        catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/en/cms/login',
    error: '/en/cms/login', // Redirect errors to login page
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to token on login
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user info to session
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle redirects after login/logout
      // If the URL is relative, prepend the base URL
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // If the URL is already absolute and matches the base URL, allow it
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Default redirect to dashboard after successful login
      return `${baseUrl}/en/cms/dashboard`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
export { authConfig as authOptions };
