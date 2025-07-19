import React, { useState } from "react";

export default function NameCardCarousel({ cards }) {
  const [start, setStart] = useState(0);
  const VISIBLE_COUNT = 4; // 한 번에 보이는 개수

  const end = start + VISIBLE_COUNT;
  const canPrev = start > 0;
  const canNext = end < cards.length;

  const handlePrev = () => {
    if (canPrev) setStart(start - 1); // 1칸씩 이동 (4칸씩 이동하려면 -VISIBLE_COUNT)
  };
  const handleNext = () => {
    if (canNext) setStart(start + 1); // 1칸씩 이동 (4칸씩 이동하려면 +VISIBLE_COUNT)
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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

      <div style={{ display: "flex", gap: 12 }}>
        {cards.slice(start, end).map(card => (
          <div
            key={card.fileId}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 10,
              width: 140,
              height: 90,
              background: "#f7f7fa",
              textAlign: "center",
              flexShrink: 0
            }}
          >
            <img
              src={card.filePathUrl}
              alt={card.fileOriginalname}
              style={{ width: 120, height: 56, objectFit: "cover", borderRadius: 6 }}
            />
            <div style={{ fontSize: 13, marginTop: 4 }}>{card.fileOriginalname}</div>
          </div>
        ))}
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
