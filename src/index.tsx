import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./api-store/store";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { msalConfig } from "authConfig";
import "./utility/datadog";

const msalInstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    {/* <MsalProvider instance={msalInstance}>
    </MsalProvider> */}
  </React.StrictMode>
);
reportWebVitals();
