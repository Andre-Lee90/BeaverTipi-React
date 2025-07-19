import React from "react";

export default function NameCardView({ card, onEdit, onBack }) {
  if (!card) return null;

  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: 18 }}>← 목록으로</button>
      <div style={{
        width: 340, border: "2px solid #3a5dfb", borderRadius: 16, margin: "0 auto", padding: 28
      }}>
        <img src={card.filePathUrl} alt="명함 미리보기" style={{ width: "100%", borderRadius: 12, marginBottom: 16 }} />
        <div style={{ fontSize: 18, fontWeight: 700 }}>{card.fileOriginalname}</div>
        <div style={{ color: "#888", marginTop: 6 }}>{card.regDtm}</div>
        {/* 추가 정보(이름, 소속, 전화 등) 표시하려면 card에서 꺼내서 넣으면 됨 */}
      </div>
      <button
        onClick={onEdit}
        style={{
          marginTop: 18,
          background: "#3a5dfb",
          color: "#fff",
          padding: "10px 28px",
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        명함 수정
      </button>
    </div>
  );
}
