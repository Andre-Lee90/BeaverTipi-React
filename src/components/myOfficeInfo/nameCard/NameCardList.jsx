import React, { useEffect, useState } from "react";

// 캐러셀 스타일 및 X버튼
export default function NameCardList({ onSelect, onDelete }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(0);
  const VISIBLE_COUNT = 4;
  const [hoverIdx, setHoverIdx] = useState(-1);

  // 더미 데이터
  const dummyCards = [
    {
      fileId: "dummy01",
      fileAttachSeq: 1,
      filePathUrl: "/assets/sample_namecard.png",
      fileOriginalname: "테스트명함.png",
      regDtm: "2024-07-19"
    },
    {
      fileId: "dummy02",
      fileAttachSeq: 2,
      filePathUrl: "https://placehold.co/320x180?text=명함2",
      fileOriginalname: "더미명함2.png",
      regDtm: "2024-07-20"
    },
    {
      fileId: "dummy03",
      fileAttachSeq: 3,
      filePathUrl: "https://placehold.co/320x180?text=명함3",
      fileOriginalname: "명함3.png",
      regDtm: "2024-07-21"
    },
    {
      fileId: "dummy04",
      fileAttachSeq: 4,
      filePathUrl: "https://placehold.co/320x180?text=명함4",
      fileOriginalname: "명함4.png",
      regDtm: "2024-07-22"
    },
    {
      fileId: "dummy05",
      fileAttachSeq: 5,
      filePathUrl: "https://placehold.co/320x180?text=명함5",
      fileOriginalname: "명함5.png",
      regDtm: "2024-07-23"
    }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCards(dummyCards);
      setLoading(false);
    }, 500);
  }, []);

  const end = start + VISIBLE_COUNT;
  const canPrev = start > 0;
  const canNext = end < cards.length;

  const handlePrev = () => canPrev && setStart(start - 1);
  const handleNext = () => canNext && setStart(start + 1);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {/* ◀ Prev */}
      <button
        onClick={handlePrev}
        disabled={!canPrev}
        style={{
          width: 28, height: 132,
          background: "#f3f4f7",
          border: "1.5px solid #ddd",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: canPrev ? "pointer" : "not-allowed",
          opacity: canPrev ? 1 : 0.25, padding: 0
        }}
        aria-label="이전"
      >
        <svg width="16" height="36" viewBox="0 0 16 36" fill="none">
          <polygon points="11,6 5,18 11,30" fill="#555" />
        </svg>
      </button>

      {/* 카드 영역 */}
      <div style={{ display: "flex", gap: 16, minHeight: 132 }}>
        {loading && <div>불러오는 중...</div>}
        {cards.length === 0 && !loading && <div>저장된 명함이 없습니다.</div>}
        {cards.slice(start, end).map((card, idx) => (
          <div
            key={`${card.fileId}_${card.fileAttachSeq}`}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 12,
              width: 180,
              textAlign: "center",
              background: "#f9f9fb",
              cursor: "pointer",
              position: "relative"
            }}
            onMouseEnter={() => setHoverIdx(idx)}
            onMouseLeave={() => setHoverIdx(-1)}
            onClick={e => {
              // X 버튼이 아닌 곳 클릭시만 편집
              if (e.target.className !== "del-x-btn") onSelect && onSelect(card);
            }}
          >
            {/* X버튼 */}
            {hoverIdx === idx && (
              <button
                className="del-x-btn"
                style={{
                  position: "absolute",
                  top: 8, right: 8,
                  width: 23, height: 23,
                  border: "none",
                  background: "rgba(255,255,255,0.95)",
                  borderRadius: "50%",
                  boxShadow: "0 0 4px #7774",
                  cursor: "pointer",
                  zIndex: 22,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: ".12s"
                }}
                title="삭제"
                onClick={e => {
                  e.stopPropagation();
                  onDelete && onDelete(card.fileId);
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <line x1="2" y1="2" x2="10" y2="10" stroke="#d33" strokeWidth="2" />
                  <line x1="10" y1="2" x2="2" y2="10" stroke="#d33" strokeWidth="2" />
                </svg>
              </button>
            )}

            <img
              src={card.filePathUrl}
              alt={card.fileOriginalname}
              style={{ width: 160, height: 96, objectFit: "cover", borderRadius: 8 }}
            />
            <div style={{ marginTop: 8 }}>{card.fileOriginalname}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{card.regDtm}</div>
          </div>
        ))}
      </div>

      {/* ▶ Next */}
      <button
        onClick={handleNext}
        disabled={!canNext}
        style={{
          width: 28, height: 132,
          background: "#f3f4f7",
          border: "1.5px solid #ddd",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: canNext ? "pointer" : "not-allowed",
          opacity: canNext ? 1 : 0.25, padding: 0
        }}
        aria-label="다음"
      >
        <svg width="16" height="36" viewBox="0 0 16 36" fill="none">
          <polygon points="5,6 11,18 5,30" fill="#555" />
        </svg>
      </button>
    </div>
  );
}
