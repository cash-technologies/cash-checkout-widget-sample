import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';

const merchantPublicKey = 'pub_play_SXqG7wPG.VdFvcWF5Pvii3HD3RV32Qj9IIs7w3MX4';

export const menu = [
  { id: 1, name: 'Margherita Pizza', price: 599 },
  { id: 2, name: 'Marinara Pizza', price: 699 },
  { id: 3, name: 'Hawaiian Pizza', price: 649 },
  { id: 3, name: 'Pepperoni Pizza', price: 749 },
];

function App() {
  const [selectedMenuItem, setSelectedMenuItem] = useState({});
  const [orderId, setOrderId] = useState();
  const [orderLoading, setOrderLoading] = useState(false);
  
  const onChangeItem = (index) => {
    const item = menu[index];
    setSelectedMenuItem(item);
    generateOrder(item);
  }
  
  const generateOrder = async (item) => {
    setOrderLoading(true);
    try {
      const response = await axios.post('https://api-v2.play.holacash.mx/v2/order',
      {
        order_total_amount: {
          amount: item.price,
          currency_code: "MXN"
        },
        description: item.name,
      },
      {
        headers: {
          'X-Api-Client-Key': merchantPublicKey,
          'X-Cash-Anti-Fraud-Metadata': 'fZGVwdGgiIDoiMTIzIgp9', // NOTE: To be removed. Merchant should not be required to send this.
          'Content-Type': 'application/json',
        }
      });
      setOrderLoading(false);
      if (response?.data?.order_information?.order_id) {
        setOrderId(response?.data?.order_information?.order_id);
        console.log('ORDER ID:', response?.data?.order_information?.order_id);
        const callbacks = {
          onSuccess: (res) => alert(JSON.stringify(res)),
          onAbort: () => alert('onAbort callback'),
          onError: (err) => alert(JSON.stringify(err))
        };
        // eslint-disable-next-line no-undef
        HolaCashCheckout.configure({ order_id: response?.data?.order_information?.order_id}, callbacks);
      }
    } catch {
      setOrderLoading(false);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <a className="App-link" target="_blank" rel="noopener noreferrer" >
          Avinash Pizza
        </a>
        <p>
          Select a pizza to place your order
        </p>

        <Dropdown onSelect={(item) => onChangeItem(item)}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {selectedMenuItem?.name || 'Select an item'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {menu.map((item, index) => {
              return (
              <Dropdown.Item key={index} eventKey={index}>{`${item.name} - $${item.price / 100}`}</Dropdown.Item>
              )
            })}
          </Dropdown.Menu>
        </Dropdown>
          <div id="instant-holacash-checkout-button">
          {!orderLoading && orderId ? (
            <object id="checkout-button" data={`https://api-v2.play.holacash.mx/v2/checkout/button?public_key=${merchantPublicKey}`} />
          ) : null}
          </div>
      </header>
    </div>
  );
}

export default App;
