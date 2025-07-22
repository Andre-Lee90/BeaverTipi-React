// src/components/myOfficeInfo/nameCard/NameCardCarousel.jsx
import React, { useState } from "react";

export default function NameCardCarousel({
  cards = [],
  onSelect,     // 카드 클릭시 호출 (선택/수정)
  onDelete,     // 삭제 버튼
  onSetMain,    // 대표 명함 설정 버튼
  mainFileId    // 현재 대표명함 fileId
}) {
  const [current, setCurrent] = useState(0);

  if (!cards.length) {
    return (
      <div style={{
        width: 480, height: 260, display: "flex",
        alignItems: "center", justifyContent: "center",
        color: "#7a88a9", background: "#f8f9fb",
        borderRadius: 12, fontSize: 16
      }}>
        저장된 명함이 없습니다.
      </div>
    );
  }

  const currentCard = cards[current];

  return (
    <div style={{
      width: 480,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      {/* 명함 미리보기 */}
      <div style={{
        width: 440,
        height: 230,
        margin: "0 auto",
        borderRadius: 12,
        boxShadow: "0 2px 16px #3332",
        position: "relative",
        background: "#fff"
      }}>
        <img
          src={currentCard.url || currentCard.fileUrl}
          alt="명함"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: 12
          }}
          onClick={() => onSelect && onSelect(currentCard)}
        />
        {/* 대표 표시 */}
        {mainFileId === currentCard.fileId && (
          <span style={{
            position: "absolute", top: 8, right: 12,
            background: "#3a5dfb", color: "#fff",
            borderRadius: 6, fontSize: 13, padding: "3px 9px"
          }}>
            대표
          </span>
        )}
      </div>
      {/* 하단 컨트롤 */}
      <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <button
          disabled={current === 0}
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          style={{
            width: 32, height: 32, borderRadius: "50%",
            border: "1.5px solid #bbb", background: "#fff", color: "#3a5dfb",
            cursor: current === 0 ? "not-allowed" : "pointer", fontSize: 20
          }}
        >{"‹"}</button>
        <span style={{ minWidth: 56, textAlign: "center", fontWeight: 600 }}>
          {current + 1} / {cards.length}
        </span>
        <button
          disabled={current === cards.length - 1}
          onClick={() => setCurrent(c => Math.min(cards.length - 1, c + 1))}
          style={{
            width: 32, height: 32, borderRadius: "50%",
            border: "1.5px solid #bbb", background: "#fff", color: "#3a5dfb",
            cursor: current === cards.length - 1 ? "not-allowed" : "pointer", fontSize: 20
          }}
        >{"›"}</button>
        {/* 삭제 버튼 */}
        {onDelete &&
          <button
            onClick={() => onDelete(currentCard.fileId)}
            style={{
              marginLeft: 24, background: "#ffeaea", color: "#e33",
              border: "1.5px solid #e33", borderRadius: 8, fontWeight: 700,
              fontSize: 15, padding: "4px 16px", cursor: "pointer"
            }}
          >삭제</button>
        }
        {/* 대표설정 */}
        {onSetMain && mainFileId !== currentCard.fileId &&
          <button
            onClick={() => onSetMain(currentCard.fileId)}
            style={{
              marginLeft: 6, background: "#ebf2ff", color: "#4260ff",
              border: "1.5px solid #3a5dfb", borderRadius: 8, fontWeight: 700,
              fontSize: 15, padding: "4px 16px", cursor: "pointer"
            }}
          >대표로 설정</button>
        }
      </div>
    </div>
  );
}
