import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import axios from "axios";

// 이미지 드래그/리사이즈/삭제 컨트롤 박스
function EditableImage({ img, idx, onMove, onResize, onDelete, isEditing }) {
  const [hovered, setHovered] = useState(false);

  const handleMoveMouseDown = (e) => {
    if (!isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const { x, y } = img;
    const onMouseMove = moveEvt => {
      const diffX = moveEvt.clientX - startX;
      const diffY = moveEvt.clientY - startY;
      onMove(idx, { x: x + diffX, y: y + diffY });
    };
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleResizeMouseDown = (e) => {
    if (!isEditing) return;
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = img.width;
    const onMouseMove = moveEvt => {
      const diff = moveEvt.clientX - startX;
      let newWidth = Math.max(40, Math.min(540, startWidth + diff));
      onResize(idx, newWidth);
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
      style={{
        position: "absolute",
        left: img.x,
        top: img.y,
        width: img.width,
        height: "auto",
        zIndex: 100 + idx,
        cursor: isEditing ? "move" : "default",
        userSelect: "none"
      }}
      onMouseDown={handleMoveMouseDown}
      onMouseEnter={() => isEditing && setHovered(true)}
      onMouseLeave={() => isEditing && setHovered(false)}
    >
      <div style={{
        position: "relative",
        width: img.width,
        height: "auto",
        boxShadow: "0 2px 8px #0001",
        borderRadius: 10,
        background: "#fff"
      }}>
        <img
          src={img.src}
          alt=""
          draggable={false}
          style={{
            width: img.width,
            height: "auto",
            borderRadius: 10,
            display: "block",
            pointerEvents: "none",
            userSelect: "none"
          }}
        />
        {isEditing && hovered && (
          <>
            <button
              onClick={e => { e.stopPropagation(); onDelete(idx); }}
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 24,
                height: 24,
                background: "#fff",
                border: "1px solid #bbb",
                borderRadius: "50%",
                cursor: "pointer",
                fontWeight: "bold",
                color: "#e33",
                zIndex: 20,
                boxShadow: "0 2px 6px #0001",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                lineHeight: 1
              }}
              tabIndex={-1}
              aria-label="삭제"
            >×</button>
            <div
              onMouseDown={handleResizeMouseDown}
              style={{
                position: "absolute",
                right: -13,
                bottom: -13,
                width: 26,
                height: 26,
                background: "#fff",
                border: "2px solid #3a5dfb",
                borderRadius: 9,
                cursor: "nwse-resize",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                color: "#3a5dfb",
                boxShadow: "0 2px 8px #3a5dfb22",
                userSelect: "none",
                zIndex: 10
              }}
              tabIndex={-1}
            >↔</div>
          </>
        )}
      </div>
    </div>
  );
}

export default function OfficeIntroCard({ value, onChange, isEditing = true, mbrCd }) {
  const ref = useRef();
  const fileRef = useRef();
  const bodyRef = useRef();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 에디터 명령
  const doCommand = (cmd, arg) => {
    ref.current.focus();
    document.execCommand(cmd, false, arg);
    if (onChange) onChange(ref.current.innerHTML);
  };

  const handleFontSize = e => doCommand("fontSize", e.target.value);
  const handleColor = e => doCommand("foreColor", e.target.value);
  const handleInput = () => { if (onChange) onChange(ref.current.innerHTML); };
  const handleAlign = cmd => doCommand(cmd);

  // 이미지 첨부
  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      setImages(imgs => [
        ...imgs,
        {
          src: ev.target.result,
          x: 100 + imgs.length * 20,
          y: 70 + imgs.length * 20,
          width: 180
        }
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // 이미지 핸들 함수
  const handleMove = (idx, pos) => {
    setImages(imgs =>
      imgs.map((img, i) => (i === idx ? { ...img, ...pos } : img))
    );
  };
  const handleResize = (idx, width) => {
    setImages(imgs =>
      imgs.map((img, i) => (i === idx ? { ...img, width } : img))
    );
  };
  const handleDelete = idx => {
    setImages(imgs => imgs.filter((_, i) => i !== idx));
  };
  const openFileDialog = () => { fileRef.current.click(); };

  // 저장(캡처→업로드)
  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(bodyRef.current, {
        backgroundColor: null,
        useCORS: true,
        scale: 2
      });
      const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
      const formData = new FormData();
      formData.append("file", blob, "intro-desc.png");
      formData.append("sourceRef", "BROKER");
      formData.append("sourceId", mbrCd);
      formData.append("docTypeCd", "NAMECARD");
      const res = await axios.post("/rest/broker/namecard/save", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.result === "success") {
        alert("명함이 저장되었습니다!");
      } else {
        alert(res.data.message || "저장 실패!");
      }
    } catch (e) {
      alert("저장 중 오류: " + e.message);
    }
    setLoading(false);
  };

  // 지우기
  const handleClear = () => {
    if (onChange) onChange("");
    setImages([]);
  };

  const styles = {
    box: {
      padding: "0",
      background: "none",
      border: "none",
      boxShadow: "none",
      borderRadius: 0,
      maxWidth: "unset",
      margin: 0
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "12px",
      gap: "10px"
    },
    btn: {
      background: "#fff",
      border: "1px solid #d1d1d1",
      borderRadius: "6px",
      width: "32px",
      height: "32px",
      cursor: "pointer",
      fontSize: "1.15rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    select: {
      border: "1px solid #d1d1d1",
      borderRadius: "5px",
      height: "32px",
      fontSize: "1rem",
      padding: "0 4px",
      marginLeft: "6px"
    },
    colorInput: {
      width: "32px",
      height: "32px",
      border: "none",
      background: "none",
      padding: 0,
      cursor: "pointer",
      marginLeft: "3px"
    },
    editor: {
      minHeight: "320px", // 넓게~
      width: "100%",
      border: "none",
      outline: "none",
      background: "transparent",
      fontSize: "1.1rem",
      fontFamily: "inherit",
      color: "#30363c",
      padding: "0 2px",
      resize: "vertical",
      zIndex: 10,
      position: "relative"
    },
    fileInput: { display: "none" }
  };

  return (
    <div style={styles.box}>
      {/* 툴바 + 저장/지우기 */}
      <div style={styles.toolbar}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button style={styles.btn} title="굵게"
            onMouseDown={e => e.preventDefault()}
            onClick={() => doCommand("bold")}>
            <b>B</b>
          </button>
          <button style={styles.btn} title="이탤릭"
            onMouseDown={e => e.preventDefault()}
            onClick={() => doCommand("italic")}>
            <i>I</i>
          </button>
          <select style={styles.select} defaultValue="3" onChange={handleFontSize} title="글씨 크기">
            <option value="1">작게</option>
            <option value="2">조금 작게</option>
            <option value="3">보통</option>
            <option value="4">조금 크게</option>
            <option value="5">크게</option>
            <option value="6">더 크게</option>
            <option value="7">왕크게</option>
          </select>
          <input type="color" title="글씨 색상" style={styles.colorInput} onChange={handleColor} />
          <button style={styles.btn} title="왼쪽 정렬"
            onMouseDown={e => e.preventDefault()}
            onClick={() => handleAlign("justifyLeft")}>L</button>
          <button style={styles.btn} title="가운데 정렬"
            onMouseDown={e => e.preventDefault()}
            onClick={() => handleAlign("justifyCenter")}>C</button>
          <button style={styles.btn} title="오른쪽 정렬"
            onMouseDown={e => e.preventDefault()}
            onClick={() => handleAlign("justifyRight")}>R</button>
          <button style={styles.btn} title="사진 첨부" type="button"
            onMouseDown={e => e.preventDefault()}
            onClick={openFileDialog}>
            <span role="img" aria-label="사진" style={{ fontSize: "1.2rem" }}>🖼️</span>
          </button>
          <input type="file" ref={fileRef} accept="image/*" style={styles.fileInput} onChange={handleImageChange} />
        </div>
        {/* 저장/지우기 */}
        <div style={{ display: "flex", gap: 7 }}>
          <button
            onClick={handleSave}
            style={{
              ...styles.btn,
              background: "#3a5dfb",
              color: "#fff",
              border: "1.5px solid #3a5dfb",
              fontWeight: 700,
              width: 52,
              height: 32,
              fontSize: 15
            }}
            disabled={loading}
          >{loading ? "저장중" : "저장"}</button>
          <button
            onClick={handleClear}
            style={{
              ...styles.btn,
              background: "#fff",
              color: "#e33",
              border: "1.5px solid #e33",
              fontWeight: 700,
              width: 52,
              height: 32,
              fontSize: 15
            }}
          >지우기</button>
        </div>
      </div>
      {/* 본문만 캡처 */}
      <div ref={bodyRef} className="office-intro-editor-box" style={{ position: "relative", minHeight: 120 }}>
        <div
          ref={ref}
          style={styles.editor}
          contentEditable
          suppressContentEditableWarning
          spellCheck="false"
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: value || "" }}
        />
        {images.map((img, idx) =>
          <EditableImage
            key={idx}
            img={img}
            idx={idx}
            onMove={handleMove}
            onResize={handleResize}
            onDelete={handleDelete}
            isEditing={isEditing}
          />
        )}
      </div>
    </div>
  );
}
