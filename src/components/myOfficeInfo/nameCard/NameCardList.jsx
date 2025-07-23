import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NameCardList({ mbrCd, onSelect, onDelete, refresh }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [start, setStart] = useState(0);
  const VISIBLE_COUNT = 4;
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [mainNameCardId, setMainNameCardId] = useState(null);

  useEffect(() => {
    if (!mbrCd) return;

    setLoading(true);
    axios.get(`/rest/broker/namecard/list/${mbrCd}`)
      .then(res => {
        const arr = Array.isArray(res.data) ? res.data : [];
        setCards(arr);
        // 대표명함 지정
        const mainCard = arr.find(c => c.docTypeCd === "NAMECARD_MAIN");
        setMainNameCardId(mainCard?.fileId || null);
      })
      .catch(() => setCards([]))
      .finally(() => setLoading(false));
  }, [mbrCd, refresh]);

  const handleSetMain = async (fileId) => {
    if (!fileId) return;
    try {
      const res = await axios.post('/rest/broker/namecard/set-main', null, {
        params: { nameCardId: fileId }
      });
      if (res.data.result === "success") {
        alert("대표명함으로 지정되었습니다!");
        // 대표명함 아이디 갱신 & 새로고침
        setMainNameCardId(fileId);
      } else {
        alert("대표명함 지정 실패: " + res.data.message);
      }
    } catch (e) {
      alert("대표명함 지정 오류: " + e.message);
    }
  };

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
        {(Array.isArray(cards) ? cards : []).slice(start, end).map((card, idx) => {
          console.log("배열을 확인할것이다" + cards);
          const isMain = card.fileId === mainNameCardId || card.docTypeCd === "NAMECARD_MAIN";
          return (
            <div
              key={`${card.fileId}_${card.fileAttachSeq}`}
              style={{
                border: isMain ? "2.5px solid #3388ff" : "1px solid #ddd",
                borderRadius: 12,
                padding: 12,
                width: 180,
                textAlign: "center",
                background: "#f9f9fb",
                cursor: "pointer",
                position: "relative",
                boxShadow: isMain ? "0 2px 10px #d3e7ff66" : "0 1px 4px #eaeaea80"
              }}
              onMouseEnter={() => setHoverIdx(idx)}
              onMouseLeave={() => setHoverIdx(-1)}
              onClick={e => {
                if (e.target.className !== "del-x-btn") onSelect && onSelect(card);
              }}
            >
              {/* 대표 표시 */}
              {isMain && (
                <span style={{
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
                }}>대표</span>
              )}

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
              {/* 대표가 아니면 대표로 지정 버튼 */}
              {!isMain && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleSetMain(card.fileId);
                  }}
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
              )}
            </div>
          );
        })}
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