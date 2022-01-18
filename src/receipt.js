import React, { useState, useEffect } from 'react';

const Receipt = ({ response }) => {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!response && !Object.keys(response).length) return;
    const responseAmount = response?.charge?.amount_details?.amount;
    if (responseAmount) {
      setAmount(Number(responseAmount) / 100);
    }
    const responseEmail = response?.charge?.consumer_details?.contact?.email;
    if (responseEmail) {
      setEmail(responseEmail);
    }
  }, [response]);

  if (!response || !Object.keys(response).length) return null;

  return (
    <>
      <h3>Payment receipt</h3>
      <table>
        <tr>
          <td>Transaction ID</td>
          <td>{response?.charge?.id}</td>
        </tr>
        <tr>
          <th>Name</th>
          <th>Value</th>
        </tr>
        <tr>
          <td>Status</td>
          <td>{response?.status_details?.status}</td>
        </tr>
        <tr>
          <td>Amount</td>
          <td>{amount}</td>
        </tr>
        <tr>
          <td>Email</td>
          <td>{email}</td>
        </tr>
        <tr>
          <td>Description</td>
          <td>{response?.charge?.description}</td>
        </tr>
      </table>
    </>
  );
}

export default Receipt;
