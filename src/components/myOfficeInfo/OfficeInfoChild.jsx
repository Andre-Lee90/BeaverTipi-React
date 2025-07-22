import React from "react";
import NameCardPreviewBox from "./myOfficeInfoChildBox/NameCardPreviewBox";

export default function OfficeInfoChild({ onEditTabMove }) {
  return (
    <div style={{ display: "flex", gap: 20, padding: 20 }}>
      <NameCardPreviewBox onEditClick={onEditTabMove} />
    </div>
  );
}
