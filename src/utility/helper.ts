export const randEnumValue = () => {
  enum MYENUM {
    "SUCCESS",
    "IN PROGRESS",
    "FAILED",
  }
  const enumValues = Object.values(MYENUM);
  const index = Math.floor(Math.random() * enumValues.length);
  let status = "default";
  if (enumValues[index] === "SUCCESS") {
    status = "success";
  } else if (enumValues[index] === "FAILED") {
    status = "primary";
  }
  let label = "IN PROGRESS";
  if (enumValues[index] === "SUCCESS") {
    label = "success";
  } else if (enumValues[index] === "FAILED") {
    label = "FAILED";
  }
  return { label, status };
};

export const ENVMAPPING = (
  location: string
): {
  azure_app_id: string;
  azure_client_id: string;
  eaiapi: string;
  queue: number;
  maxFileSize: number;
  datadogToken: string;
  datadogAppID: string;
  datadogService: string;
  datadogENV: string;
} => {
  const localData = {
    azure_app_id: "e4cfafce-60d5-42ac-8661-390963a5aa33",
    azure_client_id: "9107b728-2166-4e5d-8d13-d1ffdf0351ef",
  };
  if (location === "https://ocio.eai-dev.toyota.com") {
    //variables for DEV
    return {
      ...localData,
      eaiapi: "https://api.ocio.eai-dev.toyota.com",
      queue: 3,
      maxFileSize: 500,
      datadogToken: 'pubcf097ac4a2b22d685c922f866046b6b3',
      datadogAppID: '0a583ecd-cf5f-4954-a173-3a4792241224',
      datadogService:'eai-docubot-dev',
      datadogENV:'dev'
    };
  }
  else if (location === "https://ocio.eai-qa.toyota.com") {
    //variables for QA
    return {
      eaiapi: "https://api.ocio.eai-qa.toyota.com",
      azure_app_id: "80ecdbc9-90b5-4c4a-b56b-d5b6587b9056",
      azure_client_id: "9107b728-2166-4e5d-8d13-d1ffdf0351ef",
      queue: 3,
      maxFileSize: 500,
      datadogToken: "",
      datadogAppID: "",
      datadogService:"",
      datadogENV:'qa'
    };
  }
   else if (location === "https://docubot.ocio.toyota.com") {
    //variables for PROD
    return {
      eaiapi: "https://api.docubot.ocio.toyota.com",
      azure_app_id: "0c0fd6ea-e64d-49c0-86ef-71b7643c2a4c",
      azure_client_id: "8c642d1d-d709-47b0-ab10-080af10798fb",
      queue: 10,
      maxFileSize: 500,
      datadogToken: "",
      datadogAppID: "",
      datadogService:"",
      datadogENV:'prod'
    };
  }

  //variables for LOCAL HOST
  return {
    ...localData,
    eaiapi: "https://api.ocio.eai-dev.toyota.com",
    queue: 3,
    maxFileSize: 500,
    datadogToken: 'pubcf097ac4a2b22d685c922f866046b6b3',
    datadogAppID: '0a583ecd-cf5f-4954-a173-3a4792241224',
    datadogService:'eai-docubot-dev',
    datadogENV:'dev'
  };
};
