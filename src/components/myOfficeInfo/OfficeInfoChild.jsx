// OfficeInfoChild.jsx

import React from "react";
import OfficeIntroCard from "./myOfficeInfoChildBox/OfficeIntroCard";
import NameCardPreviewBox from "./myOfficeInfoChildBox/NameCardPreviewBox";

export default function OfficeInfoChild({ onEditTabMove }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 32,
      padding: "20px"
    }}>
      {/* 왼쪽: 소개글(인트로카드) */}
      <div style={{ flex: 1 }}>
        <OfficeIntroCard />
      </div>
      {/* 오른쪽: 명함 프리뷰 */}
      <div style={{ flex: 1 }}>
        <NameCardPreviewBox onEditClick={onEditTabMove} />
      </div>
    </div>
  );
}
