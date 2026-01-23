import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type ShopifyAuthResult = {
  accessToken: string;
  expiresAt: string;
};

type CustomerData = {
  firstName: string;
  lastName: string;
  email: string;
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

const getCustomerData = async (
  customerAccessToken: string
): Promise<CustomerData | null> => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    return null;
  }

  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        firstName
        lastName
        email
      }
    }
  `;

  try {
    const response = await fetch(`https://${domain}/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query,
        variables: { customerAccessToken },
      }),
      cache: "no-store",
    });

    const result = await response.json();
    return result?.data?.customer ?? null;
  } catch {
    return null;
  }
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
            const customerData = await getCustomerData(shopifyAuth.accessToken);
            const fullName = customerData
              ? `${customerData.firstName} ${customerData.lastName}`.trim()
              : submittedEmail.split('@')[0];

            return {
              id: submittedEmail,
              name: fullName || submittedEmail.split('@')[0],
              email: submittedEmail,
              customerAccessToken: shopifyAuth.accessToken,
            };
          }
        } catch (error) {
          console.error("Shopify authentication error:", error);
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
