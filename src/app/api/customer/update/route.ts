import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const customerAccessToken = (session as any)?.customerAccessToken;

    if (!customerAccessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName } = await request.json();

    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !token) {
      return NextResponse.json(
        { error: "Service temporarily unavailable." },
        { status: 503 }
      );
    }

    const mutation = `
      mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
        customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
          customer {
            id
            firstName
            lastName
            email
          }
          customerUserErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(`https://${domain}/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          customerAccessToken,
          customer: {
            firstName,
            lastName,
          },
        },
      }),
    });

    const result = await response.json();
    const errors = result?.data?.customerUpdate?.customerUserErrors ?? [];

    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0].message }, { status: 400 });
    }

    return NextResponse.json({ success: true, customer: result?.data?.customerUpdate?.customer });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to update profile. Please try again." },
      { status: 500 }
    );
  }
}
