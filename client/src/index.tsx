import React from "react";
import ReactDOM from "react-dom";

import configureStore from "./store";
import App from "components/App";

const store = configureStore({});

ReactDOM.render(
  h(Provider, { store }, h(App)),
  document.getElementById("react-webpack-example")
);
