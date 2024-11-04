import { Configuration } from "@azure/msal-browser";
import { REDIRECT_URL, SSO_CLIENT_ID, SSO_TENANT_URL } from "utility/constants";

export const msalConfig: Configuration = {
  auth: {
    clientId: SSO_CLIENT_ID,
    authority: SSO_TENANT_URL,
    redirectUri: REDIRECT_URL,
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    secureCookies: false
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: [`${SSO_CLIENT_ID}/.default`],
  // scopes: ["openid"],
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me",
};
