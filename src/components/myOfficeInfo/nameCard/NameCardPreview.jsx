// src/components/myOfficeInfo/nameCard/NameCardPreview.jsx
import React, { useRef } from "react";

export default function NameCardPreview({
  width = 440,
  height = 230,
  bigTitle,
  smallTitle,
  content1,
  content2,
  content3,
  color = "#3a5dfb",
  bgImage,
  profileImg,
  profilePos = { x: 200, y: 40 },
  profileSize = 128,
  profileShape = "circle",
  textColor = "#222",
  onProfilePosChange,
  onProfileSizeChange,
}) {
  const dragMove = useRef(false);
  const dragResize = useRef(false);

  const handleMoveMouseDown = (e) => {
    e.stopPropagation();
    dragMove.current = true;
    const startX = e.clientX;
    const startY = e.clientY;
    const { x, y } = profilePos;
    const onMouseMove = (moveEvt) => {
      if (!dragMove.current) return;
      const diffX = moveEvt.clientX - startX;
      const diffY = moveEvt.clientY - startY;
      onProfilePosChange?.({ x: x + diffX, y: y + diffY });
    };
    const onMouseUp = () => {
      dragMove.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    dragResize.current = true;
    const startX = e.clientX;
    const startSize = profileSize;
    const onMouseMove = (moveEvt) => {
      if (!dragResize.current) return;
      const diff = moveEvt.clientX - startX;
      const newSize = Math.max(40, startSize + diff);
      onProfileSizeChange?.(newSize);
    };
    const onMouseUp = () => {
      dragResize.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        background: bgImage ? `url(${bgImage}) center/cover` : color,
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
        overflow: "visible",
      }}
    >
        {/* ① 텍스트 영역 */}
        <div style={{ padding: 16, color: textColor }}>
        <h2 style={{ margin: 0, fontSize: 24 }}>{bigTitle || "홍길동"}</h2>
        <h4 style={{ margin: "4px 0", fontSize: 16 }}>{smallTitle || "회사명/직책"}</h4>
        <p style={{ margin: "8px 0 0", fontSize: 14 }}>{content1 || "010-1234-5678"}</p>
        <p style={{ margin: "4px 0 0", fontSize: 14 }}>{content2 || "email@example.com"}</p>
        <p style={{ margin: "4px 0 0", fontSize: 14 }}>{content3 || "주소/기타 정보"}</p>
        </div>

{profileImg && (
  <div
    onMouseDown={handleMoveMouseDown}
    style={{
      position: "absolute",
      left: profilePos.x,
      top: profilePos.y,
      cursor: "move",
    }}
  >
    {/* 이미지 영역 (클립) */}
    <div
      style={{
        width: profileSize,
        height: profileSize,
        borderRadius: profileShape === "circle" ? "50%" : 8,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <img
        src={profileImg}
        alt="profile"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    </div>
    {/* 사이즈 조절 핸들 */}
    <div
      onMouseDown={handleResizeMouseDown}
      style={{
        position: "absolute",
        right: -8,
        bottom: -8,
        width: 16,
        height: 16,
        background: "#fff",
        border: "2px solid #3a5dfb",
        borderRadius: 4,
        cursor: "nwse-resize",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        color: "#3a5dfb",
        userSelect: "none",
      }}
    >
      ↔
    </div>
  </div>
)}

    </div>
  );
}
