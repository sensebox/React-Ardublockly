import React from "react";
import BasicPage from "./BasicPage";
import FloatingSerial from "./FloatingSerial";

const BasicWithSerial = ({ initialXml }) => {
  return (
    <>
      <BasicPage initialXml={initialXml} />
      <FloatingSerial />
    </>
  );
};

export default BasicWithSerial;
