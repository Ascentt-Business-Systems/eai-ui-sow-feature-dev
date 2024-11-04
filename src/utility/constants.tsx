import axios from "axios";
import { ENVMAPPING } from "./helper";

export const MAXFILESIZE: number = ENVMAPPING(
  window.location.origin
).maxFileSize;
// Add the API domain URL
export const EAIAxios = axios.create({
  baseURL: ENVMAPPING(window.location.origin).eaiapi,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

export const CONTRACTS_LIST = [
  { label: "SOW", value: "sow" },
  { label: "Software", value: "software" },
  { label: "MSA", value: "msa" },
];

export const TELEMETRIES = ["performance", "errors", "http"];
export const APPLICATION_VERSION_CONST = "1.0.0";
export const APPLICATION_REGION_CONST = "us-east-1";
// change credentials of the Azure app
export const SSO_CLIENT_ID = ENVMAPPING(window.location.origin).azure_app_id;
export const SSO_TENANT_URL = `https://login.microsoftonline.com/${
  ENVMAPPING(window.location.origin).azure_client_id
}`;
export const REDIRECT_URL = window.location.origin;
export const QUEUESIZE = ENVMAPPING(window.location.origin).queue;
export const DATADOGAPPID = ENVMAPPING(window.location.origin).datadogAppID;
export const DATADOGTOKEN = ENVMAPPING(window.location.origin).datadogToken;
export const DATADOGSERVICE = ENVMAPPING(window.location.origin).datadogService;
export const DATADOGENV = ENVMAPPING(window.location.origin).datadogENV;

