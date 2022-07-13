import Head from "next/head";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import Receipt from "../components/receipt";
import { Dropdown } from "react-bootstrap";
import WidgetCheckout from "../components/widget";

// Base url for holacash api environment
const holacashApiBaseUrl = "https://sandbox.api.holacash.mx/v2";

const holacashConnectWidgetScript =
  "https://widget.connect.sandbox.holacash.mx/connect.min.js";

const HOLACASH_PUBLIC_KEY = "<obtain it from your merchant portal account>"; // Use your public key to connect to hola.cash

// Declare item menu properties
interface Menu {
  id: number;
  name: string;
  price: number;
}

export const menu = [
  { id: 1, name: "Margherita Pizza", price: 599 },
  { id: 2, name: "Marinara Pizza", price: 699 },
  { id: 3, name: "Hawaiian Pizza", price: 649 },
  { id: 3, name: "Pepperoni Pizza", price: 749 },
] as Menu[];

export default function Home() {
  const [selectedMenuItem, setSelectedMenuItem] = useState<Menu>();

  const [receiptVisible, setReceiptVisible] = useState<boolean>(false);
  const [successResponse, setSuccessResponse] = useState("");

  const onChangeItem = (index: number) => {
    const item = menu[index];
    setSelectedMenuItem(item);
  };

  // Dropdown Menu React Logic
  const DropdownMenu = () => {
    return (
      <Dropdown onSelect={(item) => onChangeItem(Number(item))}>
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

  // Creating an order for
  const generateOrderData = () => {
    return {
      order_total_amount: {
        amount: selectedMenuItem?.price,
        currency_code: "MXN",
      },
      description: selectedMenuItem?.name,
    };
  };

  // Create onSuccess callback
  const handleSuccess = (res: any) => {
    setSuccessResponse(JSON.parse(res));
    setReceiptVisible(true);
  };

  return (
    <div className="App">
      <Head>
        <title>Pizza shop</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="App-header">
        <a className="App-link" target="_blank" rel="noopener noreferrer">
          Avinash Pizza
        </a>
        <p>Select a pizza to place your order</p>

        <DropdownMenu />

        {/* Creating Button object  */}

        <WidgetCheckout
          isDisabled={!selectedMenuItem}
          pubkey={HOLACASH_PUBLIC_KEY}
          apiUrl={holacashApiBaseUrl}
          widgetUrl={holacashConnectWidgetScript}
          getOrder={generateOrderData}
          onSuccess={handleSuccess}
        />
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