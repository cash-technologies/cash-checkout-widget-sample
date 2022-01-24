/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from "react-bootstrap";
import { setMetaData } from "./api/axios-service";
import Modal from 'react-modal';
import Receipt from "./receipt";

const merchantPublicKey = "pub_sandbox_N3JQzyuR.VXjgMrW90DWWfwbd2eerxDA3mSG7uVdR";

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

  const [receiptVisible, setReceiptVisible] = useState(false);
  const [successResponse, setSuccessResponse] = useState('');

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

  // Creating an order https://developers.holacash.mx/openapi/cash/#tag/order
  const generateOrder = async (item) => {
    setOrderLoading(true);
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
          onSuccess: (res) => {
            setSuccessResponse(JSON.parse(res))
            setReceiptVisible(true)
            console.log('onSuccess', JSON.parse(res))
          },
          onAbort: () => console.log('onAbort callback'),
          onError: (err) => console.log(JSON.stringify(err))
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

        <DropdownMenu />

        {/* Creating Button object  */}
        <div id="instant-holacash-checkout-button">
          {!orderLoading && orderId ? (
            <object
              id="checkout-button"
              data={`https://sandbox.api.holacash.mx/v2/checkout/button?public_key=${merchantPublicKey}`}
            />
          ) : null}
        </div>
      </header>
      <Modal isOpen={receiptVisible} className="receipt">
        <Receipt response={successResponse} />
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <button type="button" style={{ borderRadius: 8, backgroundColor: '#424242', color: 'white', padding: 6 }}
            onClick={() => { setReceiptVisible(false) }}>Done</button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
