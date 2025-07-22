import React, { useRef, useState } from "react";

// 프리뷰 props:
// width, height, bigTitle, smallTitle, content1~3, color, bgImage, profileImg, profilePos, profileSize, profileShape, textColor
const defaultProfilePos = { x: 200, y: 40 };
const defaultProfileSize = 128;

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

export default React.forwardRef(function NameCardPreview({
  width = 360,
  height = 200,
  bigTitle,
  smallTitle,
  content1,
  content2,
  content3,
  color = "#3a5dfb",
  bgImage,
  profileImg,
  profilePos = defaultProfilePos,
  profileSize = defaultProfileSize,
  profileShape = "circle",
  textColor = "#222",
  onProfilePosChange,
  onProfileSizeChange,
}, ref) {
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const profileRef = useRef();

  // 드래그 이동
  const handleProfileMouseDown = e => {
    if (!profileRef.current) return;
    e.preventDefault();
    setDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      pos: { ...profilePos }
    });
    window.addEventListener("mousemove", handleProfileMouseMove);
    window.addEventListener("mouseup", handleProfileMouseUp);
  };
  const handleProfileMouseMove = e => {
    if (!dragging || !dragStart) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const newX = clamp(dragStart.pos.x + dx, 0, width - profileSize);
    const newY = clamp(dragStart.pos.y + dy, 0, height - profileSize);
    onProfilePosChange && onProfilePosChange({ x: newX, y: newY });
  };
  const handleProfileMouseUp = () => {
    setDragging(false);
    setDragStart(null);
    window.removeEventListener("mousemove", handleProfileMouseMove);
    window.removeEventListener("mouseup", handleProfileMouseUp);
  };

  // 프로필 크기 조절
  const handleResizeMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();
    setDragging("resize");
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      size: profileSize
    });
    window.addEventListener("mousemove", handleResizeMouseMove);
    window.addEventListener("mouseup", handleResizeMouseUp);
  };
  const handleResizeMouseMove = e => {
    if (dragging !== "resize" || !dragStart) return;
    const d = e.clientX - dragStart.x + e.clientY - dragStart.y;
    const newSize = clamp(dragStart.size + d, 40, 170);
    onProfileSizeChange && onProfileSizeChange(newSize);
  };
  const handleResizeMouseUp = () => {
    setDragging(false);
    setDragStart(null);
    window.removeEventListener("mousemove", handleResizeMouseMove);
    window.removeEventListener("mouseup", handleResizeMouseUp);
  };

  return (
    <div
      ref={ref}
      style={{
        width,
        height,
        background: color,
        borderRadius: 24,
        boxShadow: "0 4px 36px #4671ee19",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 배경 이미지 */}
      {bgImage && (
        <img
          src={bgImage}
          alt="bg"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
            objectFit: "cover",
            opacity: 0.9,
            zIndex: 0,
            borderRadius: 24,
          }}
        />
      )}

      {/* 프로필 이미지 */}
      {profileImg && (
        <div
          ref={profileRef}
          style={{
            position: "absolute",
            left: profilePos.x,
            top: profilePos.y,
            width: profileSize,
            height: profileSize,
            zIndex: 2,
            cursor: dragging ? "grabbing" : "grab",
            borderRadius: profileShape === "circle" ? "50%" : "14px",
            overflow: "hidden",
            boxShadow: "0 2px 12px #1a233655",
            border: "3px solid #fff"
          }}
          onMouseDown={handleProfileMouseDown}
        >
          <img
            src={profileImg}
            alt="profile"
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: profileShape === "circle" ? "50%" : "14px"
            }}
          />
          {/* 크기조절 핸들 */}
          <div
            style={{
              position: "absolute",
              right: -8,
              bottom: -8,
              width: 23,
              height: 23,
              background: "#fff",
              borderRadius: "50%",
              border: "2px solid #4671ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "nwse-resize",
              zIndex: 5,
              boxShadow: "0 1px 7px #aaa3"
            }}
            onMouseDown={handleResizeMouseDown}
          >
            <svg width="12" height="12" viewBox="0 0 14 14">
              <polyline points="1,13 13,1" stroke="#4671ee" strokeWidth="2" fill="none" />
              <circle cx="13" cy="1" r="1.3" fill="#4671ee" />
            </svg>
          </div>
        </div>
      )}

      {/* 텍스트 */}
      <div
        style={{
          width: "88%",
          height: "88%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 1,
          position: "relative",
        }}
      >
        <div style={{
          fontSize: 28,
          fontWeight: 800,
          color: textColor,
          textAlign: "center",
          letterSpacing: "-1px",
          marginBottom: 6,
          textShadow: "0 1px 12px #fff8",
        }}>
          {bigTitle || "큰제목"}
        </div>
        <div style={{
          fontSize: 18,
          fontWeight: 500,
          color: textColor,
          opacity: 0.92,
          textAlign: "center",
          marginBottom: 8
        }}>
          {smallTitle || "작은제목"}
        </div>
        {[content1, content2, content3].map(
          (c, i) => c ? (
            <div key={i} style={{
              fontSize: 15,
              color: textColor,
              textAlign: "center",
              opacity: 0.92,
              marginTop: 3
            }}>
              {c}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
});
