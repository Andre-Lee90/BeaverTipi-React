import React, { useState } from "react";

export default function NameCardPreviewBox({ onEditClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ flex: 1 }}>
      <h4 style={{ marginBottom: 10 }}>나의 명함</h4>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 300,
          height: 180,
          background: "#aaa",
          borderRadius: 8,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        대표 명함 이미지 없음

        {hovered && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              onClick={onEditClick}
              style={{
                background: "#fff",
                color: "#3a5dfb",
                border: "1px solid #3a5dfb",
                borderRadius: 6,
                padding: "8px 16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              내 명함 관리
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
