# Getting Started

To have more information on how to integrate with our checkout widget visit [Quickstart guide](https://developers.holacash.mx/widget/quickguide)

- Verify that you have added the Connect.js script on the Head section of your application. Remember to add both the CDN URL and your public key.

- For Next JS applications it is important to include the NextScript on the \_document.js section of your application.
  This is required for Next js to load the connect.min script into your application.

- Add the Pay button object from the quickguide where you want to load it. Review App.js

- Create an order before loading the Widget [Creating order](https://developers.holacash.mx/openapi/cash/#tag/order)

- Finally pass the order when initializing the widget.

- Callback functions can be passed to the widget when initializing it.
  onSuccess: happens when a charge is created correctly and users close the widget.
  onComplete: happens when a charge is created correctly. Even if the widget remains open.
  onAbort: happens when the users intentionally close the widget
  onError: happens when the holacash service cannot succesfully generate a charge correctly at that moment

# Running this demo project

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Visit localhost:3000 to review the site
