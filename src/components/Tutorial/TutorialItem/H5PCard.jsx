const H5PCard = ({ h5psrc }) => {
  return (
    <div
      style={{
        padding: 10,
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "#fafafa",
      }}
      dangerouslySetInnerHTML={{ __html: h5psrc }}
    />
  );
};

export default H5PCard;
