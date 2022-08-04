import axios from "axios";
import Script from "next/script";
import { useState } from "react";
import Loader from "./loader";

interface HolaCashProps {
  pubkey: string;
  getOrder: () => any;
  onOrderCreated?: (response: any) => Promise<boolean>;
  onSuccess?: (res: any) => void;
  apiUrl: string;
  widgetUrl: string;
  isDisabled: boolean;
}

export default function WidgetCheckout({
  pubkey,
  getOrder,
  onOrderCreated,
  apiUrl,
  widgetUrl,
  isDisabled,
  onSuccess,
}: HolaCashProps) {
  const [orderId, setOrderId] = useState<string>(""); // orderId will be recovered from the response of the order creation request
  const [loading, setLoading] = useState<boolean>(false);

  const submit = async () => {
    const order = await getOrder(); // execute the callback expression to update the order object

    if (!order) {
      setLoading(false);
      return;
    }

    const response = await axios.post(`${apiUrl}/order`, order, {
      // send the order object to the hola.cash API endpoint
      headers: {
        "X-Api-Client-Key": pubkey,
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      console.error(response);
      setLoading(false);
      return;
    }

    if (response?.data?.order_information?.order_id) {
      setOrderId(response?.data?.order_information?.order_id); // sets the orderId into the react state hook
      if (onOrderCreated) {
        if (!(await onOrderCreated(response))) return; // executes option callback onCreatedOrder event. Useful for external order creation.
      }
      const callbacks = {
        // setup the widget callbacks
        onSuccess: (res: any) => {
          if (onSuccess) onSuccess(res); // executes onSuccess callback
          console.log("onSuccess", JSON.parse(res));
        },
        onComplete: (res : any) => {
          console.log("onComplete", JSON.parse(res));
        },
        onAbort: () => console.log("onAbort callback"),
        onError: (err: any) => console.log(JSON.stringify(err)),
        onEmailEntered: (email: string) => console.log(email),
        onCheckoutStart: () => console.log("checkout started"),
        check: () => {
          return true;
        },
      };
      try {
        // @ts-ignore: Cannot find name at compile time. It will be created when the HolaCash connect.js script is executed.
        HolaCashCheckout.configure(
          // configure the HolaCashCheckout
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
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Script
        src={`${widgetUrl}`}
        data-public-key={pubkey}
        id={"holacash-connect"}
        strategy="afterInteractive"
      />{" "}
      {/* Load the widget connect.js file. */}
      {!orderId && ( // Create the GenerateOrder button
        <button
          className={
            "customPayButton" + (isDisabled ? " customPayButtonDisabled" : "")
          }
          onClick={() => {
            if (isDisabled) return;
            if (!loading) submit();
            setLoading(true);
          }}
        >
          {loading ? <Loader /> : "Generate order"}
        </button>
      )}
      {!!orderId && ( // Create the Custom pay button
        <button
          className="customPayButton"
          onClick={async () => {
            try {
              // @ts-ignore: Cannot find name
              await HolaCashCheckout.initiateCheckout();
            } catch (err) {
              console.error(err);
            }
          }}
        >
          Pay Now
        </button>
      )}
      <div id="instant-holacash-checkout-button">
        {/* Create the default checkout button */}
        <object
          id="checkout-button"
          data={`${apiUrl}/checkout/button?public_key=${pubkey}`}
          data-disabled={loading || !orderId}
        />
      </div>
    </>
  );
}
