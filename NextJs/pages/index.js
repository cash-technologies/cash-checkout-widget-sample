import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Script from "next/script";
import Modal from "react-modal";
import Receipt from "../components/receipt";
import { Dropdown } from "react-bootstrap";

// Base url for holacash api environment
const holacashApiBaseUrl = "https://sandbox.api.holacash.mx/v2";

const holacashConnectWidgetScript =
  "https://widget.connect.sandbox.holacash.mx/connect.min.js";

// Copy and paste your public key here to use it in all configs across this sample site
const HOLACASH_PUBLIC_KEY = "<obtain it from your merchant portal account>"; // public key

export const menu = [
  { id: 1, name: "Margherita Pizza", price: 599 },
  { id: 2, name: "Marinara Pizza", price: 699 },
  { id: 3, name: "Hawaiian Pizza", price: 649 },
  { id: 3, name: "Pepperoni Pizza", price: 749 },
];

export default function Home() {
  const [selectedMenuItem, setSelectedMenuItem] = useState({});

  const [orderId, setOrderId] = useState(); // order id from create order
  const [orderLoading, setOrderLoading] = useState(false);

  const [receiptVisible, setReceiptVisible] = useState(false);
  const [successResponse, setSuccessResponse] = useState("");

  const onChangeItem = (index) => {
    const item = menu[index];
    setSelectedMenuItem(item);
    generateOrder(item);
  };

  useEffect(() => {
    console.log("ORDER LOAD", orderLoading);
  }, [orderLoading]);
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
        holacashApiBaseUrl + "/order",
        {
          order_total_amount: {
            amount: item.price,
            currency_code: "MXN",
          },
          description: item.name,
        },
        {
          headers: {
            "X-Api-Client-Key": HOLACASH_PUBLIC_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setOrderLoading(false);

      // verifying correct response from create order
      if (response?.data?.order_information?.order_id) {
        setOrderId(response?.data?.order_information?.order_id);
        console.log("ORDER ID:", response?.data?.order_information?.order_id);
        // callbacks can be passed into the widget configuration this are triggered whenever a certain event happens.
        const callbacks = {
          // onSuccess happens when a charge is created correctly.
          onSuccess: (res) => {
            setSuccessResponse(JSON.parse(res));
            setReceiptVisible(true);
            console.log("onSuccess", JSON.parse(res));
          },
          onComplete: (res) => {
            console.log("onComplete", JSON.parse(res));
            // remove comment to close widget automatically when a charge is completed
            // HolaCashCheckout.closeCheckout()
          },
          // onAbort happens when the users intentionally close the widget
          onAbort: () => console.log("onAbort callback"),

          // on Error happens when the holacash service cannot succesfully generate a charge correctly at that moment
          onError: (err) => {
            console.log(JSON.stringify(err));
            // remove comment to close widget automatically when a charge fails
            // HolaCashCheckout.closeCheckout()
          },

          // onEmailEntered is called when the user completes entering an email
          onEmailEntered: (email) => console.log(email),

          // onCheckoutStart is called when the checkout page is presented
          onCheckoutStart: () => console.log("checkout started"),

          // We will use the check callback to determine if Cash Pay should proceed.
          // This must return a boolean
          check: () => {
            return true;
          },
        };

        // Initializing widget with order information
        // eslint-disable-next-line no-undef
        HolaCashCheckout.configure(
          {
            order_id: response?.data?.order_information?.order_id,
            hints: {
              first_name: "John",
              last_name: "Doe",
              second_last_name: "Doe",
              email: "john.doe@gmail.com",
              phone: "13212312412",
            },
          },
          callbacks
        );
      }
    } catch {
      setOrderLoading(false);
    }
  };

  return (
    <div className="App">
      <Head>
        <title>Pizza shop</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* adding Script using Next Script*/}
      <Script
        src={holacashConnectWidgetScript}
        data-public-key={HOLACASH_PUBLIC_KEY}
        id="holacash-connect"
        strategy="beforeInteractive"
      />
      <header className="App-header">
        <a className="App-link" target="_blank" rel="noopener noreferrer">
          Avinash Pizza
        </a>
        <p>Select a pizza to place your order</p>

        <DropdownMenu />

        {/* Creating Button object  */}
        <div id="instant-holacash-checkout-button">
          <object
            id="checkout-button"
            data={`${holacashApiBaseUrl}/checkout/button?public_key=${HOLACASH_PUBLIC_KEY}`}
            data-disabled={orderLoading || !orderId}
          />
        </div>
        {orderId && (
          <>
            <div className="customBtnLabel">Custom button:</div>

            <button
              className="customPayButton"
              onClick={() => {
                HolaCashCheckout.initiateCheckout();
              }}
            >
              Pay Now
            </button>
          </>
        )}
      </header>
      <Modal isOpen={receiptVisible} className="receipt">
        <Receipt response={successResponse} />
        <div className="mx-auto text-center py-3">
          <div
            className="btn btn-dark mx-auto"
            onClick={() => {
              setReceiptVisible(false);
            }}
          >
            Done
          </div>
        </div>
      </Modal>
    </div>
  );
}
