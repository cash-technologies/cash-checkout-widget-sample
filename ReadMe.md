# Getting Started

To have more information on how to integrate with our checkout widget visit [Quickstart guide](https://developers.holacash.mx/widget/quickguide)

- Verify that you have added the Connect.min.js script on the Head section of your application. Remember to add both the CDN URL and your public key. Mentioned on the quickguide

- Add the Pay button object from the quickguide where you want to load it. 

- Create an order before loading the Widget [Creating order](https://developers.holacash.mx/openapi/cash/#tag/order)

- Finally pass the order when initializing the widget.

- Callback functions can be passed to the widget when initializing it.
  onSuccess: happens when a charge is created correctly.
  onAbort: happens when the users intentionally close the widget
  onError: happens when the holacash service cannot succesfully generate a charge correctly at that moment
 
- Click on the holacash button  Or use the initiate widget function on a custom button. 
# Running each project

Go into your desired framework and check the readme guide for that version 

