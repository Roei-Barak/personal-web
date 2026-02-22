// src/routes/SkiDashboard.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useSkiStore } from '../store/skiStore';
import {
  INIT_REMINDERS,
  INIT_RESORTS,
  INIT_INSURANCE,
  INIT_PLACES,
  INIT_UPLOADS,
  CATS,
  TIPS,
  PEOPLE,
  PC,
  PRIO_CFG,
} from '../data/initialSkiData';
import type { SkiItem, Reminder, Resort, Insurance, Place, Expense, MediaItem, UploadTask } from '../types/skiTypes';

const S = {
  card: { background: '#0f1623', border: '1px solid #1e2d4a', borderRadius: 16, padding: 22 },
  inp: { background: '#080d18', border: '1px solid #1e2d4a', borderRadius: 8, padding: '8px 12px', color: '#dde8f7', fontSize: 13, fontFamily: '"Heebo", sans-serif', boxSizing: 'border-box' as const },
  btn: { border: 'none', borderRadius: 8, padding: '9px 18px', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: '"Heebo", sans-serif' },
};

interface InpProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  type?: string;
}

function Inp({ value, onChange, placeholder, style, type = 'text' }: InpProps) {
  return (
    <input 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder} 
      type={type} 
      style={{ ...S.inp, ...style } as React.CSSProperties} 
    />
  );
}

