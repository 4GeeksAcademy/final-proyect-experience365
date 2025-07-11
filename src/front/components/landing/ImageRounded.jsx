import React from "react";

export const ImageRounded = ({ src }) => {
  return (
    <div className="img-fluid shadow"
      style={{
        overflow: "hidden",
        borderRadius: "50% 50% 50% 50% / 25% 25% 25% 25%",
        width: "230px",
        height: "450px",
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  );
}