import React, { useState } from "react";

const NameCardPreview = React.forwardRef(({
  width = 360,
  height = 200,
  bgImage,
  color = "#3a5dfb",
  textColor = "#222",
  profiles = [],
  onProfileDelete,
  onProfileUpdate,
  texts = [],
  onTextFontSize,
  onTextPos,
  onRemoveText
}, ref) => {
  // Hover 상태 관리
  const [hoveredTextIdx, setHoveredTextIdx] = useState(null);
  const [hoveredProfileIdx, setHoveredProfileIdx] = useState(null);

  // 텍스트 이동
  const handleTextMoveMouseDown = (idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const { x, y } = texts[idx].pos;
    const onMouseMove = moveEvt => {
      const diffX = moveEvt.clientX - startX;
      const diffY = moveEvt.clientY - startY;
      onTextPos(idx, { x: x + diffX, y: y + diffY });
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // 텍스트 크기조절
  const handleTextResizeMouseDown = (idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startFontSize = texts[idx].fontSize;
    const onMouseMove = moveEvt => {
      const diff = moveEvt.clientX - startX;
      const newFontSize = Math.max(10, startFontSize + diff * 0.5); // 0.5배율
      onTextFontSize(idx, newFontSize);
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // 프로필 이미지 이동
  const handleProfileMoveMouseDown = (idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const { x, y } = profiles[idx].pos;
    const onMouseMove = moveEvt => {
      const diffX = moveEvt.clientX - startX;
      const diffY = moveEvt.clientY - startY;
      onProfileUpdate(idx, { pos: { x: x + diffX, y: y + diffY } });
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  // 프로필 크기조절
  const handleProfileResizeMouseDown = (idx, e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startSize = profiles[idx].size;
    const onMouseMove = moveEvt => {
      const diff = moveEvt.clientX - startX;
      const newSize = Math.max(32, startSize + diff);
      onProfileUpdate(idx, { size: newSize });
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width,
        height,
        background: bgImage ? `url(${bgImage}) center/cover` : color,
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
        overflow: "hidden",
        userSelect: "none"
      }}
    >
      {/* 모든 텍스트 렌더 */}
      {texts.map((t, idx) => (
        <div
          key={t.key}
          style={{
            position: "absolute",
            left: t.pos.x,
            top: t.pos.y,
            color: textColor,
            fontSize: t.fontSize,
            fontWeight: idx === 0 ? 700 : 500,
            letterSpacing: ".5px",
            cursor: "move",
            zIndex: 20 + idx,
            display: "flex",
            alignItems: "center"
          }}
          onMouseDown={e => handleTextMoveMouseDown(idx, e)}
          onMouseEnter={() => setHoveredTextIdx(idx)}
          onMouseLeave={() => setHoveredTextIdx(null)}
        >
          <span
            style={{
              background: "rgba(255,255,255,0.02)",
              padding: "2px 3px 2px 2px",
              borderRadius: 4
            }}
          >
            {t.value || (idx === 0
              ? "홍길동"
              : idx === 1
                ? "회사명/직책"
                : idx === 2
                  ? "010-1234-5678"
                  : idx === 3
                    ? "email@example.com"
                    : idx === 4
                      ? "주소/기타 정보"
                      : `Text${idx + 1}`)}
          </span>
          {/* ↔/X: hover일 때만 보임 */}
          {hoveredTextIdx === idx && (
            <>
              {/* 크기조절 핸들 */}
              <div
                onMouseDown={e => handleTextResizeMouseDown(idx, e)}
                style={{
                  position: "absolute",
                  right: -19,
                  bottom: -16,
                  width: 23,
                  height: 23,
                  background: "#fff",
                  border: "2px solid #3a5dfb",
                  borderRadius: 8,
                  cursor: "nwse-resize",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  color: "#3a5dfb",
                  boxShadow: "0 2px 8px #3a5dfb11",
                  userSelect: "none",
                  zIndex: 1
                }}
                tabIndex={-1}
              >↔</div>
              {/* 삭제(X) 버튼 */}
              <button
                onClick={e => { e.stopPropagation(); onRemoveText(idx); }}
                style={{
                  position: "absolute",
                  top: -17,
                  right: -7,
                  width: 20,
                  height: 20,
                  background: "#fff",
                  border: "1px solid #bbb",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#e33",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  lineHeight: 1
                }}
                tabIndex={-1}
                aria-label="삭제"
              >×</button>
            </>
          )}
        </div>
      ))}

      {/* 프로필 여러장 + X버튼 */}
      {profiles.map((profile, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            left: profile.pos.x,
            top: profile.pos.y,
            zIndex: 50 + idx,
            pointerEvents: "auto",
            width: profile.size,
            height: profile.size,
            cursor: "move"
          }}
          onMouseDown={e => handleProfileMoveMouseDown(idx, e)}
          onMouseEnter={() => setHoveredProfileIdx(idx)}
          onMouseLeave={() => setHoveredProfileIdx(null)}
        >
          <div
            style={{
              position: "relative",
              width: profile.size,
              height: profile.size,
              borderRadius: profile.shape === "circle" ? "50%" : 8,
              overflow: "visible",
              boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              background: "#fff"
            }}
          >
            <img
              src={profile.url}
              alt={`profile${idx}`}
              draggable={false}
              style={{
                position: "relative",
                width: profile.size,
                height: profile.size,
                borderRadius: profile.shape === "circle" ? "50%" : 8,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                background: "#fff"
              }}
            />
            {/* X/핸들: hover일 때만 보임 */}
            {hoveredProfileIdx === idx && (
              <>
                <button
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "#fff",
                    transform: "translate(50%, -50%)",
                    border: "1px solid #bbb",
                    borderRadius: "50%",
                    width: 22,
                    height: 22,
                    cursor: "pointer",
                    fontWeight: 900,
                    color: "#e33",
                    zIndex: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    lineHeight: 1
                  }}
                  onClick={e => { e.stopPropagation(); onProfileDelete(idx); }}
                  tabIndex={-1}
                  aria-label="삭제"
                >×</button>
                <div
                  onMouseDown={e => handleProfileResizeMouseDown(idx, e)}
                  style={{
                    position: "absolute",
                    right: -16,
                    bottom: -16,
                    width: 24,
                    height: 24,
                    background: "#fff",
                    border: "2px solid #3a5dfb",
                    borderRadius: 8,
                    cursor: "nwse-resize",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    color: "#3a5dfb",
                    boxShadow: "0 2px 8px #3a5dfb11",
                    userSelect: "none"
                  }}
                  tabIndex={-1}
                >↔</div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

export default NameCardPreview;
