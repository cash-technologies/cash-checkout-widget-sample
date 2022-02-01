import "../styles/globals.css";
import { Fragment } from "react";
import styles from "../App.css";
import "../node_modules/react-bootstrap/dist/";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Component {...pageProps} />
    </Fragment>
  );
}

export default MyApp;
