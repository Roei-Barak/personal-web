import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import { 
  SkiItem, Reminder, Resort, Insurance, Place, Expense, MediaItem, UploadTask 
} from "../types/skiTypes";
import { 
  INIT_ITEMS, INIT_REMINDERS, INIT_RESORTS, INIT_INSURANCE, INIT_PLACES, 
  INIT_UPLOADS, CATS, PEOPLE, PC, PRIO_CFG, TIPS 
} from "../data/initialSkiData";

// --- Components ---
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
  const [phase, setPhase] = useState('before');
  const [items, setItems] = useState<SkiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbIsEmpty, setDbIsEmpty] = useState(false); // זיהוי אם צריך אתחול

  // States (Local for now)
  const [reminders, setReminders] = useState<Reminder[]>(INIT_REMINDERS);
  const [resorts, setResorts] = useState<Resort[]>(INIT_RESORTS);
  const [insurances, setInsurances] = useState<Insurance[]>(INIT_INSURANCE);
  const [places, setPlaces] = useState<Place[]>(INIT_PLACES);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploads, setUploads] = useState<UploadTask[]>(INIT_UPLOADS);
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const [activeTip, setActiveTip] = useState<string | null>(null);

  // Forms
  const [nName, setNName] = useState('');
  const [nCat, setNCat] = useState('ביגוד סקי');
  const [nSt, setNSt] = useState('have');
  const [nImg, setNImg] = useState('');
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [editItemForm, setEditItemForm] = useState<Partial<SkiItem>>({});

  // Other Add States
  const [newRemText, setNewRemText] = useState('');
  const [newRemPrio, setNewRemPrio] = useState<'urgent'|'medium'|'low'>('medium');
  const [newRemEmoji, setNewRemEmoji] = useState('📌');
  const [editRemId, setEditRemId] = useState<number | null>(null);
  const [editRemText, setEditRemText] = useState('');
  
  const [showAddResort, setShowAddResort] = useState(false);
  const [newResort, setNewResort] = useState<Partial<Resort>>({});
  const [editResortId, setEditResortId] = useState<number|null>(null);
  const [editResortForm, setEditResortForm] = useState<Partial<Resort>>({});

  const [showAddIns, setShowAddIns] = useState(false);
  const [newIns, setNewIns] = useState<any>({});
  const [editInsId, setEditInsId] = useState<number|null>(null);
  const [editInsForm, setEditInsForm] = useState<Partial<Insurance>>({});

  const [showAddPlace, setShowAddPlace] = useState(false);
  const [newPlace, setNewPlace] = useState<Partial<Place>>({});
  const [editPlaceId, setEditPlaceId] = useState<number|null>(null);
  const [editPlaceForm, setEditPlaceForm] = useState<Partial<Place>>({});

  const [expDesc, setExpDesc] = useState('');
  const [expAmt, setExpAmt] = useState('');
  const [expPayer, setExpPayer] = useState(0);
  const [expSplit, setExpSplit] = useState([0,1,2,3]);

  const [mediaDevice, setMediaDevice] = useState('GoPro');
  const [mediaDesc, setMediaDesc] = useState('');
  const [mediaRun, setMediaRun] = useState('');
  const [editMediaId, setEditMediaId] = useState<number|null>(null);
  const [editMediaForm, setEditMediaForm] = useState<Partial<MediaItem>>({});

  // --- SUPABASE LOGIC ---

  // 1. קריאת נתונים (Fetch)
  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ski_items')
      .select('*')
      .order('id', { ascending: true }); // סידור לפי ID כדי למנוע קפיצות

    if (error) {
      console.error("❌ Error fetching:", error);
    } else {
      if (data && data.length > 0) {
        setItems(data as SkiItem[]);
        setDbIsEmpty(false);
      } else {
        // אם אין נתונים בשרת, נציג INIT_ITEMS מקומית ונסמן שה-DB ריק
        setItems(INIT_ITEMS); 
        setDbIsEmpty(true);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // --- פונקציית אתחול DB (Seeding) ---
  const initializeDB = async () => {
    if (!confirm("האם אתה בטוח שברצונך לאתחל את המסד נתונים עם הרשימה הראשונית?")) return;
    
    setLoading(true);
    console.log("🚀 Initializing DB...");

    // מכינים את המידע ללא ה-ID (השרת ייצר אותו)
    const itemsToInsert = INIT_ITEMS.map(({ id, ...rest }) => rest);

    const { error } = await supabase
      .from('ski_items')
      .insert(itemsToInsert);

    if (error) {
      console.error("❌ Init Error:", error);
      alert("שגיאה באתחול: " + error.message);
    } else {
      console.log("✅ DB Initialized!");
      fetchItems(); // טעינה מחדש כדי לקבל את הנתונים עם ה-IDs האמיתיים
    }
    setLoading(false);
  };

  // 2. הוספת פריט (Add)
  const addItem = async () => {
    if (!nName.trim()) return;
    
    const newItem = {
      name: nName,
      cat: nCat,
      status: nSt,
      packed: false,
      optional: false,
      img: nImg || ''
    };

    const { data, error } = await supabase
      .from('ski_items')
      .insert([newItem])
      .select();

    if (error) {
      console.error("❌ Error adding:", error);
    } else if (data) {
      setItems(prev => [...prev, data[0] as SkiItem]);
      setNName('');
      setNImg('');
    }
  };

  // 3. עדכון פריט (Update Packed)
  const togglePacked = async (id: number, currentPacked: boolean) => {
    // עדכון אופטימי
    setItems(prev => prev.map(i => i.id === id ? { ...i, packed: !currentPacked } : i));

    const { error } = await supabase
      .from('ski_items')
      .update({ packed: !currentPacked })
      .eq('id', id);

    if (error) {
      console.error("❌ Error updating:", error);
      setItems(prev => prev.map(i => i.id === id ? { ...i, packed: currentPacked } : i)); // Revert
    }
  };

  // 4. מחיקת פריט (Delete)
  const deleteItem = async (id: number) => {
    const prevItems = [...items];
    setItems(prev => prev.filter(i => i.id !== id));

    const { error } = await supabase
      .from('ski_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("❌ Error deleting:", error);
      setItems(prevItems);
    }
  };

  // --- Helpers ---
  const packStats = useMemo(() => {
    const total = items.length;
    const packed = items.filter(i => i.packed).length;
    const toBuy = items.filter(i => i.status === 'buy').length;
    return { total, packed, toBuy, pct: total ? Math.round(packed / total * 100) : 0 };
  }, [items]);

  // Local handlers
  const saveItemEdit = (id: number) => { setItems(p => p.map(i => i.id === id ? { ...i, ...editItemForm } : i)); setEditItemId(null); };
  const addReminder = () => { if(newRemText) setReminders(p=>[...p, {id:Date.now(), text:newRemText, done:false, priority:newRemPrio, emoji:newRemEmoji}]); setNewRemText(''); };
  const saveRemEdit = (id: number) => { setReminders(p => p.map(r => r.id === id ? { ...r, text: editRemText } : r)); setEditRemId(null); };
  const addResort = () => { setResorts(p=>[...p, {...newResort, id:Date.now()} as Resort]); setShowAddResort(false); };
  const saveResortEdit = (id: number) => { setResorts(p => p.map(r => r.id === id ? { ...r, ...editResortForm } : r)); setEditResortId(null); };
  const addIns = () => { setInsurances(p=>[...p, {...newIns, id:Date.now(), features:[]} as Insurance]); setShowAddIns(false); };
  const saveInsEdit = (id: number) => { setInsurances(p => p.map(i => i.id === id ? { ...i, ...editInsForm } : i)); setEditInsId(null); };
  const addPlace = () => { setPlaces(p=>[...p, {...newPlace, id:Date.now(), visited:false} as Place]); setShowAddPlace(false); };
  const savePlaceEdit = (id: number) => { setPlaces(p => p.map(x => x.id === id ? { ...x, ...editPlaceForm } : x)); setEditPlaceId(null); };
  const addExpense = () => { if(expAmt) setExpenses(p=>[...p, {id:Date.now(), desc:expDesc, amount:parseFloat(expAmt), payer:expPayer, split:expSplit, date:new Date().toLocaleDateString()}]); };
  const addMedia = () => { if(mediaDesc) setMedia(p=>[...p, {id:Date.now(), device:mediaDevice, desc:mediaDesc, run:mediaRun, uploaded:false}]); };
  const saveMediaEdit = (id: number) => { setMedia(p => p.map(m => m.id === id ? { ...m, ...editMediaForm } : m)); setEditMediaId(null); };

  return (
    <div style={{ background: 'linear-gradient(170deg,#060910 0%,#0a1220 100%)', minHeight: '100vh', fontFamily: '"Heebo",sans-serif', direction: 'rtl', color: '#dde8f7' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#080b14}::-webkit-scrollbar-thumb{background:#1e2d4a;border-radius:3px}
        .rh{transition:background .15s}.rh:hover{background:rgba(77,184,255,.05)!important}
        .ch{transition:all .2s;cursor:pointer}.ch:hover{border-color:rgba(77,184,255,.4)!important;transform:translateY(-2px)}
        .eb{background:none;border:none;cursor:pointer;color:#2d4060;transition:color .15s;font-size:13px;padding:2px 4px;font-family:inherit} .eb:hover{color:#60a5fa}
        .db{background:none;border:none;cursor:pointer;color:#2d4060;transition:color .15s;font-size:13px;padding:2px 4px;font-family:inherit} .db:hover{color:#f87171}
        input:focus,select:focus,textarea:focus{outline:none;border-color:#3b82f6!important} input::placeholder,textarea::placeholder{color:#2a3c55}
        @keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} .fu{animation:fu .2s ease}
        textarea{font-family:"Heebo",sans-serif;resize:vertical} .item-wrap{position:relative} .item-wrap:hover .item-img{opacity:1}
        .item-img{position:absolute;top:50%;transform:translateY(-50%);right:100%;margin-right:8px;width:80px;height:80px;border-radius:10px;object-fit:cover;border:2px solid #1e2d4a;opacity:0;pointer-events:none;transition:opacity .18s;z-index:200;background:#080d18;box-shadow:0 8px 24px rgba(0,0,0,.6)}
      `}</style>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg,#0b1528,#0e1f3a,#0b1528)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '26px 20px 54px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 34 }}>⛷️</span>
          <div>
            <h1 style={{ fontSize: 27, fontWeight: 900, color:'#fff' }}>Ski Trip Manager</h1>
            <p style={{ color: '#4d7aaa', fontSize: 12, marginTop: 3 }}>
              {loading ? '🔄 מסנכרן...' : dbIsEmpty ? '⚠️ מצב מקומי (DB ריק)' : '✅ מחובר לענן'}
            </p>
          </div>
          {/* כפתור אתחול - מופיע רק אם ה-DB ריק */}
          {dbIsEmpty && !loading && (
            <button 
              onClick={initializeDB}
              style={{ marginRight: 'auto', background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}
            >
              🚀 אתחל נתונים לענן
            </button>
          )}
        </div>
      </div>

      {/* TABS */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(6,9,16,.95)', borderBottom: '1px solid #1a2840' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex' }}>
          {[{ key:'before',label:'לפני הטיול',emoji:'📋',color:'#3b82f6'},{ key:'during',label:'בזמן הטיול',emoji:'🏔️',color:'#8b5cf6'},{ key:'after',label:'אחרי הטיול',emoji:'🎬',color:'#ec4899'}].map(p => (
            <button key={p.key} onClick={() => setPhase(p.key)} style={{ flex:1,padding:'12px 10px',background:'none',border:'none',cursor:'pointer',color:phase===p.key?p.color:'#4d6a8a',fontWeight:phase===p.key?700:500,fontSize:12,fontFamily:'"Heebo",sans-serif',borderBottom:`2px solid ${phase===p.key?p.color:'transparent'}`,transition:'all .2s' } as React.CSSProperties}>
              <span style={{ display:'block',fontSize:19,marginBottom:2 }}>{p.emoji}</span>{p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '26px 20px 60px' }} className="fu">
        {phase === 'before' && (
          <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
            
            {/* PACKING LIST */}
            <div style={S.card as React.CSSProperties}>
              <h2 style={{ fontSize:15,fontWeight:700,marginBottom:13 }}>🎒 רשימת ציוד</h2>
              
              <div style={{ display:'flex',gap:6,marginBottom:10,flexWrap:'wrap' }}>
                <Inp value={nName} onChange={setNName} placeholder="שם הפריט..." style={{ flex:'2 1 140px' }} />
                <select value={nCat} onChange={e=>setNCat(e.target.value)} style={{ ...S.inp,flex:'1 1 130px' } as React.CSSProperties}>
                  {CATS.map(c=><option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
                </select>
                <select value={nSt} onChange={e=>setNSt(e.target.value)} style={{ ...S.inp,flex:'0 1 90px' } as React.CSSProperties}>
                  <option value="have">יש לי</option><option value="buy">לקנות</option>
                </select>
                <button onClick={addItem} disabled={loading} style={{ ...S.btn,background: loading ? '#555' : '#3b82f6',color:'#fff' } as React.CSSProperties}>
                  {loading ? '...' : '+ הוסף'}
                </button>
              </div>

              {CATS.map(cat => {
                const catItems = items.filter(i => i.cat === cat.name);
                if (!catItems.length) return null;
                const isOpen = openCats[cat.name] !== false;
                const packedN = catItems.filter(i=>i.packed).length;
                
                return (
                  <div key={cat.name} style={{ marginBottom:7,border:'1px solid #1a2840',borderRadius:11 }}>
                    <button onClick={()=>setOpenCats(p=>({...p,[cat.name]:!isOpen}))}
                      style={{ width:'100%',background:isOpen?'rgba(255,255,255,.02)':'transparent',border:'none',cursor:'pointer',padding:'10px 13px',display:'flex',alignItems:'center',gap:8,color:'#dde8f7',fontFamily:'"Heebo",sans-serif',borderRadius:11 } as React.CSSProperties}>
                      <span style={{ fontSize:15 }}>{cat.emoji}</span>
                      <span style={{ flex:1,fontWeight:600,fontSize:13,textAlign:'right' }}>{cat.name}</span>
                      <span style={{ fontSize:10,color:cat.color,background:`${cat.color}22`,padding:'2px 8px',borderRadius:10 }}>{packedN}/{catItems.length}</span>
                      <span style={{ color:'#3d5269',fontSize:11 }}>{isOpen?'▲':'▼'}</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding:'3px 5px 7px' }}>
                        {catItems.map(item => (
                          <div key={item.id} className="rh item-wrap" style={{ display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:8,transition:'background .15s' } as React.CSSProperties}>
                            {item.img && <img src={item.img} className="item-img" alt="" onError={(e: any)=>{e.target.style.display='none';}} />}
                            
                            <button style={{ background:'none',border:'none',cursor:'pointer',padding:0,flexShrink:0 }}
                              onClick={()=>togglePacked(item.id, item.packed)}>
                              {item.packed
                                ? <div style={{ width:19,height:19,borderRadius:'50%',background:'#34d399',display:'flex',alignItems:'center',justifyContent:'center' }}><span style={{fontSize:12}}>✓</span></div>
                                : <div style={{ width:19,height:19,borderRadius:'50%',border:'2px solid #1e2d4a' }} />}
                            </button>
                            
                            <span style={{ flex:1,fontSize:13,color:item.packed?'#4d6a8a':'#dde8f7',textDecoration:item.packed?'line-through':'none' }}>
                              {item.name}{item.optional&&<span style={{ fontSize:10,color:'#3d5269',marginRight:4 }}>(אופציונלי)</span>}
                            </span>
                            
                            <button className="db" onClick={()=>deleteItem(item.id)} style={{ marginLeft: 10 }}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* אפשר להוסיף כאן את שאר החלקים כמו שעשית בקוד הקודם, כרגע התמקדנו ברשימת הציוד */}
            <div style={S.card as React.CSSProperties}>
               <h3 style={{fontSize:14, color:'#4d6a8a', textAlign:'center'}}>... שאר הדשבורד (תקציב, ביטוח) יופיע כאן ...</h3>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}