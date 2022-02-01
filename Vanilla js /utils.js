/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function displayDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// updates chosen option from the dropdown
function updateSelected(data) {
  let selectedPizzaName = menu[data].name;
  console.log("updated", selectedPizzaName);
  document.getElementById("selectedName").innerHTML = selectedPizzaName;
  generateOrder(menu[data]);
}

const menu = [
  { id: 1, name: "Margherita Pizza", price: 599 },
  { id: 2, name: "Marinara Pizza", price: 699 },
  { id: 3, name: "Hawaiian Pizza", price: 649 },
  { id: 4, name: "Pepperoni Pizza", price: 749 },
];

// Creating an order https://developers.holacash.mx/openapi/cash/#tag/order
const generateOrder = async (item) => {
  try {
    const response = await axios.post(
      "https://sandbox.api.holacash.mx/v2/order",
      {
        order_total_amount: {
          amount: item.price,
          currency_code: "MXN",
        },
        description: item.name,
      },
      {
        headers: {
          "X-Api-Client-Key":
            "pub_sandbox_N3JQzyuR.VXjgMrW90DWWfwbd2eerxDA3mSG7uVdR",
          "Content-Type": "application/json",
        },
      }
    );

    // verifying correct response from create order
    if (response?.data?.order_information?.order_id) {
      let orderId = response?.data?.order_information?.order_id;
      console.log("ORDER ID:", response?.data?.order_information?.order_id);

      //callbacks can be passed into the widget configuration this are triggered whenever a certain event happens.

      const callbacks = {
        //onSuccess happens when a charge is created correctly.

        onSuccess: (res) => {
          console.log("Success response", JSON.parse(res));
          showReceipt(JSON.parse(res));
          console.log("onSuccess", JSON.parse(res));
        },
        //onAbort happens when the users intentionally close the widget

        onAbort: () => alert("Widget is closing"),
        //on Error happens when the holacash service cannot succesfully generate a charge correctly at that moment

        onError: (err) => alert(JSON.stringify(err)),
      };

      // Initializing widget with order information
      // eslint-disable-next-line no-undef
      HolaCashCheckout.configure(
        { order_id: response?.data?.order_information?.order_id },
        callbacks
      );

      showWidget();
    }
  } catch (e) {
    console.log("Request to create order has failed", e);
  }
};

// shows receipt when a payment was processed

function showReceipt(res) {
  console.log(res);
  if (res.charge) {
    document.getElementById("receipt").style.display = "block";
    document.getElementById("instant-holacash-checkout-button").style.display =
      "none";
  }
  document.getElementById("chargeId").innerHTML = res.id;
  document.getElementById("statusResponse").innerHTML =
    res?.status_details?.status;
  document.getElementById("amount").innerHTML =
    Number(res?.charge?.amount_details?.amount) / 100;
  document.getElementById("email").innerHTML =
    res?.charge?.consumer_details?.contact?.email;
  document.getElementById("description").innerHTML = res?.charge?.description;
}

function closeReceipt() {
  document.getElementById("receipt").style.display = "none";
  document.getElementById("instant-holacash-checkout-button").style.display =
    "block";
}

// shows widgetButton when order is ready
function showWidget() {
  document.getElementById("instant-holacash-checkout-button").style.display =
    "block";
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};