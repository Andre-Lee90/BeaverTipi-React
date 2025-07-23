import React, { useState } from "react";

// props: cards(명함목록), onSetMain(대표명함 변경 콜백), mainNameCardId(대표명함 fileId), onDelete(명함삭제 콜백)
export default function NameCardCarousel({ cards = [], onSetMain, mainNameCardId, onDelete }) {
  const [start, setStart] = useState(0);
  const VISIBLE_COUNT = 4;

  const end = start + VISIBLE_COUNT;
  const canPrev = start > 0;
  const canNext = end < cards.length;

  const handlePrev = () => {
    if (canPrev) setStart(start - 1);
  };
  const handleNext = () => {
    if (canNext) setStart(start + 1);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
      <button
        onClick={handlePrev}
        disabled={!canPrev}
        style={{
          fontSize: 22,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "50%",
          width: 36, height: 36,
          cursor: canPrev ? "pointer" : "not-allowed",
          opacity: canPrev ? 1 : 0.3
        }}
      >&#8592;</button>

      <div style={{
        display: "flex",
        gap: 12,
        flex: 1,
        justifyContent: "center",
        minWidth: 600
      }}>
        {cards.slice(start, end).map(card => {
          const isMain = card.fileId === mainNameCardId || card.docTypeCd === "NAMECARD_MAIN";
          return (
            <div
              key={`${card.fileId}_${card.fileAttachSeq}`}
              style={{
                border: isMain ? "2.5px solid #3388ff" : "1px solid #ddd",
                boxShadow: isMain ? "0 2px 10px #d3e7ff66" : "0 1px 4px #eaeaea80",
                borderRadius: 14,
                padding: 12,
                width: 150,
                height: 120,
                background: "#f7f7fa",
                textAlign: "center",
                flexShrink: 0,
                position: "relative",
                transition: "border 0.2s, box-shadow 0.2s"
              }}
            >
              {/* 삭제 버튼 */}
              <button
                style={{
                  position: "absolute",
                  top: 6, left: 7,
                  width: 22, height: 22,
                  border: "none",
                  background: "#fff",
                  borderRadius: "50%",
                  boxShadow: "0 0 4px #7772",
                  cursor: "pointer",
                  zIndex: 11,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
                title="삭제"
                onClick={e => {
                  e.stopPropagation();
                  onDelete && onDelete(card.fileId, card.fileAttachSeq);
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <line x1="2" y1="2" x2="10" y2="10" stroke="#d33" strokeWidth="2" />
                  <line x1="10" y1="2" x2="2" y2="10" stroke="#d33" strokeWidth="2" />
                </svg>
              </button>

              {isMain && (
                <span
                  style={{
                    position: "absolute",
                    top: 8, right: 10,
                    background: "#3388ff",
                    color: "#fff",
                    borderRadius: 8,
                    fontSize: 12,
                    padding: "1px 10px",
                    zIndex: 2,
                    fontWeight: 600,
                    boxShadow: "0 2px 8px #3388ff33"
                  }}
                >대표</span>
              )}
              <img
                src={card.filePathUrl}
                alt={card.fileOriginalname}
                style={{
                  width: 120, height: 56,
                  objectFit: "cover",
                  borderRadius: 6,
                  border: isMain ? "2px solid #3388ff" : "1px solid #ccc"
                }}
              />
              <div style={{
                fontSize: 13,
                marginTop: 6,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                {card.fileOriginalname}
              </div>
              {!isMain &&
                <button
                  onClick={() => onSetMain && onSetMain(card.fileId)}
                  style={{
                    marginTop: 7,
                    padding: "4px 12px",
                    fontSize: 13,
                    borderRadius: 8,
                    border: "1px solid #3388ff",
                    background: "#fff",
                    color: "#3388ff",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "background 0.18s, color 0.18s"
                  }}
                >
                  대표로 지정
                </button>
              }
            </div>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={!canNext}
        style={{
          fontSize: 22,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "50%",
          width: 36, height: 36,
          cursor: canNext ? "pointer" : "not-allowed",
          opacity: canNext ? 1 : 0.3
        }}
      >&#8594;</button>
    </div>
  );
}