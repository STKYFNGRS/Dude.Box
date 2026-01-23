import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const customerAccessToken = (session as any)?.customerAccessToken;

    if (!customerAccessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !token) {
      return NextResponse.json(
        { error: "Service temporarily unavailable." },
        { status: 503 }
      );
    }

    const query = `
      query getCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          defaultAddress {
            id
            address1
            address2
            city
            province
            zip
            country
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
        query,
        variables: { customerAccessToken },
      }),
    });

    const result = await response.json();
    return NextResponse.json({ address: result?.data?.customer?.defaultAddress ?? null });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to fetch address." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const customerAccessToken = (session as any)?.customerAccessToken;

    if (!customerAccessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { address1, address2, city, province, zip, country } = await request.json();

    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!domain || !token) {
      return NextResponse.json(
        { error: "Service temporarily unavailable." },
        { status: 503 }
      );
    }

    // First, get customer's existing addresses to see if we need to create or update
    const getCustomerQuery = `
      query getCustomer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          defaultAddress {
            id
          }
          addresses(first: 1) {
            nodes {
              id
            }
          }
        }
      }
    `;

    const customerResponse = await fetch(`https://${domain}/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: getCustomerQuery,
        variables: { customerAccessToken },
      }),
    });

    const customerResult = await customerResponse.json();
    const hasDefaultAddress = customerResult?.data?.customer?.defaultAddress?.id;

    // Use appropriate mutation based on whether address exists
    const mutation = hasDefaultAddress
      ? `
          mutation customerDefaultAddressUpdate($customerAccessToken: String!, $address: MailingAddressInput!) {
            customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, address: $address) {
              customer {
                id
                defaultAddress {
                  id
                  address1
                  address2
                  city
                  province
                  zip
                  country
                }
              }
              customerUserErrors {
                field
                message
              }
            }
          }
        `
      : `
          mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
            customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
              customerAddress {
                id
                address1
                address2
                city
                province
                zip
                country
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
          address: {
            address1,
            address2: address2 || "",
            city,
            province,
            zip,
            country,
          },
        },
      }),
    });

    const result = await response.json();
    const mutationName = hasDefaultAddress ? "customerDefaultAddressUpdate" : "customerAddressCreate";
    const errors = result?.data?.[mutationName]?.customerUserErrors ?? [];

    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0].message }, { status: 400 });
    }

    // If we created a new address, set it as default
    if (!hasDefaultAddress) {
      const newAddressId = result?.data?.customerAddressCreate?.customerAddress?.id;
      
      if (newAddressId) {
        const setDefaultMutation = `
          mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
            customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
              customer {
                id
              }
              customerUserErrors {
                field
                message
              }
            }
          }
        `;

        await fetch(`https://${domain}/api/2024-07/graphql.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token,
          },
          body: JSON.stringify({
            query: setDefaultMutation,
            variables: {
              customerAccessToken,
              addressId: newAddressId,
            },
          }),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to update address. Please try again." },
      { status: 500 }
    );
  }
}
