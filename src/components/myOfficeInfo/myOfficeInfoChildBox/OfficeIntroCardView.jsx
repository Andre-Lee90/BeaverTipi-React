import React, { useState } from "react";
import OfficeIntroCard from "./OfficeIntroCard";

export default function OfficeIntroCardView() {
  const [introValue, setIntroValue] = useState("");

  return (
    <div style={{
      background: "#f8fafc",
      borderRadius: 16,
      padding: "24px 18px 32px 18px",
      boxShadow: "0 4px 24px #262a4522",
      minHeight: 420,
      width: "100%"
    }}>
      <OfficeIntroCard
        value={introValue}
        onChange={setIntroValue}
        isEditing={true}
      />
    </div>
  );
}
