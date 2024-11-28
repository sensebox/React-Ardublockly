export const initializeHttpServer = {
  kind: "block",
  type: "sensebox_initialize_http_server",
};

export const httpOnClientConnect = {
  kind: "block",
  type: "sensebox_http_on_client_connect",
};

export const ipAddress = {
  kind: "block",
  type: "sensebox_ip_address",
};

export const httpMethod = {
  kind: "block",
  type: "sensebox_http_method",
};

export const httpUri = {
  kind: "block",
  type: "sensebox_http_uri",
};

export const httpProtocolVersion = {
  kind: "block",
  type: "sensebox_http_protocol_version",
};

export const httpUserAgent = {
  kind: "block",
  type: "sensebox_http_user_agent",
};

export const generateHttpSuccesfulResponse = {
  kind: "block",
  type: "sensebox_generate_http_succesful_response",
};

export const generateHttpNotFoundResponse = {
  kind: "block",
  type: "sensebox_generate_http_not_found_response",
};

export const generateHtmlDoc = {
  kind: "block",
  type: "sensebox_generate_html_doc",
};

export const generalHtmlTag = {
  kind: "block",
  type: "sensebox_general_html_tag",
};

export const webReadHTML = {
  kind: "block",
  type: "sensebox_web_readHTML",
};

export default {
  mcu: [
    initializeHttpServer,
    httpOnClientConnect,
    ipAddress,
    httpMethod,
    httpUri,
    httpProtocolVersion,
    httpUserAgent,
    generateHttpSuccesfulResponse,
    generateHttpNotFoundResponse,
    generateHtmlDoc,
    generalHtmlTag,
    webReadHTML,
  ],
  mini: [
    initializeHttpServer,
    httpOnClientConnect,
    ipAddress,
    httpMethod,
    httpUri,
    httpProtocolVersion,
    httpUserAgent,
    generateHttpSuccesfulResponse,
    generateHttpNotFoundResponse,
    generateHtmlDoc,
    generalHtmlTag,
    webReadHTML,
  ],
  esp32: [
    initializeHttpServer,
    httpOnClientConnect,
    ipAddress,
    httpMethod,
    httpUri,
    httpProtocolVersion,
    httpUserAgent,
    generateHttpSuccesfulResponse,
    generateHttpNotFoundResponse,
    generateHtmlDoc,
    generalHtmlTag,
    webReadHTML,
  ],
};
