import React, { useState } from 'react';
import OfficeInfo from './OfficeInfoChild.jsx';
import OfficeNameCard from './OfficeNameCard.jsx';
import OfficeInfoMap from './OfficeInfoMap.jsx';


const TABS = [
  { key: 'info', label: '사무소정보' },
  { key: 'card', label: '내명함관리' },
  { key: 'map', label: '지도' },
];

export default function OfficeInfoMain() {
  const [tab, setTab] = useState('info');

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '10px 28px',
              border: 'none',
              borderBottom: tab === key ? '3px solid #3a5dfb' : '3px solid transparent',
              background: 'none',
              color: tab === key ? '#3a5dfb' : '#444',
              fontWeight: tab === key ? 700 : 500,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div>
        {tab === 'info' && <OfficeInfo onEditTabMove={() => setTab('card')} />}
        {tab === 'card' && <OfficeNameCard />}
        {tab === 'map' && <OfficeInfoMap />}
        
      </div>
    </div>
  );
}
