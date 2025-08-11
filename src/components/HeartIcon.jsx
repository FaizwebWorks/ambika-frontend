// BlueHeartOutline.jsx
import React from "react";

const BlueHeartOutline = ({ size = 48, color = "#4da3ff" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-6-4.35-9-8.64C.64 9.22 1.68 5.48 5.05 4.14c1.8-.71 3.86-.32 5.29.97l1.66 1.59 1.66-1.59c1.43-1.29 3.49-1.68 5.29-.97 3.37 1.34 4.41 5.08 2.05 8.22C18 16.65 12 21 12 21z" />
    </svg>
  );
};

export default BlueHeartOutline;
