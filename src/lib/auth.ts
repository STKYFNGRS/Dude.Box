import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type ShopifyAuthResult = {
  accessToken: string;
  expiresAt: string;
};

const createCustomerAccessToken = async (
  email: string,
  password: string
): Promise<ShopifyAuthResult | null> => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return null;
  }

  const endpoint = `https://${domain}/api/2024-07/graphql.json`;
  const mutation = `
    mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        userErrors {
          message
        }
      }
    }
  `;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query: mutation, variables: { input: { email, password } } }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  const result = payload?.data?.customerAccessTokenCreate;
  const accessToken = result?.customerAccessToken?.accessToken;
  const expiresAt = result?.customerAccessToken?.expiresAt;
  const errors = result?.userErrors ?? [];

  if (!accessToken || errors.length) {
    return null;
  }

  return { accessToken, expiresAt };
};

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Member Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const submittedEmail = credentials.email.toLowerCase().trim();

        try {
          const shopifyAuth = await createCustomerAccessToken(
            submittedEmail,
            credentials.password
          );

          if (shopifyAuth) {
            return {
              id: "shopify-customer",
              name: "Customer",
              email: submittedEmail,
              customerAccessToken: shopifyAuth.accessToken,
            };
          }
        } catch (error) {
          // Fall through to member login.
        }

        const allowedEmail = process.env.MEMBER_LOGIN_EMAIL?.toLowerCase().trim();
        const allowedPassword = process.env.MEMBER_LOGIN_PASSWORD;

        if (!allowedEmail || !allowedPassword) {
          return null;
        }

        if (submittedEmail === allowedEmail && credentials.password === allowedPassword) {
          return {
            id: "member-1",
            name: "Member",
            email: allowedEmail,
            isMember: true,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/portal/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof user === "object") {
        if ("customerAccessToken" in user) {
          token.customerAccessToken = (user as { customerAccessToken?: string })
            .customerAccessToken;
        }
        if ("isMember" in user) {
          token.isMember = Boolean((user as { isMember?: boolean }).isMember);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.customerAccessToken) {
        (session as { customerAccessToken?: string }).customerAccessToken =
          token.customerAccessToken as string;
      }
      if (token.isMember) {
        (session as { isMember?: boolean }).isMember = Boolean(token.isMember);
      }
      return session;
    },
  },
};
