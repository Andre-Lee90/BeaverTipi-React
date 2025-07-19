import React, { useState } from "react";
import NameCardPreview from "./nameCard/NameCardPreview";
import NameCardList from "./nameCard/NameCardList";

const templates = [
  { id: 1, name: "블루", color: "#3a5dfb" },
  { id: 2, name: "그린", color: "#48c774" },
  { id: 3, name: "오렌지", color: "#ffb347" }
];

export default function OfficeNameCard() {
  const [form, setForm] = useState({
    bigTitle: "",
    smallTitle: "",
    content1: "",
    content2: "",
    content3: "",
    template: templates[0].id,
    bgImageUrl: "",
    profileUrl: "",
    profileShape: "circle"
  });

  const handleTemplate = (tid) =>
    setForm(prev => ({ ...prev, template: tid, bgImageUrl: "" }));
  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) setForm(prev => ({ ...prev, bgImageUrl: URL.createObjectURL(file) }));
  };
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setForm(prev => ({ ...prev, profileUrl: URL.createObjectURL(file) }));
  };
  const handleProfileShape = (shape) =>
    setForm(prev => ({ ...prev, profileShape: shape }));

  return (
    <div style={{
      width: "100%",
      maxWidth: 900,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      {/* 명함 미리보기 */}
      <div style={{ margin: "36px 0 28px 0" }}>
        <NameCardPreview
          width={440}
          height={230}
          color={templates.find(t => t.id === form.template)?.color}
          bgImage={form.bgImageUrl}
          profileImg={form.profileUrl}
          profileShape={form.profileShape}
        />
      </div>
      {/* 툴바 - 한 줄, 줄바꿈 없음 */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 28,
        margin: "22px 0 18px 0"
      }}>
        {/* 명함색상 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontWeight: 600,
            fontSize: 15,
            whiteSpace: "nowrap"
          }}>명함색상</span>
          {templates.map(t => (
            <button key={t.id}
              onClick={() => handleTemplate(t.id)}
              style={{
                width: 32, height: 32,
                background: t.color,
                border: form.template === t.id ? "2.5px solid #222" : "1.5px solid #bbb",
                borderRadius: 8,
                outline: "none",
                cursor: "pointer"
              }}
              aria-label={t.name}
            />
          ))}
        </div>
        {/* 배경사진설정 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontWeight: 600,
            fontSize: 15,
            whiteSpace: "nowrap"
          }}>배경사진설정</span>
          <label style={{ cursor: "pointer", color: "#4260ff", fontWeight: 500 }}>
            사진 불러오기
            <input type="file" accept="image/*" onChange={handleBgUpload} style={{ display: "none" }} />
          </label>
          {form.bgImageUrl &&
            <img src={form.bgImageUrl} alt="bg" style={{
              width: 30, height: 30, borderRadius: 6,
              objectFit: "cover", border: "1.5px solid #ccc", marginLeft: 2
            }} />
          }
        </div>
        {/* 프로필 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontWeight: 600,
            fontSize: 15,
            whiteSpace: "nowrap"
          }}>프로필</span>
          <label style={{ cursor: "pointer", color: "#4260ff", fontWeight: 500 }}>
            사진 불러오기
            <input type="file" accept="image/*" onChange={handleProfileUpload} style={{ display: "none" }} />
          </label>
          {form.profileUrl &&
            <img src={form.profileUrl} alt="profile" style={{
              width: 30, height: 30,
              borderRadius: form.profileShape === "circle" ? "50%" : "6px",
              objectFit: "cover", border: "1.5px solid #ccc", marginLeft: 2
            }} />
          }
          <button
            style={{
              border: form.profileShape === "circle" ? "2px solid #3a5dfb" : "1px solid #aaa",
              borderRadius: "50%", width: 26, height: 26, marginLeft: 7, fontSize: 15
            }}
            onClick={() => handleProfileShape("circle")}
            title="원형"
          >●</button>
          <button
            style={{
              border: form.profileShape === "rect" ? "2px solid #3a5dfb" : "1px solid #aaa",
              borderRadius: 6, width: 26, height: 26, marginLeft: 3, fontSize: 15
            }}
            onClick={() => handleProfileShape("rect")}
            title="사각"
          >■</button>
        </div>
      </div>
      {/* 캐러셀(명함 리스트) */}
      <div style={{
        width: "100%",
        maxWidth: 900,
        margin: "30px 0 0 0",
        display: "flex",
        justifyContent: "center"
      }}>
        <NameCardList />
      </div>
    </div>
  );
}
