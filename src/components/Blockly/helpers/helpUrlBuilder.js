/**
 * Generates a help URL based on the selected board and the provided base URL.
 * The URL includes a query parameter indicating the board type.
 * @param {string} baseUrl - The base URL to which the board parameter will be added.
 * @returns {string} - The complete URL with the board parameter.
 * @example
 * // const url = withBoardParam("https://example.com/help");
 * // console.log(url); // "https://example.com/help?board=edu"
 * @descript
 *
 **/

var board = window.sessionStorage.getItem("board");

export const withBoardParam = (baseUrl) => {
  const boardFlag = board === "esp32" ? "eduS2" : "edu";
  return `${baseUrl}?board=${boardFlag}`;
};