export default function SkiDashboard() {
  const { items, loading, fetchItems, togglePacked, addItem: addStoreItem, deleteItem: deleteStoreItem } = useSkiStore();

  const [phase, setPhase] = useState('before');
  const [reminders, setReminders] = useState<Reminder[]>(INIT_REMINDERS);
  const [resorts, setResorts] = useState<Resort[]>(INIT_RESORTS);
  const [insurances, setInsurances] = useState<Insurance[]>(INIT_INSURANCE);
  const [places, setPlaces] = useState<Place[]>(INIT_PLACES);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploads, setUploads] = useState<UploadTask[]>(INIT_UPLOADS);
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const [activeTip, setActiveTip] = useState<string | null>(null);

  const [nName, setNName] = useState('');
  const [nCat, setNCat] = useState('ביגוד סקי');
  const [nSt, setNSt] = useState('have');
  const [nImg, setNImg] = useState('');
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [editItemForm, setEditItemForm] = useState<Partial<SkiItem>>({});

  const [newRemText, setNewRemText] = useState('');
  const [newRemPrio, setNewRemPrio] = useState<'urgent' | 'medium' | 'low'>('medium');
  const [newRemEmoji, setNewRemEmoji] = useState('📌');
  const [editRemId, setEditRemId] = useState<number | null>(null);
  const [editRemText, setEditRemText] = useState('');

  const [expandedResort, setExpandedResort] = useState<number | null>(null);
  const [editResortId, setEditResortId] = useState<number | null>(null);
  const [editResortForm, setEditResortForm] = useState<Partial<Resort>>({});
  const [showAddResort, setShowAddResort] = useState(false);
  const [newResort, setNewResort] = useState<Partial<Resort>>({ name: '', flag: '🏔️', country: '', flight: '', pkg: '', level: 'כל הרמות', rating: 3, details: '' });

  const [expandedIns, setExpandedIns] = useState<number | null>(null);
  const [editInsId, setEditInsId] = useState<number | null>(null);
  const [editInsForm, setEditInsForm] = useState<Partial<Insurance>>({});
  const [showAddIns, setShowAddIns] = useState(false);
  const [newIns, setNewIns] = useState<Partial<Insurance>>({ name: '', logo: '🛡️', medical: '', sports: true, cancel: true, cancelNote: '', price: '', features: [], sports_detail: '', contact: '' });

  const [showAddPlace, setShowAddPlace] = useState(false);
  const [newPlace, setNewPlace] = useState<Partial<Place>>({ name: '', type: 'בילוי', emoji: '📍', note: '' });
  const [editPlaceId, setEditPlaceId] = useState<number | null>(null);
  const [editPlaceForm, setEditPlaceForm] = useState<Partial<Place>>({});

  const [expDesc, setExpDesc] = useState('');
  const [expAmt, setExpAmt] = useState('');
  const [expPayer, setExpPayer] = useState(0);
  const [expSplit, setExpSplit] = useState<number[]>([0,1,2,3]);

  const [mediaDevice, setMediaDevice] = useState('GoPro');
  const [mediaDesc, setMediaDesc] = useState('');
  const [mediaRun, setMediaRun] = useState('');
  const [editMediaId, setEditMediaId] = useState<number | null>(null);
  const [editMediaForm, setEditMediaForm] = useState<Partial<MediaItem>>({});

  const packStats = useMemo(() => {
    const total = items.length;
    const packed = items.filter(i => i.packed).length;
    const toBuy = items.filter(i => i.status === 'buy').length;
    return { total, packed, toBuy, pct: total ? Math.round(packed / total * 100) : 0 };
  }, [items]);

  const balances = useMemo(() => {
    const t = PEOPLE.map(() => ({ paid: 0, share: 0 }));
    expenses.forEach(e => {
      t[e.payer].paid += e.amount;
      e.split.forEach(p => { t[p].share += e.amount / e.split.length; });
    });
    return PEOPLE.map((name, i) => ({ name, balance: t[i].paid - t[i].share, paid: t[i].paid }));
  }, [expenses]);

  const settlements = useMemo(() => {
    const result = [];
    const neg = balances.filter(b => b.balance < -0.01).map(b => ({ ...b, rem: -b.balance }));
    const pos = balances.filter(b => b.balance > 0.01).map(b => ({ ...b, rem: b.balance }));
    let ni = 0, pi = 0;
    while (ni < neg.length && pi < pos.length) {
      const amt = Math.min(neg[ni].rem, pos[pi].rem);
      if (amt > 0.01) result.push({ from: neg[ni].name, to: pos[pi].name, amount: Math.round(amt*100)/100 });
      neg[ni].rem -= amt; pos[pi].rem -= amt;
      if (neg[ni].rem < 0.01) ni++;
      if (pos[pi].rem < 0.01) pi++;
    }
    return result;
  }, [balances]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = () => { 
    if (!nName.trim()) return; 
    addStoreItem({ cat: nCat, name: nName, status: nSt, packed: false, optional: false, img: nImg || 'https://images.unsplash.com/photo-1551698618-1fed5d978028?w=300&h=300&fit=crop' }); 
    setNName(''); setNImg(''); 
  };
  const saveItemEdit = (id: number) => { 
    // הערה: כדי לעדכן ב-Supabase, הוסף כאן update call אם צריך
    setEditItemId(null); 
  };

  const addReminder = () => { if (!newRemText.trim()) return; setReminders(p => [...p, { id: Date.now(), text: newRemText, done: false, priority: newRemPrio, emoji: newRemEmoji }]); setNewRemText(''); };
  const saveRemEdit = (id: number) => { setReminders(p => p.map(r => r.id === id ? { ...r, text: editRemText } : r)); setEditRemId(null); };

  const addResort = () => { setResorts(p => [...p, { ...newResort, id: Date.now() } as Resort]); setShowAddResort(false); setNewResort({ name: '', flag: '🏔️', country: '', flight: '', pkg: '', level: 'כל הרמות', rating: 3, details: '' }); };
  const saveResortEdit = (id: number) => { setResorts(p => p.map(r => r.id === id ? { ...r, ...editResortForm } : r)); setEditResortId(null); };

  const addIns = () => { setInsurances(p => [...p, { ...newIns, id: Date.now(), features: (newIns.features as string).split(',').map(s => s.trim()).filter(Boolean) } as Insurance]); setShowAddIns(false); setNewIns({ name: '', logo: '🛡️', medical: '', sports: true, cancel: true, cancelNote: '', price: '', features: '', sports_detail: '', contact: '' }); };
  const saveInsEdit = (id: number) => { setInsurances(p => p.map(i => i.id === id ? { ...i, ...editInsForm } : i)); setEditInsId(null); };

  const addPlace = () => { if (!newPlace.name?.trim()) return; setPlaces(p => [...p, { ...newPlace, id: Date.now(), visited: false } as Place]); setShowAddPlace(false); setNewPlace({ name: '', type: 'בילוי', emoji: '📍', note: '' }); };
  const savePlaceEdit = (id: number) => { setPlaces(p => p.map(x => x.id === id ? { ...x, ...editPlaceForm } : x)); setEditPlaceId(null); };

  const addExpense = () => { if (!expDesc.trim() || !expAmt || !expSplit.length) return; setExpenses(p => [...p, { id: Date.now(), desc: expDesc, amount: parseFloat(expAmt), payer: expPayer, split: [...expSplit], date: new Date().toLocaleDateString('he-IL') }]); setExpDesc(''); setExpAmt(''); };
  const addMedia = () => { if (!mediaDesc.trim()) return; setMedia(p => [...p, { id: Date.now(), device: mediaDevice, desc: mediaDesc, run: mediaRun, uploaded: false }]); setMediaDesc(''); setMediaRun(''); };
  const saveMediaEdit = (id: number) => { setMedia(p => p.map(m => m.id === id ? { ...m, ...editMediaForm } : m)); setEditMediaId(null); };

  return (
    <div style={{ background: 'linear-gradient(170deg,#060910 0%,#0a1220 100%)', minHeight: '100vh', fontFamily: '"Heebo",sans-serif', direction: 'rtl', color: '#dde8f7' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#080b14}::-webkit-scrollbar-thumb{background:#1e2d4a;border-radius:3px}
        .rh{transition:background .15s}.rh:hover{background:rgba(77,184,255,.05)!important}
        .ch{transition:all .2s;cursor:pointer}.ch:hover{border-color:rgba(77,184,255,.4)!important;transform:translateY(-2px)}
        .eb{background:none;border:none;cursor:pointer;color:#2d4060;transition:color .15s;font-size:13px;padding:2px 4px;font-family:inherit}
        .eb:hover{color:#60a5fa}
        .db{background:none;border:none;cursor:pointer;color:#2d4060;transition:color .15s;font-size:13px;padding:2px 4px;font-family:inherit}
        .db:hover{color:#f87171}
        input:focus,select:focus,textarea:focus{outline:none;border-color:#3b82f6!important}
        input::placeholder,textarea::placeholder{color:#2a3c55}
        @keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fu .2s ease}
        textarea{font-family:"Heebo",sans-serif;resize:vertical}
        .item-wrap{position:relative}
        .item-img{position:absolute;top:50%;transform:translateY(-50%);right:100%;margin-right:8px;width:80px;height:80px;border-radius:10px;object-fit:cover;border:2px solid #1e2d4a;opacity:0;pointer-events:none;transition:opacity .18s;z-index:200;background:#080d18;box-shadow:0 8px 24px rgba(0,0,0,.6)}
        .item-wrap:hover .item-img{opacity:1}
      `}</style>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg,#0b1528,#0e1f3a,#0b1528)', position: 'relative', overflow: 'hidden' }}>
        <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', opacity: .5 }} height="55" viewBox="0 0 1400 55" preserveAspectRatio="none">
          <path d="M0,55 L0,35 L200,8 L480,26 L720,4 L1000,20 L1260,8 L1400,16 L1400,55Z" fill="rgba(77,184,255,.07)"/>
          <path d="M0,55 L0,44 L260,20 L510,40 L770,16 L1040,33 L1300,20 L1400,13 L1400,55Z" fill="rgba(77,184,255,.09)"/>
        </svg>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '26px 20px 54px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 34 }}>⛷️</span>
          <div>
            <h1 style={{ fontSize: 27, fontWeight: 900, background: 'linear-gradient(135deg,#fff,#4db8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ski Trip Manager</h1>
            <p style={{ color: '#4d7aaa', fontSize: 12, marginTop: 3 }}>מהכנות ועד זיכרונות — הכל במקום אחד 🏔️</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(6,9,16,.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #1a2840' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex' }}>
          {[{ key: 'before', label: 'לפני הטיול', emoji: '📋', color: '#3b82f6' }, { key: 'during', label: 'בזמן הטיול', emoji: '🏔️', color: '#8b5cf6' }, { key: 'after', label: 'אחרי הטיול', emoji: '🎬', color: '#ec4899' }].map(p => (
            <button key={p.key} onClick={() => setPhase(p.key)} style={{ flex: 1, padding: '12px 10px', background: 'none', border: 'none', cursor: 'pointer', color: phase === p.key ? p.color : '#4d6a8a', fontWeight: phase === p.key ? 700 : 500, fontSize: 12, fontFamily: '"Heebo",sans-serif', borderBottom: `2px solid ${phase === p.key ? p.color : 'transparent'}`, transition: 'all .2s' }}>
              <span style={{ display: 'block', fontSize: 19, marginBottom: 2 }}>{p.emoji}</span>{p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '26px 20px 60px' }} className="fu">

        {/* BEFORE */}
        {phase === 'before' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Progress */}
            <div style={{ ...S.card, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                <div><h2 style={{ fontSize: 15, fontWeight: 700 }}>📊 סטטוס אריזה</h2><p style={{ color: '#4d6a8a', fontSize: 12, marginTop: 2 }}>{packStats.packed} מתוך {packStats.total} פריטים נארזו</p></div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[{ l: 'נארז', v: packStats.packed, c: '#34d399' }, { l: 'לקנות', v: packStats.toBuy, c: '#fbbf24' }, { l: 'סה"כ', v: packStats.total, c: '#4db8ff' }].map(s => (
                    <div key={s.l} style={{ textAlign: 'center', background: 'rgba(255,255,255,.03)', padding: '5px 11px', borderRadius: 9 }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: s.c }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: '#4d6a8a' }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ height: 8, background: '#121e30', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${packStats.pct}%`, background: 'linear-gradient(90deg,#3b82f6,#34d399)', borderRadius: 4, transition: 'width 1s ease' }} />
              </div>
              <div style={{ textAlign: 'left', marginTop: 4, fontSize: 11, color: '#4db8ff', fontWeight: 700 }}>{packStats.pct}%</div>
            </div>

            {/* REMINDERS */}
            <div style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13, flexWrap: 'wrap', gap: 8 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700 }}>🔔 תזכורות ומשימות</h2>
                <span style={{ fontSize: 11, color: '#3d5269' }}>לחץ לסימון · ✏️ לעריכה · שנה עדיפות ברשימה</span>
              </div>
              {/* Add */}
              <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid #1a2840', borderRadius: 10, padding: 11, marginBottom: 13 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Inp value={newRemEmoji} onChange={setNewRemEmoji} placeholder="😀" style={{ width: 46, textAlign: 'center', padding: '8px 4px' }} />
                  <Inp value={newRemText} onChange={setNewRemText} placeholder="תזכורת חדשה..." style={{ flex: '1 1 160px' }} />
                  <select value={newRemPrio} onChange={(e) => setNewRemPrio(e.target.value as 'urgent' | 'medium' | 'low')} style={{ ...S.inp, width: 90 }}>
                    <option value="urgent">דחוף</option><option value="medium">בינוני</option><option value="low">נמוך</option>
                  </select>
                  <button onClick={addReminder} style={{ ...S.btn, background: '#3b82f6', color: '#fff' }}>+ הוסף</button>
                </div>
              </div>
              {['urgent', 'medium', 'low'].map(prio => {
                const grp = reminders.filter(r => r.priority === prio);
                if (!grp.length) return null;
                const cfg = PRIO_CFG[prio as keyof typeof PRIO_CFG];
                return (
                  <div key={prio} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, display: 'inline-block' }} />{cfg.label}
                    </div>
                    {grp.map(r => (
                      <div key={r.id} className="rh" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, marginBottom: 4, border: '1px solid rgba(255,255,255,.02)', opacity: r.done ? 0.45 : 1 }}>
                        <div onClick={() => setReminders(p => p.map(x => x.id === r.id ? { ...x, done: !x.done } : x))}
                          style={{ width: 19, height: 19, borderRadius: 5, border: `2px solid ${r.done ? '#34d399' : cfg.color + '80'}`, background: r.done ? '#34d399' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer', transition: 'all .2s' }}>
                          {r.done && <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round"/></svg>}
                        </div>
                        {editRemId === r.id ? (
                          <>
                            <Inp value={editRemText} onChange={setEditRemText} placeholder="" style={{ flex: 1, padding: '4px 8px', fontSize: 12 }} />
                            <button onClick={() => saveRemEdit(r.id)} style={{ ...S.btn, background: '#34d399', color: '#000', padding: '4px 10px', fontSize: 11 }}>שמור</button>
                            <button onClick={() => setEditRemId(null)} style={{ ...S.btn, background: '#1e2d4a', color: '#dde8f7', padding: '4px 10px', fontSize: 11 }}>ביטול</button>
                          </>
                        ) : (
                          <>
                            <span onClick={() => setReminders(p => p.map(x => x.id === r.id ? { ...x, done: !x.done } : x))} style={{ flex: 1, fontSize: 13, cursor: 'pointer', textDecoration: r.done ? 'line-through' : 'none' }}>{r.emoji} {r.text}</span>
                            <select value={r.priority} onChange={(e) => setReminders(p => p.map(x => x.id === r.id ? { ...x, priority: e.target.value as 'urgent' | 'medium' | 'low' } : x))}
                              style={{ ...S.inp, padding: '3px 6px', fontSize: 10, width: 70 }}>
                              <option value="urgent">דחוף</option><option value="medium">בינוני</option><option value="low">נמוך</option>
                            </select>
                            <button className="eb" onClick={() => { setEditRemId(r.id); setEditRemText(r.text); }}>✏️</button>
                            <button className="db" onClick={() => setReminders(p => p.filter(x => x.id !== r.id))}>✕</button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* PACKING LIST */}
            <div style={S.card}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 13 }}>🎒 רשימת ציוד</h2>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                <Inp value={nName} onChange={setNName} placeholder="שם הפריט..." style={{ flex: '2 1 140px' }} />
                <select value={nCat} onChange={(e) => setNCat(e.target.value)} style={{ ...S.inp, flex: '1 1 130px' }}>
                  {CATS.map(c => <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
                </select>
                <select value={nSt} onChange={(e) => setNSt(e.target.value)} style={{ ...S.inp, flex: '0 1 90px' }}>
                  <option value="have">יש לי</option><option value="buy">לקנות</option>
                </select>
                <Inp value={nImg} onChange={setNImg} placeholder="קישור תמונה (URL אופציונלי)..." style={{ flex: '2 1 180px' }} />
                <button onClick={addItem} style={{ ...S.btn, background: '#3b82f6', color: '#fff' }}>+ הוסף</button>
              </div>
              <p style={{ fontSize: 11, color: '#2d4060', marginBottom: 12 }}>💡 עם העכבר מעל פריט — תמונה תופיע משמאל</p>
              {CATS.map(cat => {
                const catItems = items.filter(i => i.cat === cat.name);
                if (!catItems.length) return null;
                const isOpen = openCats[cat.name] !== false;
                const packedN = catItems.filter(i => i.packed).length;
                return (
                  <div key={cat.name} style={{ marginBottom: 7, border: '1px solid #1a2840', borderRadius: 11 }}>
                    <button onClick={() => setOpenCats(p => ({ ...p, [cat.name]: !isOpen }))}
                      style={{ width: '100%', background: isOpen ? 'rgba(255,255,255,.02)' : 'transparent', border: 'none', cursor: 'pointer', padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 8, color: '#dde8f7', fontFamily: '"Heebo",sans-serif', borderRadius: 11 }}>
                      <span style={{ fontSize: 15 }}>{cat.emoji}</span>
                      <span style={{ flex: 1, fontWeight: 600, fontSize: 13, textAlign: 'right' }}>{cat.name}</span>
                      <span style={{ fontSize: 10, color: cat.color, background: `${cat.color}22`, padding: '2px 8px', borderRadius: 10 }}>{packedN}/{catItems.length}</span>
                      <span style={{ color: '#3d5269', fontSize: 11 }}>{isOpen ? '▲' : '▼'}</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding: '3px 5px 7px' }}>
                        {catItems.map(item => (
                          <div key={item.id}>
                            {editItemId === item.id ? (
                              <div style={{ padding: '9px 10px', borderRadius: 8, background: 'rgba(59,130,246,.05)', border: '1px solid rgba(59,130,246,.2)', marginBottom: 4 }} className="fu">
                                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
                                  <Inp value={editItemForm.name || ''} onChange={(v: string) => setEditItemForm(p => ({ ...p, name: v }))} placeholder="שם..." style={{ flex: '2 1 120px' }} />
                                  <select value={editItemForm.status || ''} onChange={(e) => setEditItemForm(p => ({ ...p, status: e.target.value }))} style={{ ...S.inp, flex: '0 1 90px' }}>
                                    <option value="have">יש לי</option><option value="buy">לקנות</option>
                                  </select>
                                </div>
                                <Inp value={editItemForm.img || ''} onChange={(v: string) => setEditItemForm(p => ({ ...p, img: v }))} placeholder="קישור תמונה..." style={{ width: '100%', marginBottom: 6 }} />
                                <div style={{ display: 'flex', gap: 5 }}>
                                  <button onClick={() => saveItemEdit(item.id)} style={{ ...S.btn, background: '#34d399', color: '#000', padding: '6px 13px' }}>שמור</button>
                                  <button onClick={() => setEditItemId(null)} style={{ ...S.btn, background: '#1e2d4a', color: '#dde8f7', padding: '6px 13px' }}>ביטול</button>
                                </div>
                              </div>
                            ) : (
                              <div className="rh item-wrap" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, transition: 'background .15s' }}>
                                {item.img && <img src={item.img} className="item-img" alt="" onError={(e: any) => { e.target.style.display = 'none'; }} />}
                                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
                                  onClick={() => togglePacked(item.id)}>
                                  {item.packed
                                    ? <div style={{ width: 19, height: 19, borderRadius: '50%', background: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 12 }}>✓</span></div>
                                    : <div style={{ width: 19, height: 19, borderRadius: '50%', border: '2px solid #1e2d4a' }} />}
                                </button>
                                <span style={{ flex: 1, fontSize: 13, color: item.packed ? '#4d6a8a' : '#dde8f7', textDecoration: item.packed ? 'line-through' : 'none' }}>
                                  {item.name}{item.optional && <span style={{ fontSize: 10, color: '#3d5269', marginRight: 4 }}>(אופציונלי)</span>}
                                </span>
                                <button onClick={() => { /* עדכון status – אם צריך Supabase, הוסף כאן */ }}
                                  style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700, background: item.status === 'have' ? 'rgba(59,130,246,.15)' : 'rgba(251,191,36,.15)', color: item.status === 'have' ? '#60a5fa' : '#fbbf24', fontFamily: '"Heebo",sans-serif', transition: 'all .2s', flexShrink: 0 }}>
                                  {item.status === 'have' ? '✓ יש לי' : '🛒 לקנות'}
                                </button>
                                <button className="eb" onClick={() => { setEditItemId(item.id); setEditItemForm({ name: item.name, status: item.status, img: item.img || '' }); }}>✏️</button>
                                <button className="db" onClick={() => deleteStoreItem(item.id)}>✕</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* RESORTS */}
            <div style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700 }}>🏔️ השוואת אתרי סקי</h2>
                <button onClick={() => setShowAddResort(!showAddResort)} style={{ ...S.btn, background: showAddResort ? '#1e2d4a' : '#3b82f6', color: '#fff', padding: '7px 14px' }}>{showAddResort ? '✕ סגור' : '+ הוסף אתר'}</button>
              </div>
              {showAddResort && (
                <div className="fu" style={{ background: 'rgba(59,130,246,.05)', border: '1px solid rgba(59,130,246,.2)', borderRadius: 11, padding: 13, marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 7 }}>
                    <Inp value={newResort.flag || ''} onChange={(v) => setNewResort(p => ({ ...p, flag: v }))} placeholder="🏔️" style={{ width: 46, padding: '8px 4px', textAlign: 'center' }} />
                    <Inp value={newResort.name || ''} onChange={(v) => setNewResort(p => ({ ...p, name: v }))} placeholder="שם האתר..." style={{ flex: '1 1 130px' }} />
                    <Inp value={newResort.country || ''} onChange={(v) => setNewResort(p => ({ ...p, country: v }))} placeholder="מדינה..." style={{ flex: '1 1 100px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 7 }}>
                    <Inp value={newResort.flight || ''} onChange={(v) => setNewResort(p => ({ ...p, flight: v }))} placeholder="מחיר טיסה (€xxx–€xxx)..." style={{ flex: '1 1 155px' }} />
                    <Inp value={newResort.pkg || ''} onChange={(v) => setNewResort(p => ({ ...p, pkg: v }))} placeholder="חבילה (€xxx לאדם)..." style={{ flex: '1 1 160px' }} />
                    <Inp value={newResort.level || ''} onChange={(v) => setNewResort(p => ({ ...p, level: v }))} placeholder="רמה..." style={{ flex: '0 1 100px' }} />
                  </div>
                  <textarea value={newResort.details || ''} onChange={(e) => setNewResort(p => ({ ...p, details: e.target.value }))} placeholder="פרטים נוספים..."
                    style={{ ...S.inp, width: '100%', minHeight: 55, marginBottom: 8 }} />
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#4d6a8a' }}>דירוג:</span>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setNewResort(p => ({ ...p, rating: n }))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: n <= (newResort.rating || 3) ? '#fbbf24' : '#1e2d4a', padding: '0 2px' }}>★</button>
                    ))}
                    <button onClick={addResort} style={{ ...S.btn, background: '#34d399', color: '#000', marginRight: 'auto' }}>✓ הוסף</button>
                  </div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10 }}>
                {resorts.map(r => (
                  <div key={r.id}>
                    {editResortId === r.id ? (
                      <div className="fu" style={{ padding: 11, border: '2px solid #3b82f6', borderRadius: 11, background: 'rgba(59,130,246,.05)' }}>
                        <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                          <Inp value={editResortForm.flag || ''} onChange={(v) => setEditResortForm(p => ({ ...p, flag: v }))} placeholder="🏔️" style={{ width: 40, padding: '6px 3px', textAlign: 'center' }} />
                          <Inp value={editResortForm.name || ''} onChange={(v) => setEditResortForm(p => ({ ...p, name: v }))} placeholder="שם..." style={{ flex: 1 }} />
                        </div>
                        <Inp value={editResortForm.country || ''} onChange={(v) => setEditResortForm(p => ({ ...p, country: v }))} placeholder="מדינה..." style={{ width: '100%', marginBottom: 4 }} />
                        <Inp value={editResortForm.flight || ''} onChange={(v) => setEditResortForm(p => ({ ...p, flight: v }))} placeholder="טיסה..." style={{ width: '100%', marginBottom: 4 }} />
                        <Inp value={editResortForm.pkg || ''} onChange={(v) => setEditResortForm(p => ({ ...p, pkg: v }))} placeholder="חבילה..." style={{ width: '100%', marginBottom: 4 }} />
                        <textarea value={editResortForm.details || ''} onChange={(e) => setEditResortForm(p => ({ ...p, details: e.target.value }))}
                          style={{ ...S.inp, width: '100%', minHeight: 48, marginBottom: 6, fontSize: 11 }} />
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => saveResortEdit(r.id)} style={{ ...S.btn, background: '#34d399', color: '#000', padding: '5px 10px', flex: 1 }}>שמור</button>
                          <button onClick={() => setEditResortId(null)} style={{ ...S.btn, background: '#1e2d4a', color: '#dde8f7', padding: '5px 8px' }}>ביטול</button>
                        </div>
                      </div>
                    ) : (
                      <div className="ch" style={{ padding: 13, borderRadius: 11, border: `2px solid ${expandedResort === r.id ? '#4db8ff' : '#1a2840'}`, background: expandedResort === r.id ? 'rgba(77,184,255,.05)' : 'transparent', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                          <span style={{ fontSize: 22 }}>{r.flag}</span>
                          <div style={{ display: 'flex', gap: 1 }}>
                            <button className="eb" onClick={(e) => { e.stopPropagation(); setEditResortId(r.id); setEditResortForm({ ...r }); }}>✏️</button>
                            <button className="db" onClick={(e) => { e.stopPropagation(); setResorts(p => p.filter(x => x.id !== r.id)); }}>✕</button>
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: '#4d6a8a', marginBottom: 5 }}>{r.country}</div>
                        <div style={{ fontSize: 11, color: '#34d399', marginBottom: 2 }}>✈️ {r.flight}</div>
                        <div style={{ fontSize: 11, color: '#fbbf24', marginBottom: 5 }}>📦 {r.pkg}</div>
                        <div style={{ fontSize: 10, color: '#4db8ff', marginBottom: 4 }}>{r.level}</div>
                        <div>{[...Array(5)].map((_, i) => <span key={i} style={{ fontSize: 11, color: i < r.rating ? '#fbbf24' : '#1e2d4a' }}>★</span>)}</div>
                        <button onClick={() => setExpandedResort(expandedResort === r.id ? null : r.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4db8ff', fontSize: 11, marginTop: 7, padding: 0, fontFamily: '"Heebo",sans-serif' }}>
                          {expandedResort === r.id ? '▲ פחות פרטים' : '▼ פרטים נוספים'}
                        </button>
                        {expandedResort === r.id && (
                          <div className="fu" style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #1a2840', fontSize: 11, color: '#7a9bbf', lineHeight: 1.65 }}>{r.details}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* INSURANCE */}
            <div style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700 }}>🛡️ השוואת ביטוחים</h2>
                  <span style={{ fontSize: 10, background: 'rgba(248,113,113,.15)', color: '#fca5a5', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>⚠️ חובה: הרחבה לספורט חורף!</span>
                </div>
                <button onClick={() => setShowAddIns(!showAddIns)} style={{ ...S.btn, background: showAddIns ? '#1e2d4a' : '#3b82f6', color: '#fff', padding: '7px 14px' }}>{showAddIns ? '✕ סגור' : '+ הוסף ביטוח'}</button>
              </div>
              {showAddIns && (
                <div className="fu" style={{ background: 'rgba(16,185,129,.05)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 11, padding: 13, marginBottom: 14 }}>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 7 }}>
                    <Inp value={newIns.logo || ''} onChange={(v) => setNewIns(p => ({ ...p, logo: v }))} placeholder="🛡️" style={{ width: 46, textAlign: 'center', padding: '8px 4px' }} />
                    <Inp value={newIns.name || ''} onChange={(v) => setNewIns(p => ({ ...p, name: v }))} placeholder="שם החברה..." style={{ flex: '1 1 130px' }} />
                    <Inp value={newIns.medical || ''} onChange={(v) => setNewIns(p => ({ ...p, medical: v }))} placeholder="כיסוי רפואי ($)..." style={{ flex: '1 1 130px' }} />
                    <Inp value={newIns.price || ''} onChange={(v) => setNewIns(p => ({ ...p, price: v }))} placeholder="מחיר..." style={{ flex: '0 1 90px' }} />
                  </div>
                  <Inp value={newIns.sports_detail || ''} onChange={(v) => setNewIns(p => ({ ...p, sports_detail: v }))} placeholder="פרטי ספורט חורף (מה כולל/לא כולל)..." style={{ width: '100%', marginBottom: 5 }} />
                  <Inp value={newIns.cancelNote || ''} onChange={(v) => setNewIns(p => ({ ...p, cancelNote: v }))} placeholder="תנאי ביטול..." style={{ width: '100%', marginBottom: 5 }} />
                  <Inp value={newIns.contact || ''} onChange={(v) => setNewIns(p => ({ ...p, contact: v }))} placeholder="איש קשר / אתר..." style={{ width: '100%', marginBottom: 5 }} />
                  <textarea value={newIns.features || ''} onChange={(e) => setNewIns(p => ({ ...p, features: e.target.value }))} placeholder="תכולה (מופרדת בפסיקים): כיסוי רפואי, פינוי ממסוק, ..."
                    style={{ ...S.inp, width: '100%', minHeight: 48, marginBottom: 8 }} />
                  <button onClick={addIns} style={{ ...S.btn, background: '#34d399', color: '#000' }}>✓ הוסף ביטוח</button>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {insurances.map(ins => (
                  <div key={ins.id}>
                    {editInsId === ins.id ? (
                      <div className="fu" style={{ padding: 13, border: '2px solid #10b981', borderRadius: 11, background: 'rgba(16,185,129,.04)' }}>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 7 }}>
                          <Inp value={editInsForm.logo || ''} onChange={(v) => setEditInsForm(p => ({ ...p, logo: v }))} style={{ width: 46, textAlign: 'center', padding: '8px 4px' }} />
                          <Inp value={editInsForm.name || ''} onChange={(v) => setEditInsForm(p => ({ ...p, name: v }))} style={{ flex: '1 1 130px' }} />
                          <Inp value={editInsForm.medical || ''} onChange={(v) => setEditInsForm(p => ({ ...p, medical: v }))} style={{ flex: '1 1 120px' }} />
                          <Inp value={editInsForm.price || ''} onChange={(v) => setEditInsForm(p => ({ ...p, price: v }))} style={{ flex: '0 1 90px' }} />
                        </div>
                        <Inp value={editInsForm.sports_detail || ''} onChange={(v) => setEditInsForm(p => ({ ...p, sports_detail: v }))} placeholder="פרטי ספורט חורף..." style={{ width: '100%', marginBottom: 5 }} />
                        <Inp value={editInsForm.cancelNote || ''} onChange={(v) => setEditInsForm(p => ({ ...p, cancelNote: v }))} placeholder="תנאי ביטול..." style={{ width: '100%', marginBottom: 5 }} />
                        <Inp value={editInsForm.contact || ''} onChange={(v) => setEditInsForm(p => ({ ...p, contact: v }))} placeholder="איש קשר..." style={{ width: '100%', marginBottom: 7 }} />
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button onClick={() => saveInsEdit(ins.id)} style={{ ...S.btn, background: '#34d399', color: '#000' }}>שמור</button>
                          <button onClick={() => setEditInsId(null)} style={{ ...S.btn, background: '#1e2d4a', color: '#dde8f7' }}>ביטול</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ border: `1px solid ${expandedIns === ins.id ? 'rgba(16,185,129,.45)' : '#1a2840'}`, borderRadius: 11, overflow: 'hidden' }}>
                        <div className="rh" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', cursor: 'pointer' }}
                          onClick={() => setExpandedIns(expandedIns === ins.id ? null : ins.id)}>
                          <span style={{ fontSize: 20, flexShrink: 0 }}>{ins.logo}</span>
                          <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{ins.name}</span>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, color: '#4db8ff' }}>{ins.medical}</span>
                            <span style={{ fontSize: 11 }}>{ins.sports === true ? '✅ ספורט' : ins.sports === false ? '❌' : `⚠️ ${ins.sports}`}</span>
                            <span style={{ fontSize: 12, color: '#34d399', fontWeight: 700 }}>{ins.price}</span>
                          </div>
                          <button className="eb" onClick={(e) => { e.stopPropagation(); setEditInsId(ins.id); setEditInsForm({ ...ins }); }}>✏️</button>
                          <button className="db" onClick={(e) => { e.stopPropagation(); setInsurances(p => p.filter(x => x.id !== ins.id)); }}>✕</button>
                          <span style={{ color: '#3d5269', fontSize: 11 }}>{expandedIns === ins.id ? '▲' : '▼'}</span>
                        </div>
                        {expandedIns === ins.id && (
                          <div className="fu" style={{ padding: '0 13px 13px', borderTop: '1px solid #1a2840' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                              <div style={{ background: 'rgba(255,255,255,.02)', borderRadius: 9, padding: 11 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#34d399', marginBottom: 7 }}>✅ תכולה</div>
                                {ins.features.map((f, i) => (
                                  <div key={i} style={{ fontSize: 12, color: '#7a9bbf', marginBottom: 3 }}>· {f}</div>
                                ))}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                <div style={{ background: 'rgba(77,184,255,.05)', borderRadius: 9, padding: 10 }}>
                                  <div style={{ fontSize: 10, fontWeight: 700, color: '#4db8ff', marginBottom: 3 }}>⛷️ ספורט חורף</div>
                                  <div style={{ fontSize: 11, color: '#7a9bbf', lineHeight: 1.6 }}>{ins.sports_detail}</div>
                                </div>
                                <div style={{ background: 'rgba(251,191,36,.05)', borderRadius: 9, padding: 10 }}>
                                  <div style={{ fontSize: 10, fontWeight: 700, color: '#fbbf24', marginBottom: 3 }}>📋 ביטול</div>
                                  <div style={{ fontSize: 11, color: '#7a9bbf' }}>{ins.cancelNote}</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,.02)', borderRadius: 9, padding: 10 }}>
                                  <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', marginBottom: 3 }}>📞 יצירת קשר</div>
                                  <div style={{ fontSize: 11, color: '#60a5fa' }}>{ins.contact}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DURING */}
        {phase === 'during' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* BUDGET */}
            <div style={{ ...S.card }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#8b5cf6,#ec4899)' }} />
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>💰 ניהול תקציב משותף</h2>
              <div style={{ display: 'flex', gap: 7, marginBottom: 14, flexWrap: 'wrap' }}>
                {PEOPLE.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#131e30', borderRadius: 20, padding: '4px 12px 4px 4px' }}>
                    <div style={{ width: 25, height: 25, borderRadius: '50%', background: PC[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{p[0]}</div>
                    <span style={{ fontSize: 12 }}>{p}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid #1a2840', borderRadius: 11, padding: 13, marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 7 }}>
                  <Inp value={expDesc} onChange={setExpDesc} placeholder="תיאור הוצאה..." style={{ flex: '2 1 150px' }} />
                  <Inp value={expAmt} onChange={setExpAmt} placeholder="סכום (€)" type="number" style={{ flex: '1 1 80px' }} />
                </div>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginBottom: 7, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: '#4d6a8a' }}>שילם:</span>
                  {PEOPLE.map((p, i) => (
                    <button key={i} onClick={() => setExpPayer(i)} style={{ padding: '3px 11px', borderRadius: 16, border: `2px solid ${expPayer === i ? PC[i] : '#1a2840'}`, background: expPayer === i ? `${PC[i]}25` : 'transparent', color: expPayer === i ? PC[i] : '#4d6a8a', cursor: 'pointer', fontSize: 11, transition: 'all .2s', fontFamily: '"Heebo",sans-serif' }}>{p}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center', marginBottom: 11, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: '#4d6a8a' }}>מחלקים:</span>
                  {PEOPLE.map((p, i) => (
                    <button key={i} onClick={() => setExpSplit(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                      style={{ padding: '3px 11px', borderRadius: 16, border: `2px solid ${expSplit.includes(i) ? '#34d399' : '#1a2840'}`, background: expSplit.includes(i) ? 'rgba(52,211,153,.15)' : 'transparent', color: expSplit.includes(i) ? '#34d399' : '#4d6a8a', cursor: 'pointer', fontSize: 11, transition: 'all .2s', fontFamily: '"Heebo",sans-serif' }}>{p}</button>
                  ))}
                </div>
                <button onClick={addExpense} style={{ ...S.btn, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', color: '#fff' }}>+ הוסף הוצאה</button>
              </div>
              {expenses.length > 0 && (
                <>
                  {expenses.map(e => (
                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderRadius: 9, background: 'rgba(255,255,255,.02)', marginBottom: 5 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{e.desc}</div>
                        <div style={{ fontSize: 10, color: '#4d6a8a', marginTop: 2 }}>שילם: <span style={{ color: PC[e.payer], fontWeight: 600 }}>{PEOPLE[e.payer]}</span> · {e.split.map((i: number) => PEOPLE[i]).join(', ')} · {e.date}</div>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#34d399' }}>€{e.amount.toFixed(2)}</div>
                      <button className="db" onClick={() => setExpenses(p => p.filter(x => x.id !== e.id))}>✕</button>
                    </div>
                  ))}
                  <div style={{ textAlign: 'left', padding: '6px 11px', fontSize: 11, color: '#4d6a8a' }}>
                    סה"כ: <span style={{ color: '#34d399', fontWeight: 700, fontSize: 15 }}>€{expenses.reduce((s, e) => s + e.amount, 0).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(115px,1fr))', gap: 8, margin: '11px 0' }}>
                    {balances.map((b, i) => (
                      <div key={i} style={{ padding: 11, borderRadius: 9, border: `1px solid ${b.balance > .01 ? 'rgba(52,211,153,.3)' : b.balance < -.01 ? 'rgba(248,113,113,.3)' : '#1a2840'}`, textAlign: 'center' }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: PC[i], margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{b.name[0]}</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: b.balance > .01 ? '#34d399' : b.balance < -.01 ? '#f87171' : '#4d6a8a' }}>{b.balance > 0 ? '+' : ''}€{b.balance.toFixed(0)}</div>
                        <div style={{ fontSize: 11, marginTop: 2 }}>{b.name}</div>
                        <div style={{ fontSize: 10, color: '#4d6a8a', marginTop: 2 }}>{b.balance > .01 ? 'מגיע לו' : b.balance < -.01 ? 'חייב' : '✅'}</div>
                      </div>
                    ))}
                  </div>
                  {settlements.length > 0 && (
                    <div style={{ background: 'rgba(139,92,246,.07)', border: '1px solid rgba(139,92,246,.28)', borderRadius: 9, padding: 11 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#a78bfa', marginBottom: 7 }}>💸 העברות לסילוק</div>
                      {settlements.map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, marginBottom: 5 }}>
                          <span style={{ color: '#f87171', fontWeight: 700 }}>{s.from}</span><span style={{ color: '#4d6a8a' }}>→</span><span style={{ color: '#34d399', fontWeight: 700 }}>{s.to}</span>
                          <span style={{ color: '#fbbf24', fontWeight: 900, marginRight: 'auto' }}>€{s.amount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {expenses.length === 0 && <div style={{ textAlign: 'center', padding: '18px 0', color: '#3d5269', fontSize: 13 }}><span style={{ fontSize: 28, display: 'block', marginBottom: 7 }}>💶</span>הוסף את ההוצאה הראשונה</div>}
            </div>

            {/* PLACES */}
            <div style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13, flexWrap: 'wrap', gap: 8 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700 }}>📍 מקומות לביקור</h2>
                <button onClick={() => setShowAddPlace(!showAddPlace)} style={{ ...S.btn, background: showAddPlace ? '#1e2d4a' : '#8b5cf6', color: '#fff', padding: '7px 14px' }}>{showAddPlace ? '✕ סגור' : '+ הוסף מקום'}</button>
              </div>
              {showAddPlace && (
                <div className="fu" style={{ background: 'rgba(139,92,246,.05)', border: '1px solid rgba(139,92,246,.2)', borderRadius: 11, padding: 13, marginBottom: 13 }}>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 7 }}>
                    <Inp value={newPlace.emoji || ''} onChange={(v) => setNewPlace(p => ({ ...p, emoji: v }))} placeholder="📍" style={{ width: 46, textAlign: 'center', padding: '8px 4px' }} />
                    <Inp value={newPlace.name || ''} onChange={(v) => setNewPlace(p => ({ ...p, name: v }))} placeholder="שם המקום..." style={{ flex: '1 1 150px' }} />
                    <select value={newPlace.type || ''} onChange={(e) => setNewPlace(p => ({ ...p, type: e.target.value }))} style={{ ...S.inp, flex: '0 1 100px' }}>
                      {['בילוי', 'אוכל', 'רלקסיישן', 'תצפית', 'קניות', 'פעילות'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <Inp value={newPlace.note || ''} onChange={(v) => setNewPlace(p => ({ ...p, note: v }))} placeholder="הערה / טיפ..." style={{ width: '100%', marginBottom: 8 }} />
                  <button onClick={addPlace} style={{ ...S.btn, background: '#8b5cf6', color: '#fff' }}>+ הוסף מקום</button>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(155px,1fr))', gap: 9 }}>
                {places.map(p => (
                  <div key={p.id}>
                    {editPlaceId === p.id ? (
                      <div className="fu" style={{ padding: 11, border: '2px solid #8b5cf6', borderRadius: 11, background: 'rgba(139,92,246,.04)' }}>
                        <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                          <Inp value={editPlaceForm.emoji || ''} onChange={(v) => setEditPlaceForm(f => ({ ...f, emoji: v }))} style={{ width: 40, textAlign: 'center', padding: '6px 3px' }} />
                          <Inp value={editPlaceForm.name || ''} onChange={(v) => setEditPlaceForm(f => ({ ...f, name: v }))} style={{ flex: 1 }} />
                        </div>
                        <Inp value={editPlaceForm.note || ''} onChange={(v) => setEditPlaceForm(f => ({ ...f, note: v }))} placeholder="הערה..." style={{ width: '100%', marginBottom: 5 }} />
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => savePlaceEdit(p.id)} style={{ ...S.btn, background: '#34d399', color: '#000', padding: '5px 11px', flex: 1 }}>שמור</button>
                          <button onClick={() => setEditPlaceId(null)} style={{ ...S.btn, background: '#1e2d4a', color: '#dde8f7', padding: '5px 9px' }}>ביטול</button>
                        </div>
                      </div>
                    ) : (
                      <div className="ch" style={{ padding: 13, borderRadius: 11, border: `1px solid ${p.visited ? 'rgba(52,211,153,.35)' : '#1a2840'}`, background: p.visited ? 'rgba(52,211,153,.04)' : 'transparent', opacity: p.visited ? 0.75 : 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 1, marginBottom: 1 }}>
                          <button className="eb" onClick={(e) => { e.stopPropagation(); setEditPlaceId(p.id); setEditPlaceForm({ ...p }); }}>✏️</button>
                          <button className="db" onClick={(e) => { e.stopPropagation(); setPlaces(prev => prev.filter(x => x.id !== p.id)); }}>✕</button>
                        </div>
                        <div style={{ fontSize: 25, marginBottom: 5 }}>{p.emoji}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, textDecoration: p.visited ? 'line-through' : 'none', color: p.visited ? '#4d6a8a' : '#dde8f7', marginBottom: 2 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: '#4db8ff', marginBottom: p.note ? 4 : 0 }}>{p.type}</div>
                        {p.note && <div style={{ fontSize: 11, color: '#4d6a8a', lineHeight: 1.5, marginBottom: 7 }}>{p.note}</div>}
                        <button onClick={() => setPlaces(prev => prev.map(x => x.id === p.id ? { ...x, visited: !x.visited } : x))}
                          style={{ ...S.btn, background: p.visited ? 'rgba(52,211,153,.18)' : 'rgba(139,92,246,.18)', color: p.visited ? '#34d399' : '#a78bfa', padding: '5px 11px', marginTop: 7, width: '100%', fontSize: 11 }}>
                          {p.visited ? '✅ ביקרנו' : '⬜ עדיין לא'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* MEDIA SYNC */}
            <div style={S.card}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>🎬 סנכרון צילומים ← מסלולים</h2>
              <p style={{ fontSize: 11, color: '#4d6a8a', marginBottom: 13 }}>קשר כל קטע וידאו למסלול/ראן — כדי שתוכל לערוך אחר כך בקלות</p>
              <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid #1a2840', borderRadius: 10, padding: 11, marginBottom: 13 }}>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  <select value={mediaDevice} onChange={(e) => setMediaDevice(e.target.value)} style={{ ...S.inp, flex: '0 1 135px' }}>
                    <option>GoPro</option><option>Garmin Venu 4</option><option>טלפון</option>
                  </select>
                  <Inp value={mediaDesc} onChange={setMediaDesc} placeholder="תיאור (ירידה ל-X, נוף, אפטר-סקי...)" style={{ flex: '2 1 155px' }} />
                  <Inp value={mediaRun} onChange={setMediaRun} placeholder="ראן / מסלול / שעה..." style={{ flex: '1 1 120px' }} />
                  <button onClick={addMedia} style={{ ...S.btn, background: '#ec4899', color: '#fff' }}>+ הוסף</button>
                </div>
              </div>
              {media.length === 0 && <div style={{ textAlign: 'center', color: '#3d5269', fontSize: 12, padding: '14px 0' }}>📭 עדיין לא הוספת קטעים</div>}
              {media.map(m => (
                <div key={m.id} style={{ marginBottom: 7 }}>
                  {editMediaId === m.id ? (
                    <div className="fu" style={{ padding: 9, border: '1px solid #ec4899', borderRadius: 9, background: 'rgba(236,72,153,.03)' }}>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
                        <select value={editMediaForm.device || ''} onChange={(e) => setEditMediaForm(p => ({ ...p, device: e.target.value }))} style={{ ...S.inp, flex: '0 1 135px' }}>
                          <option>GoPro</option><option>Garmin Venu 4</option><option>טלפון</option>
                        </select>
                        <Inp value={editMediaForm.desc || ''} onChange={(v) => setEditMediaForm(p => ({ ...p, desc: v }))} placeholder="תיאור..." style={{ flex: '2 1 150px' }} />
                        <Inp value={editMediaForm.run || ''} onChange={(v) => setEditMediaForm(p => ({ ...p, run: v }))} placeholder="מסלול / ראן..." style={{ flex: '1 1 110px' }} />
                      </div>
                      <div style={{ display: 'flex', gap: 5 }}>
                        <button onClick={() => saveMediaEdit(m.id)} style={{ ...S.btn, background: '#34d399', color: '#000', padding: '5px 12px' }}>שמור</button>
                        <button onClick={() => setEditMediaId(null)} style={{ ...S.btn, background: '#1e2d4a', color: '#dde8f7', padding: '5px 12px' }}>ביטול</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 11px', borderRadius: 9, background: 'rgba(255,255,255,.02)', border: '1px solid #1a2840' }}>
                      <span style={{ fontSize: 17, flexShrink: 0 }}>{m.device === 'GoPro' ? '📷' : m.device === 'Garmin Venu 4' ? '⌚' : '📱'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.desc}</div>
                        {m.run && <div style={{ fontSize: 11, color: '#a78bfa', marginTop: 1 }}>🎿 {m.run}</div>}
                        <div style={{ fontSize: 10, color: '#4d6a8a', marginTop: 1 }}>{m.device}</div>
                      </div>
                      <button onClick={() => setMedia(p => p.map(x => x.id === m.id ? { ...x, uploaded: !x.uploaded } : x))}
                        style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, border: `1px solid ${m.uploaded ? '#34d399' : '#1a2840'}`, background: m.uploaded ? 'rgba(52,211,153,.15)' : 'transparent', color: m.uploaded ? '#34d399' : '#4d6a8a', cursor: 'pointer', transition: 'all .2s', fontFamily: '"Heebo",sans-serif', flexShrink: 0 }}>
                        {m.uploaded ? '✅ הועלה' : '⏳ ממתין'}
                      </button>
                      <button className="eb" onClick={() => { setEditMediaId(m.id); setEditMediaForm({ device: m.device, desc: m.desc, run: m.run || '' }); }}>✏️</button>
                      <button className="db" onClick={() => setMedia(p => p.filter(x => x.id !== m.id))}>✕</button>
                    </div>
                  )}
                </div>
              ))}
              {/* Tips */}
              <div style={{ marginTop: 18, borderTop: '1px solid #1a2840', paddingTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 11 }}>💡 טיפי עריכה לפי מכשיר</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 13, flexWrap: 'wrap' }}>
                  {Object.keys(TIPS).map(d => (
                    <button key={d} onClick={() => setActiveTip(activeTip === d ? null : d)}
                      style={{ padding: '6px 15px', borderRadius: 20, border: `2px solid ${activeTip === d ? '#ec4899' : '#1a2840'}`, background: activeTip === d ? 'rgba(236,72,153,.1)' : 'transparent', color: activeTip === d ? '#ec4899' : '#4d6a8a', cursor: 'pointer', fontWeight: 600, fontSize: 12, transition: 'all .2s', fontFamily: '"Heebo",sans-serif' }}>
                      {d === 'GoPro' ? '📷 GoPro' : d === 'Garmin' ? '⌚ Garmin Venu 4' : '📱 טלפון'}
                    </button>
                  ))}
                </div>
                {activeTip && (
                  <div className="fu" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {TIPS[activeTip].map((tip, i) => (
                      <div key={i} style={{ padding: '10px 12px', borderRadius: 9, background: 'rgba(255,255,255,.02)', border: '1px solid #1a2840' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#ec4899', marginBottom: 3 }}>💡 {tip.t}</div>
                        <div style={{ fontSize: 12, color: '#7a9bbf', lineHeight: 1.65 }}>{tip.d}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AFTER */}
        {phase === 'after' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={S.card}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#ec4899,#f97316)' }} />
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>💸 סיכום כספי סופי</h2>
              {expenses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '26px 0' }}>
                  <div style={{ fontSize: 36, marginBottom: 9 }}>💶</div>
                  <div style={{ color: '#4d6a8a', fontSize: 13 }}>לא הוזנו הוצאות — עבור ל"בזמן הטיול"</div>
                </div>
              ) : (
                <>
                  <div style={{ background: 'rgba(236,72,153,.05)', border: '1px solid rgba(236,72,153,.18)', borderRadius: 11, padding: 14, marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: '#f9a8d4', fontWeight: 700, marginBottom: 5 }}>סה"כ הוצאות</div>
                    <div style={{ fontSize: 34, fontWeight: 900, color: '#fff', marginBottom: 3 }}>€{expenses.reduce((s, e) => s + e.amount, 0).toFixed(2)}</div>
                    <div style={{ fontSize: 11, color: '#4d6a8a' }}>{expenses.length} הוצאות · {PEOPLE.length} אנשים · ממוצע €{(expenses.reduce((s, e) => s + e.amount, 0) / PEOPLE.length).toFixed(2)} לאדם</div>
                  </div>
                  {settlements.length > 0 ? (
                    <>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 7 }}>העברות נדרשות:</div>
                      {settlements.map((s, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', borderRadius: 9, background: 'rgba(255,255,255,.02)', border: '1px solid #1a2840', marginBottom: 7 }}>
                          <div style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ color: '#f87171', fontWeight: 700 }}>{s.from}</span><span style={{ color: '#3d5269' }}>→</span><span style={{ color: '#34d399', fontWeight: 700 }}>{s.to}</span>
                          </div>
                          <span style={{ fontSize: 19, fontWeight: 900, color: '#fbbf24' }}>€{s.amount}</span>
                        </div>
                      ))}
                    </>
                  ) : <div style={{ textAlign: 'center', color: '#34d399', fontSize: 14, fontWeight: 700, padding: '9px 0' }}>✅ כולם מסולקים!</div>}
                </>
              )}
            </div>
            <div style={S.card}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 13 }}>📤 תוכן להעלאה</h2>
              {uploads.map(task => (
                <div key={task.id} onClick={() => setUploads(p => p.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
                  style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', borderRadius: 9, border: `1px solid ${task.done ? 'rgba(52,211,153,.28)' : '#1a2840'}`, background: task.done ? 'rgba(52,211,153,.03)' : 'transparent', cursor: 'pointer', marginBottom: 7, transition: 'all .2s', opacity: task.done ? 0.7 : 1 }}>
                  <div style={{ width: 19, height: 19, borderRadius: 5, border: `2px solid ${task.done ? '#34d399' : '#1a2840'}`, background: task.done ? '#34d399' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s' }}>
                    {task.done && <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round"/></svg>}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#4d6a8a' : '#dde8f7' }}>{task.title}</span>
                  <span style={{ fontSize: 10, background: 'rgba(77,184,255,.1)', color: '#4db8ff', padding: '3px 9px', borderRadius: 20, flexShrink: 0 }}>{task.platform}</span>
                </div>
              ))}
              {uploads.every(t => t.done) && (
                <div className="fu" style={{ marginTop: 11, textAlign: 'center', padding: '18px', background: 'rgba(52,211,153,.05)', borderRadius: 11, border: '1px solid rgba(52,211,153,.25)' }}>
                  <div style={{ fontSize: 32, marginBottom: 7 }}>🎉</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#34d399' }}>הכל הועלה! חופשת סקי מושלמת 🏔️⛷️</div>
                </div>
              )}
            </div>
            <div style={S.card}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 13 }}>🌟 סיכום הטיול</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(125px,1fr))', gap: 9 }}>
                {[
                  { l: 'פריטים נארזו', v: `${packStats.packed}/${packStats.total}`, e: '🎒' },
                  { l: 'הוצאות', v: expenses.length, e: '💶' },
                  { l: 'מקומות בוקרו', v: places.filter(p => p.visited).length, e: '📍' },
                  { l: 'קטעי צילום', v: media.length, e: '🎬' },
                  { l: 'תוכן הועלה', v: `${uploads.filter(t => t.done).length}/${uploads.length}`, e: '📤' },
                  { l: 'סה"כ', v: expenses.length ? `€${expenses.reduce((s, e) => s + e.amount, 0).toFixed(0)}` : '—', e: '💰' },
                ].map((s, i) => (
                  <div key={i} style={{ padding: 13, borderRadius: 11, background: 'rgba(255,255,255,.02)', border: '1px solid #1a2840', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{s.e}</div>
                    <div style={{ fontSize: 19, fontWeight: 900, color: '#4db8ff' }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: '#4d6a8a', marginTop: 3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}