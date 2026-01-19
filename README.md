# dude.box

Investor-focused website for a veteran-owned men’s recovery & social club based in San Diego.

## Development

```
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` with:

```
DATABASE_URL=
SHOPIFY_STORE_DOMAIN=
SHOPIFY_STOREFRONT_ACCESS_TOKEN=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
MEMBER_LOGIN_EMAIL=
MEMBER_LOGIN_PASSWORD=
```

`MEMBER_LOGIN_EMAIL` and `MEMBER_LOGIN_PASSWORD` are temporary placeholders until the member
database and hashed credentials are implemented.
