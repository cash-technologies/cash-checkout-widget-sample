import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from "react-bootstrap";
import { setMetaData } from "./api/axios-service";

const merchantPublicKey = "pub_play_SXqG7wPG.VdFvcWF5Pvii3HD3RV32Qj9IIs7w3MX4";

export const menu = [
  { id: 1, name: "Margherita Pizza", price: 599 },
  { id: 2, name: "Marinara Pizza", price: 699 },
  { id: 3, name: "Hawaiian Pizza", price: 649 },
  { id: 3, name: "Pepperoni Pizza", price: 749 },
];

function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState({});
  const [orderId, setOrderId] = useState(); // order id from create order
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    setMetaData();
  }, []);

  const onChangeItem = (index) => {
    const item = menu[index];
    setSelectedMenuItem(item);
    generateOrder(item);
  };

  // Dropdown Menu React Logic
  const DropdownMenu = () => {
    return (
      <Dropdown onSelect={(item) => onChangeItem(item)}>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selectedMenuItem?.name || "Select an item"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {menu.map((item, index) => {
            return (
              <Dropdown.Item key={index} eventKey={index}>{`${item.name} - $${
                item.price / 100
              }`}</Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  // Creating an order https://developers.holacash.mx/openapi/cash/
  const generateOrder = async (item) => {
    setOrderLoading(true);
    try {
      //create order endpoint
      const response = await axios.post(
        "https://live.api.play.holacash.mx/v2/order",
        {
          order_total_amount: {
            amount: item.price,
            currency_code: "MXN",
          },
          description: item.name,
        },
        {
          headers: {
            "X-Api-Client-Key": merchantPublicKey,
            "Content-Type": "application/json",
          },
        }
      );

      setOrderLoading(false);

      // verifying correct response from create order
      if (response?.data?.order_information?.order_id) {
        setOrderId(response?.data?.order_information?.order_id);
        console.log("ORDER ID:", response?.data?.order_information?.order_id);
        const callbacks = {
          onSuccess: (res) => console.log(JSON.stringify(res)),
          onAbort: () => console.log("onAbort callback"),
          onError: (err) => console.log(JSON.stringify(err)),
        };

        // Initializing widget with order information
        // eslint-disable-next-line no-undef
        HolaCashCheckout.configure(
          { order_id: response?.data?.order_information?.order_id },
          callbacks
        );
      }
    } catch {
      setOrderLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <a className="App-link" target="_blank" rel="noopener noreferrer">
          Avinash Pizza
        </a>
        <p>Select a pizza to place your order</p>

        <DropdownMenu></DropdownMenu>

        {/* Creating Button object  */}
        <div id="instant-holacash-checkout-button">
          {!orderLoading && orderId ? (
            <object
              id="checkout-button"
              data={`https://live.api.play.holacash.mx/v2/checkout/button?public_key=${merchantPublicKey}`}
            />
          ) : null}
        </div>
      </header>
    </div>
  );
}

export default App;
