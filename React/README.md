# Getting Started

To have more information on how to integrate with our checkout widget visit [Quickstart guide](https://developers.holacash.mx/widget/quickguide)

- Verify that you have added the Connect.js script on the Head section of your application. Remember to add both the CDN URL and your public key. Review index.html

- Add the Pay button object from the quickguide where you want to load it. Review App.js

- Create an order before loading the Widget [Creating order](https://developers.holacash.mx/openapi/cash/#tag/order)

- Finally pass the order when initializing the widget

- Callback functions can be passed to the widget when initializing it.
  onSuccess: happens when a charge is created correctly.
  onAbort: happens when the users intentionally close the widget
  onError: happens when the holacash service cannot succesfully generate a charge correctly at that moment

# Running this demo project

This project was created with [Create React App](https://github.com/facebook/create-react-app).

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

atributions: Flaticon
