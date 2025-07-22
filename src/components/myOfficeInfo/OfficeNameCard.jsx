import React, { useState, useEffect, useRef } from "react";
import NameCardPreview from "./nameCard/NameCardPreview";
import NameCardCarousel from "./nameCard/NameCardCarousel";
import axios from "axios";
import html2canvas from "html2canvas";
import Swal from "sweetalert2";
import Input from "../form/input/InputField";

const templates = [
  { id: 1, name: "블루", color: "#3a5dfb" },
  { id: 2, name: "그린", color: "#48c774" },
  { id: 3, name: "오렌지", color: "#ffb347" }
];
const textColors = [
  { code: "#222", name: "블랙" },
  { code: "#fff", name: "화이트" },
  { code: "#3a5dfb", name: "블루" },
  { code: "#2e7d32", name: "그린" },
  { code: "#d65f12", name: "오렌지" }
];

export default function OfficeNameCard() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({
    bigTitle: "",
    smallTitle: "",
    content1: "",
    content2: "",
    content3: "",
    template: templates[0].id,
    bgImageUrl: "",
    textColor: "#222"
  });
  const [editTarget, setEditTarget] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [mbrCd, setMbrCd] = useState("");
  const [nameCards, setNameCards] = useState([]);
  const [mainNameCardId, setMainNameCardId] = useState(null);
  const [fontBigSize, setFontBigSize] = useState(24);
  const [bigTitlePos, setBigTitlePos] = useState({ x: 16, y: 16 });
  const previewRef = useRef();

  useEffect(() => {
    axios.get("/rest/broker/namecard/user").then(res => {
      setMbrCd(res.data.mbrCd);
    });
  }, []);

  useEffect(() => {
    if (mbrCd) {
      axios.get(`/rest/broker/namecard/list/${mbrCd}`).then(res => {
        setNameCards(Array.isArray(res.data) ? res.data : []);
        const mainCard = (Array.isArray(res.data) ? res.data : []).find(card => card.docTypeCd === "NAMECARD_MAIN");
        setMainNameCardId(mainCard?.fileId || null);
      });
    }
  }, [mbrCd, refresh]);

  // 삭제: Swal 적용
  const handleDelete = async (fileId, fileAttachSeq) => {
    const confirm = await Swal.fire({
      title: '명함을 삭제할까요?',
      text: '삭제하면 되돌릴 수 없어요.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      confirmButtonColor: '#d33'
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.delete('/rest/broker/namecard/delete', {
        params: { fileId, fileAttachSeq }
      });
      if (res.data.result === "success") {
        await Swal.fire('삭제 완료!', '명함이 삭제되었습니다.', 'success');
        setRefresh(v => !v);
      } else {
        Swal.fire('삭제 실패', res.data.message || '문제가 발생했어요', 'error');
      }
    } catch (e) {
      Swal.fire('삭제 에러', e.message, 'error');
    }
  };

  // 대표명함 지정: Swal 적용
  const handleSetMain = async (fileId) => {
    if (!fileId) return;
    try {
      const res = await axios.post('/rest/broker/namecard/set-main', null, {
        params: { nameCardId: fileId }
      });
      if (res.data.result === "success") {
        await Swal.fire('대표명함!', '대표명함으로 지정되었습니다!', 'success');
        setRefresh(v => !v);
      } else {
        Swal.fire('대표명함 지정 실패', res.data.message, 'error');
      }
    } catch (e) {
      Swal.fire('대표명함 지정 오류', e.message, 'error');
    }
  };

  // 입력/툴 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleTemplate = (tid) => setForm(prev => ({ ...prev, template: tid, bgImageUrl: "" }));
  const handleBgUpload = (e) => {
    const file = e.target.files[0];
    if (file) setForm(prev => ({
      ...prev,
      bgImageUrl: URL.createObjectURL(file)
    }));
  };
  // ⭐️ 프로필 여러장 업로드
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfiles(prev => [
      ...prev,
      {
        url,
        pos: { x: 40 + prev.length * 40, y: 40 },
        size: 90,
        shape: "circle"
      }
    ]);
    e.target.value = "";
  };
  // ⭐️ 프로필 삭제
  const handleProfileDelete = idx =>
    setProfiles(prev => prev.filter((_, i) => i !== idx));
  // ⭐️ 프로필 이동/크기/쉐입
  const handleProfileUpdate = (idx, data) =>
    setProfiles(prev => prev.map((p, i) => i === idx ? { ...p, ...data } : p));
  const handleProfileShape = shape => {
    if (!profiles.length) return;
    setProfiles(prev => prev.map((p, i) => (i === prev.length - 1 ? { ...p, shape } : p)));
  };

  // 저장: Swal 적용
  const handleSave = async () => {
    if (!previewRef.current) {
      await Swal.fire('오류', "미리보기 없음!", "error");
      return;
    }
    const canvas = await html2canvas(previewRef.current);
    canvas.toBlob(async (blob) => {
      if (!blob) {
        await Swal.fire('오류', "이미지 변환 실패!", "error");
        return;
      }
      const file = new File([blob], "namecard.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sourceRef", "BROKER");
      formData.append("sourceId", mbrCd);
      formData.append("docTypeCd", "NAMECARD");

      try {
        const res = await axios.post("/rest/broker/namecard/save", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.data.result === "success") {
          await Swal.fire('저장 성공!', '명함이 저장되었습니다.', 'success');
          setRefresh(v => !v);
        } else {
          Swal.fire('저장 실패', res.data.message, 'error');
        }
      } catch (err) {
        Swal.fire('오류', err.message, 'error');
      }
    }, "image/png");
  };

  const handleEdit = (card) => {
    setForm({
      ...form,
      ...card
    });
    setEditTarget(card.fileId || null);
  };

  const handleDownload = async () => {
    if (!previewRef.current) {
      await Swal.fire('오류', "명함 미리보기 영역을 찾을 수 없습니다", "error");
      return;
    }
    const canvas = await html2canvas(previewRef.current);
    const link = document.createElement("a");
    link.download = "namecard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const grayInput = {
    width: 320,
    padding: "9px 12px",
    background: "#f5f6fa",
    border: "1.5px solid #d3d5dd",
    borderRadius: 8,
    color: "#222",
    fontSize: 16,
    marginBottom: 2,
    outline: "none",
    transition: "border .16s"
  };

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>
        {`
        .namecard-toolbar {
          display: flex;
          align-items: center;
          gap: 32px;
          margin: 22px 0 18px 0;
        }
        .namecard-toolbar__item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .namecard-toolbar__label {
          font-weight: 600;
          font-size: 15px;
          white-space: nowrap;
        }
        `}
      </style>

      <div style={{ margin: "36px 0 28px 0" }}>
        <NameCardPreview
          ref={previewRef}
          width={360}
          height={200}
          bigTitle={form.bigTitle}
          smallTitle={form.smallTitle}
          content1={form.content1}
          content2={form.content2}
          content3={form.content3}
          color={templates.find(t => t.id === form.template)?.color}
          bgImage={form.bgImageUrl}
          profiles={profiles}
          onProfileDelete={handleProfileDelete}
          onProfileUpdate={handleProfileUpdate}
          textColor={form.textColor}
          fontBigSize={fontBigSize}
          onFontBigSizeChange={setFontBigSize}
          bigTitlePos={bigTitlePos}
          onBigTitlePosChange={setBigTitlePos}
        />
      </div>

      <div className="namecard-toolbar">
        <div className="namecard-toolbar__item">
          <span className="namecard-toolbar__label">명함색상</span>
          {templates.map(t => (
            <button key={t.id} onClick={() => handleTemplate(t.id)}
              style={{
                width: 32, height: 32,
                background: t.color,
                border: form.template === t.id ? "2.5px solid #222" : "1.5px solid #bbb",
                borderRadius: 8, outline: "none", cursor: "pointer"
              }} aria-label={t.name} />
          ))}
        </div>
        <div className="namecard-toolbar__item">
          <span className="namecard-toolbar__label">배경사진설정</span>
          <label style={{ cursor: "pointer", color: "#4260ff", fontWeight: 500 }}>
            사진 불러오기
            <input type="file" accept="image/*" onChange={handleBgUpload} style={{ display: "none" }} />
          </label>
          {form.bgImageUrl &&
            <img src={form.bgImageUrl} alt="bg" style={{
              width: 30, height: 30, borderRadius: 6,
              objectFit: "cover", border: "1.5px solid #ccc", marginLeft: 2
            }} />}
        </div>
        <div className="namecard-toolbar__item">
          <span className="namecard-toolbar__label">프로필</span>
          <label style={{ cursor: "pointer", color: "#4260ff", fontWeight: 500 }}>
            사진 불러오기
            <input type="file" accept="image/*" onChange={handleProfileUpload} style={{ display: "none" }} />
          </label>
          <button style={{
            border: profiles.length && profiles[profiles.length - 1].shape === "circle" ? "2px solid #3a5dfb" : "1px solid #aaa",
            borderRadius: "50%", width: 26, height: 26, marginLeft: 7, fontSize: 15
          }} onClick={() => handleProfileShape("circle")} title="원형">●</button>
          <button style={{
            border: profiles.length && profiles[profiles.length - 1].shape === "rect" ? "2px solid #3a5dfb" : "1px solid #aaa",
            borderRadius: 6, width: 26, height: 26, marginLeft: 3, fontSize: 15
          }} onClick={() => handleProfileShape("rect")} title="사각">■</button>
        </div>
      </div>

      <div style={{ marginBottom: 16, width: 350, display: "flex", gap: 16, alignItems: "center" }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>텍스트 색상</span>
        {textColors.map(tc => (
          <button key={tc.code} style={{
            width: 28, height: 28, background: tc.code,
            border: form.textColor === tc.code ? "2.5px solid #4260ff" : "1.5px solid #bbb",
            borderRadius: "50%", outline: "none", cursor: "pointer"
          }} title={tc.name} onClick={() => handleTextColor(tc.code)} />
        ))}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px 16px",
        marginBottom: 14,
        width: 670
      }}>
        <Input name="bigTitle" value={form.bigTitle} onChange={handleChange} style={grayInput} placeholder="큰제목 (이름 등)" maxLength={18} />
        <Input name="smallTitle" value={form.smallTitle} onChange={handleChange} style={grayInput} placeholder="작은제목 (회사 등)" maxLength={18} />
        <Input name="content1" value={form.content1} onChange={handleChange} style={grayInput} placeholder="내용1 (전화번호)" maxLength={24} />
        <Input name="content2" value={form.content2} onChange={handleChange} style={grayInput} placeholder="내용2 (이메일/주소/직책 등)" maxLength={24} />
        <Input name="content3" value={form.content3} onChange={handleChange} style={grayInput} placeholder="내용3 (이메일/주소/직책 등)" maxLength={24} />
      </div>

      <div style={{
        display: "flex",
        gap: 18,
        marginBottom: 18,
        marginTop: 4,
        width: 320
      }}>
        <button onClick={handleDownload} style={{
          width: 140, background: "#ececec", color: "#3a5dfb",
          fontWeight: 700, borderRadius: 8, border: "1.5px solid #bbb",
          height: 40, fontSize: 15, letterSpacing: "1px",
          boxShadow: "0 2px 7px #5175fd13", cursor: "pointer"
        }}>다운받기</button>
        <button onClick={handleSave} style={{
          width: 140, background: "#ececec", color: "#e33",
          fontWeight: 800, borderRadius: 8, border: "1.5px solid #e33",
          height: 40, fontSize: 15, letterSpacing: "1px",
          boxShadow: "0 2px 7px #e3332a11", cursor: "pointer"
        }}>저장</button>
      </div>

      <div style={{ width: "100%", maxWidth: 900, margin: "30px 0 0 0", display: "flex", justifyContent: "center" }}>
        {mbrCd &&
          <NameCardCarousel
            cards={nameCards}
            onSetMain={handleSetMain}
            mainNameCardId={mainNameCardId}
            onDelete={handleDelete}
          />
        }
      </div>

      <div style={{
        marginTop: 18, fontSize: 14, color: "#7a88a9", textAlign: "center"
      }}>
        💡 명함을 자유롭게 커스텀하고, 저장/다운받기 버튼으로 내 정보를 멋지게 관리해보세요!
      </div>
    </div>
  );
}
