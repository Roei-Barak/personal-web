import { useState, useMemo, CSSProperties, useEffect, useRef } from "react";
import L from "leaflet";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface PackItem {
  id: number;
  cat: string;
  name: string;
  status: 'have' | 'buy';
  packed: boolean;
  optional: boolean;
  img: string;
}
interface Reminder {
  id: number;
  text: string;
  done: boolean;
  priority: 'urgent' | 'medium' | 'low';
  emoji: string;
}
interface Resort {
  id: number;
  name: string;
  flag: string;
  country: string;
  flight: string;
  pkg: string;
  level: string;
  rating: number;
  details: string;
  lat?: number;
  lng?: number;
  airport?: string;
  airportCode?: string;
  airportLat?: number;
  airportLng?: number;
}
interface Insurance {
  id: number;
  name: string;
  logo: string;
  medical: string;
  sports: boolean | string;
  cancel: boolean | string;
  cancelNote: string;
  price: string;
  features: string[];
  sports_detail: string;
  contact: string;
}
interface Place {
  id: number;
  name: string;
  type: string;
  visited: boolean;
  emoji: string;
  note: string;
}
interface Expense {
  id: number;
  desc: string;
  amount: number;
  payer: number;
  split: number[];
  date: string;
}
interface MediaItem {
  id: number;
  device: string;
  desc: string;
  run: string;
  uploaded: boolean;
}
interface UploadTask {
  id: number;
  title: string;
  done: boolean;
  platform: string;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const INIT_ITEMS: PackItem[] = [
  { id: 1,  cat: 'ביגוד סקי',           name: 'חולצה תרמית (בסיס)',                  status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=300&h=300&fit=crop' },
  { id: 2,  cat: 'ביגוד סקי',           name: 'מכנס תרמי / גטקס',                   status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&h=300&fit=crop' },
  { id: 3,  cat: 'ביגוד סקי',           name: 'מיקרו-פליז / סווטשירט',              status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=300&fit=crop' },
  { id: 4,  cat: 'ביגוד סקי',           name: 'מעיל סקי (עמיד למים)',                status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1551698618-1fed5d978028?w=300&h=300&fit=crop' },
  { id: 5,  cat: 'ביגוד סקי',           name: 'מכנסי סקי (עמידים למים)',             status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=300&h=300&fit=crop' },
  { id: 6,  cat: 'ביגוד סקי',           name: 'גרבי סקי ארוכות (5 זוגות)',          status: 'buy',  packed: false, optional: false, img: 'https://images.unsplash.com/photo-1582309801060-d51357b9e8f5?w=300&h=300&fit=crop' },
  { id: 7,  cat: 'ביגוד סקי',           name: 'כפפות סקי Touch',                    status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1544923246-77307dd654ca?w=300&h=300&fit=crop' },
  { id: 8,  cat: 'ביגוד סקי',           name: 'כפפות ליינר Touch',                   status: 'buy',  packed: false, optional: false, img: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=300&h=300&fit=crop' },
  { id: 9,  cat: 'ביגוד סקי',           name: 'כפפות מחממות עם סוללות',              status: 'buy',  packed: false, optional: true,  img: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=300&h=300&fit=crop' },
  { id: 10, cat: 'ביגוד סקי',           name: 'צעיף באף BUFF',                       status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1610486801905-2d4e3bc31062?w=300&h=300&fit=crop' },
  { id: 11, cat: 'ציוד גלישה',          name: 'קסדה',                                status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=300&h=300&fit=crop' },
  { id: 12, cat: 'ציוד גלישה',          name: 'גוגלס (משקפי סקי)',                   status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1526827251190-3944697b0033?w=300&h=300&fit=crop' },
  { id: 13, cat: 'ציוד גלישה',          name: 'מגלשיים / בורד',                      status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1551698618-1fed5d978028?w=300&h=300&fit=crop' },
  { id: 14, cat: 'ציוד גלישה',          name: 'מחזיק לברך / תומך ברך',               status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1597040660350-02f623098553?w=300&h=300&fit=crop' },
  { id: 15, cat: 'ערב ומלון',           name: 'נעלי הליכה בשלג (ייעודיות)',          status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop' },
  { id: 16, cat: 'ערב ומלון',           name: 'בגד ים וכפכפים (ספא)',                status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1559004065-175aa1368b63?w=300&h=300&fit=crop' },
  { id: 17, cat: 'ערב ומלון',           name: "בגדים נוחים / ג'ינסים",              status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=300&h=300&fit=crop' },
  { id: 18, cat: 'ערב ומלון',           name: "פיג'מה",                              status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?w=300&h=300&fit=crop' },
  { id: 19, cat: 'פארם והיגיינה',        name: 'קרם הגנה לפנים SPF 50+',             status: 'buy',  packed: false, optional: false, img: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300&h=300&fit=crop' },
  { id: 20, cat: 'פארם והיגיינה',        name: 'שפתון הגנה',                          status: 'buy',  packed: false, optional: false, img: 'https://images.unsplash.com/photo-1617462441994-08f3226a273b?w=300&h=300&fit=crop' },
  { id: 21, cat: 'פארם והיגיינה',        name: 'משחת אובליפיכה',                      status: 'buy',  packed: false, optional: false, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop' },
  { id: 22, cat: 'פארם והיגיינה',        name: 'מגבוני אובליפיכה',                    status: 'buy',  packed: false, optional: false, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop' },
  { id: 23, cat: 'פארם והיגיינה',        name: 'משחת בן גיי (שרירים)',                status: 'buy',  packed: false, optional: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' },
  { id: 24, cat: 'פארם והיגיינה',        name: 'משכי כאבים ותרופות',                  status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' },
  { id: 25, cat: 'פארם והיגיינה',        name: 'היגיינה (מברשת/שמפו/דאודורנט)',       status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=300&h=300&fit=crop' },
  { id: 26, cat: 'מסמכים ואלקטרוניקה', name: 'דרכון (תוקף 6+ חודשים)',              status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=300&fit=crop' },
  { id: 27, cat: 'מסמכים ואלקטרוניקה', name: 'ביטוח נסיעות + הרחבה ספורט חורף',    status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop' },
  { id: 28, cat: 'מסמכים ואלקטרוניקה', name: 'מטען נייד (Power Bank)',               status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1609091839697-eb211ff66842?w=300&h=300&fit=crop' },
  { id: 29, cat: 'מסמכים ואלקטרוניקה', name: 'מתאם לשקע חשמל',                      status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=300&h=300&fit=crop' },
  { id: 30, cat: 'מסמכים ואלקטרוניקה', name: 'כרטיס אשראי + מזומן',                status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=300&h=300&fit=crop' },
  { id: 31, cat: 'שומרי מסורת',         name: 'תפילין, טלית וציצית',                 status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1515658323406-25d61c141a6e?w=300&h=300&fit=crop' },
  { id: 32, cat: 'שומרי מסורת',         name: 'סידור / ספרי קודש',                   status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1544648630-36655c697841?w=300&h=300&fit=crop' },
  { id: 33, cat: 'שומרי מסורת',         name: 'אוכל כשר (שימורים/מנות חמות)',        status: 'buy',  packed: false, optional: false, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=300&fit=crop' },
  { id: 34, cat: 'שומרי מסורת',         name: 'נרות שבת, הבדלה ויין לקידוש',        status: 'buy',  packed: false, optional: false, img: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=300&h=300&fit=crop' },
];

const INIT_REMINDERS: Reminder[] = [
  { id: 1,  text: 'הזמן כרטיסי טיסה',                    done: false, priority: 'urgent', emoji: '✈️' },
  { id: 2,  text: 'הזמן מלון / Airbnb',                   done: false, priority: 'urgent', emoji: '🏨' },
  { id: 3,  text: 'קנה ביטוח נסיעות + ספורט חורף',       done: false, priority: 'urgent', emoji: '🛡️' },
  { id: 4,  text: 'רכוש Ski Pass לאתר הנבחר',             done: false, priority: 'medium', emoji: '⛷️' },
  { id: 5,  text: 'הזמן שכירת ציוד (מגלשיים/נעליים)',    done: false, priority: 'medium', emoji: '🎿' },
  { id: 6,  text: 'הכן כסף מזומן במטבע מקומי',           done: false, priority: 'medium', emoji: '💶' },
  { id: 7,  text: 'הורד מפות אופליין (Google Maps)',      done: false, priority: 'low',    emoji: '🗺️' },
  { id: 8,  text: 'בדוק זמינות GoPro + SD + סוללות',     done: false, priority: 'low',    emoji: '📷' },
  { id: 9,  text: 'הכן אוכל כשר לנסיעה',                 done: false, priority: 'medium', emoji: '🥘' },
  { id: 10, text: 'הכן נרות שבת, הבדלה ויין',            done: false, priority: 'low',    emoji: '🕯️' },
];

const INIT_RESORTS: Resort[] = [
  { id: 1, name: 'Zermatt',     flag: '🇨🇭', country: 'שווייץ',   flight: '€280–€420', pkg: '€1,800–€2,800 לאדם', level: 'כל הרמות',      rating: 5, details: 'גובה 3,883מ׳. עונה ארוכה עד מאי. מטרהורן אייקוני. מסועי כבל מהמודרניים בעולם. Apres-ski מעולה. אין מכוניות בכפר.', lat: 46.0207, lng: 7.7491, airport: 'Zurich', airportCode: 'ZRH', airportLat: 47.4582, airportLng: 8.5516 },
  { id: 2, name: 'Kitzbühel',   flag: '🇦🇹', country: 'אוסטריה',  flight: '€180–€290', pkg: '€1,200–€2,000 לאדם', level: 'בינוני–מתקדם', rating: 4, details: 'אחד מאתרי הסקי הנחשבים בעולם. Hahnenkamm Race. אחרי-סקי אגדי. עיירה מימי הביניים.', lat: 47.4650, lng: 12.3917, airport: 'Innsbruck', airportCode: 'INN', airportLat: 47.2612, airportLng: 11.3944 },
  { id: 3, name: 'Val Thorens', flag: '🇫🇷', country: 'צרפת',     flight: '€160–€260', pkg: '€1,100–€1,900 לאדם', level: 'כל הרמות',      rating: 5, details: 'הגבוה באלפים (2,300מ׳). חלק מ-3 Vallées. שלג מובטח. מסועי גונדולה מהמהירים.', lat: 45.3131, lng: 6.5997, airport: 'Lyon', airportCode: 'LYS', airportLat: 45.7263, airportLng: 5.0886 },
  { id: 4, name: 'Livigno',     flag: '🇮🇹', country: 'איטליה',   flight: '€150–€240', pkg: '€900–€1,500 לאדם',  level: 'כל הרמות',      rating: 4, details: 'Duty Free – קניות זולות! ידידותי לכשרות יחסית. אווירה איטלקית נינוחה.', lat: 46.5534, lng: 10.1270, airport: 'Milan Malpensa', airportCode: 'MXP', airportLat: 45.6306, airportLng: 8.7236 },
  { id: 5, name: 'Bansko',      flag: '🇧🇬', country: 'בולגריה',  flight: '€100–€180', pkg: '€500–€900 לאדם',    level: 'מתחילים',        rating: 3, details: 'הכי זול באירופה! מסועי כבל חדשים (2023). מסלולים בינוניים. עיירת מורשת יפה.', lat: 41.8425, lng: 23.5131, airport: 'Sofia', airportCode: 'SOF', airportLat: 42.6977, airportLng: 23.4116 },
  { id: 6, name: 'Jasná',       flag: '🇸🇰', country: 'סלובקיה',  flight: '€130–€210', pkg: '€700–€1,200 לאדם',  level: 'בינוני',          rating: 3, details: 'האתר הגדול ביותר בסלובקיה. מחירים טובים. שלג טוב בינואר–מרץ.', lat: 48.9539, lng: 19.1467, airport: 'Košice', airportCode: 'KSC', airportLat: 48.6709, airportLng: 21.2263 },
];

const INIT_INSURANCE: Insurance[] = [
  { id: 1, name: 'כלל ביטוח',    logo: '🛡️', medical: '$100,000', sports: true,     cancel: true,    cancelNote: 'ביטול עד 72 שעות', price: '~₪180',       features: ['כיסוי רפואי מלא','פינוי ממסוק','הרחבה לסקי/סנובורד','ביטול טיסה','אובדן כבודה $1,500','עיכוב טיסה'], sports_detail: 'כולל: סקי, סנובורד, פרפר. לא כולל: Off-Piste ללא מדריך.', contact: '*2066 | kll.co.il' },
  { id: 2, name: 'הפניקס',       logo: '🔥', medical: '$150,000', sports: true,     cancel: true,    cancelNote: 'ביטול עד 48 שעות', price: '~₪220',       features: ['כיסוי רפואי $150K','פינוי אוויר','הרחבה ספורט חורף כלולה','ביטול עד 48שע','אובדן כבודה $2,000','אחריות כלפי שלישי'], sports_detail: 'כולל: סקי, סנובורד, Telemark. Off-Piste מותר!', contact: '*6262 | phoenix.co.il' },
  { id: 3, name: 'Chubb/מנורה',  logo: '💎', medical: '$250,000', sports: 'תוספת', cancel: 'חלקי', cancelNote: 'ביטול מחלה בלבד',   price: '~₪350',       features: ['כיסוי רפואי $250K','הרחבה ספורט בתוספת','ביטול מחלה בלבד','אובדן כבודה $3,000','אחריות כלפי שלישי $1M'], sports_detail: 'ספורט חורף בתוספת: +₪80. כולל Off-Piste ו-Helicopter Skiing.', contact: 'chubb.com/il' },
  { id: 4, name: 'World Nomads', logo: '🌍', medical: '$100,000', sports: true,     cancel: true,    cancelNote: 'גמיש',              price: '~$30/שבוע', features: ['כיסוי רפואי $100K','ספורט חורף כלול','ביטול גמיש','גנבת ציוד ספורט','Adventure Sports Package'], sports_detail: 'הכי גמיש. כולל Off-Piste, סקי מחוץ לתחומים מוסדרים.', contact: 'worldnomads.com' },
];

const INIT_PLACES: Place[] = [
  { id: 1, name: 'כפר האפטר-סקי המרכזי',  type: 'בילוי',     visited: false, emoji: '🏔️', note: 'מוזיקה, בירה ואווירה אחרי הגלישה' },
  { id: 2, name: 'בר/קפה על שיפוע Ski-in', type: 'אוכל',      visited: false, emoji: '☕', note: 'לצהריים על המסלול' },
  { id: 3, name: "ספא / ג'קוזי במלון",    type: 'רלקסיישן',  visited: false, emoji: '🛁', note: 'לכל יום אחרי גלישה' },
  { id: 4, name: 'גונדולה לפסגה',           type: 'תצפית',     visited: false, emoji: '🚡', note: 'שקיעה מהפסגה = בלתי נשכחת' },
  { id: 5, name: 'שוק / עיר מקומית',        type: 'קניות',     visited: false, emoji: '🛍️', note: 'ביום ללא גלישה' },
  { id: 6, name: 'מסלול ביסלון / טיובינג',  type: 'פעילות',    visited: false, emoji: '🛷', note: 'כיף לכולם גם ללא גלישה' },
];

const INIT_UPLOADS: UploadTask[] = [
  { id: 1, title: 'GoPro: Highlight מגלישות מגניבות',   done: false, platform: 'Instagram / TikTok' },
  { id: 2, title: 'GoPro: וידאו מלא מהיום הטוב ביותר',  done: false, platform: 'YouTube' },
  { id: 3, title: 'Garmin: ייצוא מסלולים ל-Strava',     done: false, platform: 'Strava' },
  { id: 4, title: 'טלפון: אלבום תמונות משותף',           done: false, platform: 'Google Photos' },
  { id: 5, title: 'Reels / TikTok מהחופשה',              done: false, platform: 'Instagram / TikTok' },
  { id: 6, title: 'גיבוי כל הקבצים לענן',                done: false, platform: 'Google Drive / iCloud' },
];

const CATS = [
  { name: 'ביגוד סקי',           emoji: '🧥', color: '#3b82f6' },
  { name: 'ציוד גלישה',          emoji: '⛷️', color: '#6366f1' },
  { name: 'ערב ומלון',           emoji: '🏨', color: '#f97316' },
  { name: 'פארם והיגיינה',        emoji: '💊', color: '#ec4899' },
  { name: 'מסמכים ואלקטרוניקה', emoji: '📋', color: '#10b981' },
  { name: 'שומרי מסורת',         emoji: '✡️', color: '#f59e0b' },
];

const TIPS: Record<string, { t: string; d: string }[]> = {
  GoPro: [
    { t: '4K / 60fps לגלישה',   d: 'בגלישה מהירה, 60fps מונע blur ומאפשר Slow Motion ×2. עבור ל-Protune לשליטה מלאה.' },
    { t: 'TimeWarp בגונדולה',    d: 'TimeWarp 2.0 במהירות Auto – מושלם לנסיעות ארוכות בגונדולה ובאוטובוס.' },
    { t: 'HiLight Tagging',      d: 'לחץ כפתור HiLight בזמן גלישה מגניבה – מסמן נקודה לעריכה מהירה אחר כך.' },
    { t: 'Color: Flat',          d: 'בהגדרות Protune בחר Color: Flat – צבעים שטוחים לגמישות בעריכה.' },
    { t: 'CapCut / DaVinci',     d: 'CapCut למהיר בנייד. DaVinci Resolve בחינם למחשב עם LUTs לסקי.' },
    { t: 'סוללה בקור',           d: 'בקור קיצוני הסוללה מתרוקנת מהר – שמור על GoPro בתוך הכיס בין גלישות.' },
  ],
  Garmin: [
    { t: 'GPS Track & Export',   d: 'Garmin Venu 4 עוקב GPS – ייצוא GPX מ-Garmin Connect ועשה Overlay על וידאו.' },
    { t: 'Garmin Connect',       d: 'ראה מהירות מקסימלית, גובה ו-elevation gain מכל יום גלישה.' },
    { t: 'Strava Sync',          d: 'סנכרן עם Strava לראות השוואה עם אחרים ולשתף הישגים.' },
    { t: 'Body Battery',         d: 'עקוב אחרי Body Battery – אם ממש נמוך (מתחת ל-30) יום מנוחה מומלץ.' },
  ],
  Phone: [
    { t: 'Snapseed לתמונות',    d: 'Snapseed: HDR + Tune Image = תמונות הר מדהימות בפחות מדקה.' },
    { t: 'Google Photos Backup', d: 'הפעל גיבוי אוטומטי – חבר WiFi של המלון בלילה.' },
    { t: 'Reels עם Transition',  d: 'חתוך בתזמון עם מוזיקה, השתמש ב-Transition בין שוטים שונים.' },
    { t: 'שמור על הטלפון חם',   d: 'הסוללה מתרוקנת מהר בקור – שמור טלפון בכיס פנימי ב-PowerBank.' },
  ],
};

const PEOPLE = ['אבי', 'דני', 'יוסי', 'שרה'];
const PC = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];
const PRIO_CFG: Record<string, { label: string; color: string }> = {
  urgent: { label: 'דחוף',  color: '#f87171' },
  medium: { label: 'בינוני', color: '#fbbf24' },
  low:    { label: 'נמוך',  color: '#60a5fa' },
};

// ─── STYLE HELPERS ────────────────────────────────────────────────────────────
const S = {
  card: { background: 'linear-gradient(135deg, rgba(15,22,35,0.8) 0%, rgba(14,31,58,0.6) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(77,184,255,0.15)', borderRadius: 16, padding: 22, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', position: 'relative' as const } as CSSProperties,
  inp:  { background: 'rgba(8,13,24,0.7)', border: '1px solid rgba(77,184,255,0.2)', borderRadius: 10, padding: '11px 15px', color: '#dde8f7', fontSize: 13, fontFamily: '"Heebo", sans-serif', boxSizing: 'border-box' as const, transition: 'all 0.3s ease', backdropFilter: 'blur(10px)', fontWeight: 500, letterSpacing: '0.3px' } as CSSProperties,
  btn:  { border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: '"Heebo", sans-serif', transition: 'all 0.3s ease', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' } as CSSProperties,
};

// ─── INP COMPONENT ────────────────────────────────────────────────────────────
interface InpProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: CSSProperties;
  type?: string;
}
function Inp({ value, onChange, placeholder, style, type }: InpProps) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      type={type ?? 'text'}
      style={{ ...S.inp, ...style }}
    />
  );
}

// ─── MAP COMPONENT ────────────────────────────────────────────────────────────
interface MapProps {
  resorts: Resort[];
}
function ResortMap({ resorts }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([47, 10], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
      }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add resort and airport markers
    resorts.forEach(r => {
      if (r.lat && r.lng) {
        // Resort marker
        const resortMarker = L.marker([r.lat, r.lng], {
          icon: L.divIcon({
            className: 'resort-marker',
            html: `<div style="background:#3b82f6;color:white;padding:6px 10px;borderRadius:20px;fontWeight:bold;fontSize:12px;whiteSpace:nowrap;boxShadow:0 2px 8px rgba(0,0,0,0.3)">${r.flag} ${r.name}</div>`,
            iconSize: [120, 30],
          }),
        }).bindPopup(`
          <div style="fontFamily:Heebo;fontSize:12px;maxWidth:200px">
            <strong>${r.flag} ${r.name}</strong><br/>
            🏔️ ${r.level}<br/>
            ⭐ ${r.rating}/5<br/>
            ✈️ ${r.flight}<br/>
            📦 ${r.pkg}
          </div>
        `);
        map.addLayer(resortMarker);
      }

      // Airport marker
      if (r.airportLat && r.airportLng) {
        const airportMarker = L.marker([r.airportLat, r.airportLng], {
          icon: L.divIcon({
            className: 'airport-marker',
            html: `<div style="background:#f59e0b;color:white;padding:4px 8px;borderRadius:4px;fontWeight:bold;fontSize:10px">✈️ ${r.airportCode}</div>`,
            iconSize: [80, 24],
          }),
        }).bindPopup(`
          <div style="fontFamily:Heebo;fontSize:12px">
            <strong>✈️ ${r.airport}</strong><br/>
            נמל אוויר קרוב ל-${r.name}
          </div>
        `);
        map.addLayer(airportMarker);
      }
    });
  }, [resorts]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '500px',
        borderRadius: 12,
        border: '1px solid #1e2d4a',
        overflow: 'hidden',
      }}
    />
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SkiDashboard() {
  const [phase, setPhase] = useState<'before' | 'during' | 'after'>('before');

  const [items,      setItems]      = useState<PackItem[]>(INIT_ITEMS);
  const [reminders,  setReminders]  = useState<Reminder[]>(INIT_REMINDERS);
  const [resorts,    setResorts]    = useState<Resort[]>(INIT_RESORTS);
  const [insurances, setInsurances] = useState<Insurance[]>(INIT_INSURANCE);
  const [places,     setPlaces]     = useState<Place[]>(INIT_PLACES);
  const [expenses,   setExpenses]   = useState<Expense[]>([]);
  const [media,      setMedia]      = useState<MediaItem[]>([]);
  const [uploads,    setUploads]    = useState<UploadTask[]>(INIT_UPLOADS);
  const [openCats,   setOpenCats]   = useState<Record<string, boolean>>({});
  const [activeTip,  setActiveTip]  = useState<string | null>(null);

  // item add/edit
  const [nName, setNName] = useState(''); const [nCat, setNCat] = useState('ביגוד סקי'); const [nSt, setNSt] = useState<'have'|'buy'>('have'); const [nImg, setNImg] = useState('');
  const [editItemId, setEditItemId] = useState<number|null>(null); const [editItemForm, setEditItemForm] = useState<Partial<PackItem>>({});

  // reminder add/edit
  const [newRemText, setNewRemText] = useState(''); const [newRemPrio, setNewRemPrio] = useState<'urgent'|'medium'|'low'>('medium'); const [newRemEmoji, setNewRemEmoji] = useState('📌');
  const [editRemId,  setEditRemId]  = useState<number|null>(null); const [editRemText, setEditRemText] = useState('');

  // resort add/edit
  const [expandedResort, setExpandedResort] = useState<number|null>(null);
  const [editResortId,   setEditResortId]   = useState<number|null>(null);
  const [editResortForm, setEditResortForm] = useState<Partial<Resort>>({});
  const [showAddResort,  setShowAddResort]  = useState(false);
  const [newResort,      setNewResort]      = useState<Omit<Resort,'id'>>({ name:'', flag:'🏔️', country:'', flight:'', pkg:'', level:'כל הרמות', rating:3, details:'' });

  // insurance add/edit
  const [expandedIns, setExpandedIns] = useState<number|null>(null);
  const [editInsId,   setEditInsId]   = useState<number|null>(null);
  const [editInsForm, setEditInsForm] = useState<Partial<Insurance>>({});
  const [showAddIns,  setShowAddIns]  = useState(false);
  const [newInsFeatures, setNewInsFeatures] = useState('');
  const [newIns, setNewIns] = useState<Omit<Insurance,'id'|'features'>>({ name:'', logo:'🛡️', medical:'', sports:true, cancel:true, cancelNote:'', price:'', sports_detail:'', contact:'' });

  // places add/edit
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [newPlace,     setNewPlace]     = useState<Omit<Place,'id'|'visited'>>({ name:'', type:'בילוי', emoji:'📍', note:'' });
  const [editPlaceId,  setEditPlaceId]  = useState<number|null>(null);
  const [editPlaceForm,setEditPlaceForm]= useState<Partial<Place>>({});

  // budget
  const [expDesc, setExpDesc] = useState(''); const [expAmt, setExpAmt] = useState('');
  const [expPayer, setExpPayer] = useState(0); const [expSplit, setExpSplit] = useState<number[]>([0,1,2,3]);

  // media
  const [mediaDevice, setMediaDevice] = useState('GoPro'); const [mediaDesc, setMediaDesc] = useState(''); const [mediaRun, setMediaRun] = useState('');
  const [editMediaId, setEditMediaId] = useState<number|null>(null); const [editMediaForm, setEditMediaForm] = useState<Partial<MediaItem>>({});

  // ─── computed ───
  const packStats = useMemo(() => {
    const total = items.length, packed = items.filter(i => i.packed).length, toBuy = items.filter(i => i.status === 'buy').length;
    return { total, packed, toBuy, pct: total ? Math.round(packed/total*100) : 0 };
  }, [items]);

  const balances = useMemo(() => {
    const t = PEOPLE.map(() => ({ paid: 0, share: 0 }));
    expenses.forEach(e => { t[e.payer].paid += e.amount; e.split.forEach(p => { t[p].share += e.amount / e.split.length; }); });
    return PEOPLE.map((name, i) => ({ name, balance: t[i].paid - t[i].share }));
  }, [expenses]);

  const settlements = useMemo(() => {
    const result: { from: string; to: string; amount: number }[] = [];
    const neg = balances.filter(b => b.balance < -0.01).map(b => ({ ...b, rem: -b.balance }));
    const pos = balances.filter(b => b.balance > 0.01).map(b => ({ ...b, rem: b.balance }));
    let ni = 0, pi = 0;
    while (ni < neg.length && pi < pos.length) {
      const amt = Math.min(neg[ni].rem, pos[pi].rem);
      if (amt > 0.01) result.push({ from: neg[ni].name, to: pos[pi].name, amount: Math.round(amt*100)/100 });
      neg[ni].rem -= amt; pos[pi].rem -= amt;
      if (neg[ni].rem < 0.01) ni++; if (pos[pi].rem < 0.01) pi++;
    }
    return result;
  }, [balances]);

  // ─── helpers ───
  const addItem = () => {
    if (!nName.trim()) return;
    setItems(p => [...p, { id: Date.now(), cat: nCat, name: nName, status: nSt, packed: false, optional: false, img: nImg || 'https://images.unsplash.com/photo-1551698618-1fed5d978028?w=300&h=300&fit=crop' }]);
    setNName(''); setNImg('');
  };
  const saveItemEdit = (id: number) => { setItems(p => p.map(i => i.id === id ? { ...i, ...editItemForm } : i)); setEditItemId(null); };

  const addReminder = () => { if (!newRemText.trim()) return; setReminders(p => [...p, { id: Date.now(), text: newRemText, done: false, priority: newRemPrio, emoji: newRemEmoji }]); setNewRemText(''); };
  const saveRemEdit  = (id: number) => { setReminders(p => p.map(r => r.id === id ? { ...r, text: editRemText } : r)); setEditRemId(null); };

  const addResort    = () => { setResorts(p => [...p, { ...newResort, id: Date.now() }]); setNewResort({ name:'', flag:'🏔️', country:'', flight:'', pkg:'', level:'כל הרמות', rating:3, details:'' }); setShowAddResort(false); };
  const saveResortEdit=(id:number)=>{ setResorts(p=>p.map(r=>r.id===id?{...r,...editResortForm}:r)); setEditResortId(null); };

  const addIns = () => { setInsurances(p => [...p, { ...newIns, id: Date.now(), features: newInsFeatures.split(',').map(s=>s.trim()).filter(Boolean) }]); setShowAddIns(false); setNewInsFeatures(''); setNewIns({ name:'',logo:'🛡️',medical:'',sports:true,cancel:true,cancelNote:'',price:'',sports_detail:'',contact:'' }); };
  const saveInsEdit=(id:number)=>{ setInsurances(p=>p.map(i=>i.id===id?{...i,...editInsForm}:i)); setEditInsId(null); };

  const addPlace    = () => { if (!newPlace.name.trim()) return; setPlaces(p => [...p, { ...newPlace, id: Date.now(), visited: false }]); setShowAddPlace(false); setNewPlace({ name:'', type:'בילוי', emoji:'📍', note:'' }); };
  const savePlaceEdit=(id:number)=>{ setPlaces(p=>p.map(x=>x.id===id?{...x,...editPlaceForm}:x)); setEditPlaceId(null); };

  const addExpense = () => {
    if (!expDesc.trim() || !expAmt || !expSplit.length) return;
    setExpenses(p => [...p, { id: Date.now(), desc: expDesc, amount: parseFloat(expAmt), payer: expPayer, split: [...expSplit], date: new Date().toLocaleDateString('he-IL') }]);
    setExpDesc(''); setExpAmt('');
  };
  const addMedia = () => {
    if (!mediaDesc.trim()) return;
    setMedia(p => [...p, { id: Date.now(), device: mediaDevice, desc: mediaDesc, run: mediaRun, uploaded: false }]);
    setMediaDesc(''); setMediaRun('');
  };
  const saveMediaEdit=(id:number)=>{ setMedia(p=>p.map(m=>m.id===id?{...m,...editMediaForm}:m)); setEditMediaId(null); };

  // ─── render ───
  return (
    <div style={{ background:'linear-gradient(170deg,#060910 0%,#0a1220 50%,#060910 100%)', minHeight:'100vh', fontFamily:'"Heebo",sans-serif', direction:'rtl', color:'#dde8f7', position:'relative' }}>
      {/* Background effects */}
      <div style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'radial-gradient(ellipse at 20% 50%, rgba(59,130,246,.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(139,92,246,.04) 0%, transparent 50%)', pointerEvents:'none', zIndex:0 }} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css');
        *{box-sizing:border-box;margin:0;padding:0;scroll-behavior:smooth}
        body{font-family:"Heebo",sans-serif}
        ::-webkit-scrollbar{width:8px}::-webkit-scrollbar-track{background:rgba(8,13,24,0.4)}::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#3b82f6,#8b5cf6);border-radius:4px}::-webkit-scrollbar-thumb:hover{background:linear-gradient(180deg,#60a5fa,#a78bfa)}
        .rh{transition:all 0.2s ease}.rh:hover{background:rgba(77,184,255,.08)!important;transform:translateX(-3px)}
        .ch{transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer}.ch:hover{border-color:rgba(77,184,255,.5)!important;transform:translateY(-4px);box-shadow:0 12px 32px rgba(59,130,246,.15)!important}
        .eb{background:none;border:none;cursor:pointer;color:#2d4060;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);font-size:13px;padding:6px 12px;font-family:inherit;border-radius:6px;fontWeight:600;letter-spacing:0.3px}.eb:hover{color:#60a5fa;background:linear-gradient(135deg, rgba(96,165,250, 0.15), rgba(77,184,255, 0.1));border:1px solid rgba(96,165,250, 0.3);box-shadow:0 4px 12px rgba(60,165,250,.15);transform:translateY(-1px)}
        .db{background:none;border:none;cursor:pointer;color:#2d4060;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);font-size:13px;padding:6px 12px;font-family:inherit;border-radius:6px;fontWeight:600;letter-spacing:0.3px}.db:hover{color:#f87171;background:linear-gradient(135deg, rgba(248,113,113, 0.15), rgba(239,68,68, 0.1));border:1px solid rgba(248,113,113, 0.3);box-shadow:0 4px 12px rgba(248,113,113,.15);transform:translateY(-1px)}
        input:focus,select:focus,textarea:focus{outline:none;border-color:#4db8ff!important;background:linear-gradient(135deg, rgba(6,8,16,0.9), rgba(8,13,24,0.85))!important;box-shadow:0 0 0 3px rgba(77,184,255,.15), 0 0 20px rgba(77,184,255,.1)!important;backdrop-filter:blur(10px)!important}
        input::placeholder,textarea::placeholder{color:#3a4d63;font-weight:400;letter-spacing:0.2px}
        @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes slideIn{from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.8}}
        .fu{animation:fu 0.3s cubic-bezier(0.34,1.56,0.64,1)}
        textarea{font-family:"Heebo",sans-serif;resize:vertical}textarea:focus{border-color:#4db8ff!important}
        .item-wrap{position:relative}
        .item-img{position:absolute;top:50%;transform:translateY(-50%);right:100%;margin-right:8px;width:80px;height:80px;border-radius:12px;object-fit:cover;border:2px solid rgba(77,184,255,.3);opacity:0;pointer-events:none;transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);z-index:200;background:linear-gradient(135deg,#080d18,#0f1623);box-shadow:0 12px 40px rgba(0,0,0,.5)}
        .item-wrap:hover .item-img{opacity:1;transform:translateY(-50%) scale(1.05)}
        select{cursor:pointer;transition:all 0.2s}
        button{transition:all 0.2s ease}button:hover{transform:translateY(-1px)}button:active{transform:translateY(0)}
        .leaflet-popup-content{font-family:"Heebo",sans-serif!important}
      `}</style>

      {/* HEADER */}
      <div style={{ background:'linear-gradient(135deg, #0b1528 0%, #0e1f3a 50%, #081620 100%)', position:'relative', overflow:'hidden', boxShadow:'0 20px 60px rgba(59,130,246,.1)', zIndex:2 }}>
        <svg style={{ position:'absolute', bottom:0, left:0, width:'100%', opacity:.6 }} height="60" viewBox="0 0 1400 60" preserveAspectRatio="none">
          <path d="M0,60 L0,40 L200,10 L480,28 L720,5 L1000,22 L1260,10 L1400,18 L1400,60Z" fill="rgba(77,184,255,.1)"/>
          <path d="M0,60 L0,48 L260,22 L510,42 L770,18 L1040,35 L1300,22 L1400,15 L1400,60Z" fill="rgba(77,184,255,.06)"/>
          <path d="M0,60 L0,50 L300,30 L600,45 L900,25 L1100,40 L1400,30 L1400,60Z" fill="rgba(139,92,246,.04)"/>
        </svg>
        <div style={{ maxWidth:960, margin:'0 auto', padding:'32px 20px 60px', display:'flex', alignItems:'center', gap:16, position:'relative', zIndex:1 }}>
          <span style={{ fontSize:40, filter:'drop-shadow(0 4px 12px rgba(0,0,0,.3))' }}>⛷️</span>
          <div>
            <h1 style={{ fontSize:32, fontWeight:900, background:'linear-gradient(135deg, #fff 0%, #60a5fa 50%, #4db8ff 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'-0.5px', marginBottom:4 }}>Ski Trip Manager</h1>
            <p style={{ color:'#4d7aaa', fontSize:13, marginTop:2, fontWeight:500, letterSpacing:'0.5px' }}>מהכנות ועד זיכרונות — הכל במקום אחד 🏔️</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(6,9,16,.92)', backdropFilter:'blur(25px)', borderBottom:'1px solid rgba(77,184,255,.1)', boxShadow:'0 8px 32px rgba(0,0,0,.3)' }}>
        <div style={{ maxWidth:960, margin:'0 auto', display:'flex' }}>
          {([
            { key:'before' as const, label:'לפני הטיול', emoji:'📋', color:'#3b82f6' },
            { key:'during' as const, label:'בזמן הטיול', emoji:'🏔️', color:'#8b5cf6' },
            { key:'after'  as const, label:'אחרי הטיול', emoji:'🎬', color:'#ec4899' },
          ]).map(p => (
            <button key={p.key} onClick={() => setPhase(p.key)}
              style={{ flex:1, padding:'14px 10px', background:'none', border:'none', cursor:'pointer', color:phase===p.key?'#fff':phase===p.key?p.color:'#4d6a8a', fontWeight:phase===p.key?700:500, fontSize:13, fontFamily:'"Heebo",sans-serif', borderBottom:`3px solid ${phase===p.key?p.color:'transparent'}`, position:'relative', transition:'all 0.3s ease', textShadow:phase===p.key?`0 0 20px ${p.color}40`:'none' }}>
              <span style={{ display:'block', fontSize:20, marginBottom:3 }}>{p.emoji}</span>{p.label}
              {phase === p.key && <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:3, background:p.color, borderRadius:'0 0 6px 6px', boxShadow:`0 0 20px ${p.color}` }} />}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:960, margin:'0 auto', padding:'28px 20px 60px', background:'linear-gradient(180deg, transparent 0%, rgba(139,92,246,.02) 50%, transparent 100%)', position:'relative', zIndex:1 }} className="fu">

        {/* ════ BEFORE ════ */}
        {phase === 'before' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* Progress */}
            <div style={{ ...S.card, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:4, background:'linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)', boxShadow:'0 0 20px rgba(59,130,246,.3)' }} />
              <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:10, marginBottom:16 }}>
                <div>
                  <h2 style={{ fontSize:16, fontWeight:700, color:'#fff' }}>📊 סטטוס אריזה</h2>
                  <p style={{ color:'#4d6a8a', fontSize:12, marginTop:3 }}>{packStats.packed} מתוך {packStats.total} פריטים נארזו</p>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  {([{l:'נארז',v:packStats.packed,c:'#34d399'},{l:'לקנות',v:packStats.toBuy,c:'#fbbf24'},{l:'סה"כ',v:packStats.total,c:'#4db8ff'}] as const).map(s=>(
                    <div key={s.l} style={{ textAlign:'center', background:s.c+'15', padding:'8px 14px', borderRadius:10, border:`1px solid ${s.c}40`, backdropFilter:'blur(10px)' }}>
                      <div style={{ fontSize:22, fontWeight:900, color:s.c }}>{s.v}</div>
                      <div style={{ fontSize:11, color:'#4d6a8a', marginTop:2, fontWeight:600 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ height:10, background:'rgba(255,255,255,.05)', borderRadius:6, overflow:'hidden', border:'1px solid rgba(77,184,255,.1)' }}>
                <div style={{ height:'100%', width:`${packStats.pct}%`, background:'linear-gradient(90deg,#3b82f6,#34d399,#10b981)', borderRadius:6, transition:'width 1.2s cubic-bezier(0.34,1.56,0.64,1)', boxShadow:'0 0 30px rgba(52,211,153,.3)' }} />
              </div>
              <div style={{ textAlign:'left', marginTop:6, fontSize:12, fontWeight:700, background:'linear-gradient(135deg, #4db8ff, #34d399)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{packStats.pct}% סיום</div>
            </div>

            {/* REMINDERS */}
            <div style={S.card}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:13, flexWrap:'wrap', gap:8 }}>
                <h2 style={{ fontSize:15, fontWeight:700 }}>🔔 תזכורות ומשימות</h2>
                <span style={{ fontSize:11, color:'#3d5269' }}>לחץ לסימון · ✏️ לעריכה · שנה עדיפות ברשימה</span>
              </div>
              <div style={{ background:'rgba(255,255,255,.02)', border:'1px solid #1a2840', borderRadius:10, padding:11, marginBottom:13 }}>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  <Inp value={newRemEmoji} onChange={setNewRemEmoji} placeholder="😀" style={{ width:46, textAlign:'center', padding:'8px 4px' }} />
                  <Inp value={newRemText} onChange={setNewRemText} placeholder="תזכורת חדשה..." style={{ flex:'1 1 160px' as unknown as undefined }} />
                  <select value={newRemPrio} onChange={e=>setNewRemPrio(e.target.value as 'urgent'|'medium'|'low')} style={{ ...S.inp, width:90 }}>
                    <option value="urgent">דחוף</option><option value="medium">בינוני</option><option value="low">נמוך</option>
                  </select>
                  <button onClick={addReminder} style={{ ...S.btn, background:'linear-gradient(135deg, #3b82f6, #60a5fa)', color:'#fff', boxShadow:'0 6px 20px rgba(59,130,246,.25)', position:'relative', overflow:'hidden' }}>
                    <span style={{ position:'relative', zIndex:1 }}>+ הוסף</span>
                  </button>
                </div>
              </div>
              {(['urgent','medium','low'] as const).map(prio => {
                const grp = reminders.filter(r => r.priority === prio);
                if (!grp.length) return null;
                const cfg = PRIO_CFG[prio];
                return (
                  <div key={prio} style={{ marginBottom:12 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:cfg.color, textTransform:'uppercase', letterSpacing:.5, marginBottom:5, display:'flex', alignItems:'center', gap:5 }}>
                      <span style={{ width:6, height:6, borderRadius:'50%', background:cfg.color, display:'inline-block' }} />{cfg.label}
                    </div>
                    {grp.map(r => (
                      <div key={r.id} className="rh" style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:8, marginBottom:4, border:'1px solid rgba(255,255,255,.02)', opacity:r.done ? .45 : 1 }}>
                        <div onClick={() => setReminders(p => p.map(x => x.id===r.id ? {...x, done:!x.done} : x))}
                          style={{ width:19, height:19, borderRadius:5, border:`2px solid ${r.done?'#34d399':cfg.color+'80'}`, background:r.done?'#34d399':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'pointer', transition:'all .2s' }}>
                          {r.done && <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round"/></svg>}
                        </div>
                        {editRemId === r.id ? (
                          <>
                            <Inp value={editRemText} onChange={setEditRemText} style={{ flex:'1 1 auto' as unknown as undefined, padding:'4px 8px', fontSize:12 }} />
                            <button onClick={()=>saveRemEdit(r.id)} style={{ ...S.btn, background:'linear-gradient(135deg,#34d399,#10b981)', color:'#000', padding:'4px 10px', fontSize:11, boxShadow:'0 6px 20px rgba(16,185,129,.18)' }}>שמור</button>
                            <button onClick={()=>setEditRemId(null)} style={{ ...S.btn, background:'rgba(30,45,74,0.6)', color:'#dde8f7', padding:'4px 10px', fontSize:11 }}>ביטול</button>
                          </>
                        ) : (
                          <>
                            <span onClick={() => setReminders(p => p.map(x => x.id===r.id ? {...x, done:!x.done} : x))}
                              style={{ flex:1, fontSize:13, cursor:'pointer', textDecoration:r.done?'line-through':'none' }}>{r.emoji} {r.text}</span>
                            <select value={r.priority} onChange={e => setReminders(p => p.map(x => x.id===r.id ? {...x, priority:e.target.value as Reminder['priority']} : x))}
                              style={{ ...S.inp, padding:'3px 6px', fontSize:10, width:70 }}>
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
              <h2 style={{ fontSize:15, fontWeight:700, marginBottom:13 }}>🎒 רשימת ציוד</h2>
              <div style={{ display:'flex', gap:6, marginBottom:10, flexWrap:'wrap' }}>
                <Inp value={nName} onChange={setNName} placeholder="שם הפריט..." style={{ flex:'2 1 140px' as unknown as undefined }} />
                <select value={nCat} onChange={e=>setNCat(e.target.value)} style={{ ...S.inp, flex:'1 1 130px' as unknown as undefined }}>
                  {CATS.map(c => <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
                </select>
                <select value={nSt} onChange={e=>setNSt(e.target.value as 'have'|'buy')} style={{ ...S.inp, flex:'0 1 90px' as unknown as undefined }}>
                  <option value="have">יש לי</option><option value="buy">לקנות</option>
                </select>
                <Inp value={nImg} onChange={setNImg} placeholder="קישור תמונה (URL)..." style={{ flex:'2 1 180px' as unknown as undefined }} />
                <button onClick={addItem} style={{ ...S.btn, background:'linear-gradient(135deg, #3b82f6, #60a5fa)', color:'#fff', boxShadow:'0 6px 20px rgba(59,130,246,.25)' }}>+ הוסף</button>
              </div>
              <p style={{ fontSize:11, color:'#2d4060', marginBottom:12 }}>💡 עם העכבר מעל פריט — תמונה תופיע משמאל</p>
              {CATS.map(cat => {
                const catItems = items.filter(i => i.cat === cat.name);
                if (!catItems.length) return null;
                const isOpen = openCats[cat.name] !== false;
                const packedN = catItems.filter(i => i.packed).length;
                return (
                  <div key={cat.name} style={{ marginBottom:7, border:'1px solid #1a2840', borderRadius:11 }}>
                    <button onClick={() => setOpenCats(p => ({...p, [cat.name]:!isOpen}))}
                      style={{ width:'100%', background:isOpen?'rgba(255,255,255,.02)':'transparent', border:'none', cursor:'pointer', padding:'10px 13px', display:'flex', alignItems:'center', gap:8, color:'#dde8f7', fontFamily:'"Heebo",sans-serif', borderRadius:11 }}>
                      <span style={{ fontSize:15 }}>{cat.emoji}</span>
                      <span style={{ flex:1, fontWeight:600, fontSize:13, textAlign:'right' }}>{cat.name}</span>
                      <span style={{ fontSize:10, color:cat.color, background:`${cat.color}22`, padding:'2px 8px', borderRadius:10 }}>{packedN}/{catItems.length}</span>
                      <span style={{ color:'#3d5269', fontSize:11 }}>{isOpen ? '▲' : '▼'}</span>
                    </button>
                    {isOpen && (
                      <div style={{ padding:'3px 5px 7px' }}>
                        {catItems.map(item => (
                          <div key={item.id}>
                            {editItemId === item.id ? (
                              <div style={{ padding:'9px 10px', borderRadius:8, background:'rgba(59,130,246,.05)', border:'1px solid rgba(59,130,246,.2)', marginBottom:4 }} className="fu">
                                <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:6 }}>
                                  <Inp value={editItemForm.name ?? ''} onChange={v => setEditItemForm(p => ({...p, name:v}))} placeholder="שם..." style={{ flex:'2 1 120px' as unknown as undefined }} />
                                  <select value={editItemForm.status ?? 'have'} onChange={e => setEditItemForm(p => ({...p, status:e.target.value as 'have'|'buy'}))} style={{ ...S.inp, flex:'0 1 90px' as unknown as undefined }}>
                                    <option value="have">יש לי</option><option value="buy">לקנות</option>
                                  </select>
                                </div>
                                <Inp value={editItemForm.img ?? ''} onChange={v => setEditItemForm(p => ({...p, img:v}))} placeholder="קישור תמונה..." style={{ width:'100%', marginBottom:6 }} />
                                <div style={{ display:'flex', gap:5 }}>
                                  <button onClick={() => saveItemEdit(item.id)} style={{ ...S.btn, background:'linear-gradient(135deg,#34d399,#10b981)', color:'#000', padding:'6px 13px', boxShadow:'0 6px 20px rgba(16,185,129,.12)' }}>שמור</button>
                                  <button onClick={() => setEditItemId(null)} style={{ ...S.btn, background:'rgba(30,45,74,0.6)', color:'#dde8f7', padding:'6px 13px' }}>ביטול</button>
                                </div>
                              </div>
                            ) : (
                              <div className="rh item-wrap" style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 10px', borderRadius:8, transition:'background .15s' }}>
                                {item.img && <img src={item.img} className="item-img" alt="" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />}
                                <button style={{ background:'none', border:'none', cursor:'pointer', padding:0, flexShrink:0 }}
                                  onClick={() => setItems(p => p.map(i => i.id===item.id ? {...i, packed:!i.packed} : i))}>
                                  {item.packed
                                    ? <div style={{ width:19, height:19, borderRadius:'50%', background:'#34d399', display:'flex', alignItems:'center', justifyContent:'center' }}><svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round"/></svg></div>
                                    : <div style={{ width:19, height:19, borderRadius:'50%', border:'2px solid #1e2d4a' }} />}
                                </button>
                                <span style={{ flex:1, fontSize:13, color:item.packed?'#4d6a8a':'#dde8f7', textDecoration:item.packed?'line-through':'none' }}>
                                  {item.name}{item.optional && <span style={{ fontSize:10, color:'#3d5269', marginRight:4 }}>(אופציונלי)</span>}
                                </span>
                                <button onClick={() => setItems(p => p.map(i => i.id===item.id ? {...i, status:i.status==='have'?'buy':'have'} : i))}
                                  style={{ fontSize:10, padding:'2px 8px', borderRadius:20, border:'none', cursor:'pointer', fontWeight:700, background:item.status==='have'?'rgba(59,130,246,.15)':'rgba(251,191,36,.15)', color:item.status==='have'?'#60a5fa':'#fbbf24', fontFamily:'"Heebo",sans-serif', transition:'all .2s', flexShrink:0 }}>
                                  {item.status==='have' ? '✓ יש לי' : '🛒 לקנות'}
                                </button>
                                <button className="eb" onClick={() => { setEditItemId(item.id); setEditItemForm({ name:item.name, status:item.status, img:item.img }); }}>✏️</button>
                                <button className="db" onClick={() => setItems(p => p.filter(i => i.id !== item.id))}>✕</button>
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

            {/* MAP - RESORTS & AIRPORTS */}
            <div style={S.card}>
              <h2 style={{ fontSize:15, fontWeight:700, marginBottom:12 }}>🗺️ מפה: אתרי סקי ונמלי אוויר</h2>
              <ResortMap resorts={resorts} />
              <p style={{ fontSize:11, color:'#4d6a8a', marginTop:12 }}>
                🔵 נקודות כחולות = אתרי סקי | 🟠 נקודות כתומות = נמלי אוויר קרובים. לחץ על סמן כדי לראות פרטים
              </p>
            </div>

            {/* RESORTS */}
            <div style={S.card}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, flexWrap:'wrap', gap:8 }}>
                <h2 style={{ fontSize:15, fontWeight:700 }}>🏔️ השוואת אתרי סקי</h2>
                <button onClick={() => setShowAddResort(v => !v)} style={{ ...S.btn, background:showAddResort?'rgba(255,100,100,0.12)':'linear-gradient(135deg,#3b82f6,#60a5fa)', color:showAddResort?'#ff6464':'#fff', padding:'8px 16px', fontSize:12, boxShadow:showAddResort?'none':'0 6px 20px rgba(59,130,246,.25)' }}>{showAddResort?'✕ סגור':'+ הוסף אתר'}</button>
              </div>
              {showAddResort && (
                <div className="fu" style={{ background:'rgba(59,130,246,.05)', border:'1px solid rgba(59,130,246,.2)', borderRadius:11, padding:13, marginBottom:14 }}>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:7 }}>
                    <Inp value={newResort.flag} onChange={v => setNewResort(p => ({...p, flag:v}))} placeholder="🏔️" style={{ width:46, padding:'8px 4px', textAlign:'center' }} />
                    <Inp value={newResort.name} onChange={v => setNewResort(p => ({...p, name:v}))} placeholder="שם האתר..." style={{ flex:'1 1 130px' as unknown as undefined }} />
                    <Inp value={newResort.country} onChange={v => setNewResort(p => ({...p, country:v}))} placeholder="מדינה..." style={{ flex:'1 1 100px' as unknown as undefined }} />
                  </div>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:7 }}>
                    <Inp value={newResort.flight} onChange={v => setNewResort(p => ({...p, flight:v}))} placeholder="מחיר טיסה..." style={{ flex:'1 1 155px' as unknown as undefined }} />
                    <Inp value={newResort.pkg} onChange={v => setNewResort(p => ({...p, pkg:v}))} placeholder="חבילה (€xxx לאדם)..." style={{ flex:'1 1 160px' as unknown as undefined }} />
                    <Inp value={newResort.level} onChange={v => setNewResort(p => ({...p, level:v}))} placeholder="רמה..." style={{ flex:'0 1 100px' as unknown as undefined }} />
                  </div>
                  <textarea value={newResort.details} onChange={e => setNewResort(p => ({...p, details:e.target.value}))} placeholder="פרטים נוספים..."
                    style={{ ...S.inp, width:'100%', minHeight:55, marginBottom:8 }} />
                  <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                    <span style={{ fontSize:12, color:'#4d6a8a' }}>דירוג:</span>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setNewResort(p => ({...p, rating:n}))} style={{ background:'none', border:'none', cursor:'pointer', fontSize:15, color:n<=newResort.rating?'#fbbf24':'#1e2d4a', padding:'0 2px' }}>★</button>
                    ))}
                    <button onClick={addResort} style={{ ...S.btn, background:'linear-gradient(135deg,#34d399,#10b981)', color:'#000', marginRight:'auto', boxShadow:'0 6px 20px rgba(16,185,129,.12)' }}>✓ הוסף</button>
                  </div>
                </div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:10 }}>
                {resorts.map(r => (
                  <div key={r.id}>
                    {editResortId === r.id ? (
                      <div className="fu" style={{ padding:11, border:'2px solid #3b82f6', borderRadius:11, background:'rgba(59,130,246,.05)' }}>
                        <div style={{ display:'flex', gap:4, marginBottom:5 }}>
                          <Inp value={editResortForm.flag ?? ''} onChange={v => setEditResortForm(p => ({...p, flag:v}))} style={{ width:40, padding:'6px 3px', textAlign:'center' }} />
                          <Inp value={editResortForm.name ?? ''} onChange={v => setEditResortForm(p => ({...p, name:v}))} style={{ flex:'1 1 auto' as unknown as undefined }} />
                        </div>
                        <Inp value={editResortForm.country ?? ''} onChange={v => setEditResortForm(p => ({...p, country:v}))} placeholder="מדינה..." style={{ width:'100%', marginBottom:4 }} />
                        <Inp value={editResortForm.flight ?? ''} onChange={v => setEditResortForm(p => ({...p, flight:v}))} placeholder="טיסה..." style={{ width:'100%', marginBottom:4 }} />
                        <Inp value={editResortForm.pkg ?? ''} onChange={v => setEditResortForm(p => ({...p, pkg:v}))} placeholder="חבילה..." style={{ width:'100%', marginBottom:4 }} />
                        <textarea value={editResortForm.details ?? ''} onChange={e => setEditResortForm(p => ({...p, details:e.target.value}))}
                          style={{ ...S.inp, width:'100%', minHeight:48, marginBottom:6, fontSize:11 }} />
                        <div style={{ display:'flex', gap:4 }}>
                          <button onClick={() => saveResortEdit(r.id)} style={{ ...S.btn, background:'linear-gradient(135deg,#34d399,#10b981)', color:'#000', padding:'5px 10px', flex:1, boxShadow:'0 6px 20px rgba(16,185,129,.12)' }}>שמור</button>
                          <button onClick={() => setEditResortId(null)} style={{ ...S.btn, background:'rgba(30,45,74,0.6)', color:'#dde8f7', padding:'5px 8px' }}>ביטול</button>
                        </div>
                      </div>
                    ) : (
                      <div className="ch" style={{ padding:13, borderRadius:11, border:`2px solid ${expandedResort===r.id?'#4db8ff':'#1a2840'}`, background:expandedResort===r.id?'rgba(77,184,255,.05)':'transparent' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:3 }}>
                          <span style={{ fontSize:22 }}>{r.flag}</span>
                          <div style={{ display:'flex', gap:1 }}>
                            <button className="eb" onClick={e => { e.stopPropagation(); setEditResortId(r.id); setEditResortForm({...r}); }}>✏️</button>
                            <button className="db" onClick={e => { e.stopPropagation(); setResorts(p => p.filter(x => x.id !== r.id)); }}>✕</button>
                          </div>
                        </div>
                        <div style={{ fontWeight:700, fontSize:14 }}>{r.name}</div>
                        <div style={{ fontSize:11, color:'#4d6a8a', marginBottom:5 }}>{r.country}</div>
                        <div style={{ fontSize:11, color:'#34d399', marginBottom:2 }}>✈️ {r.flight}</div>
                        <div style={{ fontSize:11, color:'#fbbf24', marginBottom:5 }}>📦 {r.pkg}</div>
                        <div style={{ fontSize:10, color:'#4db8ff', marginBottom:4 }}>{r.level}</div>
                        <div>{[...Array(5)].map((_,i) => <span key={i} style={{ fontSize:11, color:i<r.rating?'#fbbf24':'#1e2d4a' }}>★</span>)}</div>
                        <button onClick={() => setExpandedResort(expandedResort===r.id ? null : r.id)}
                          style={{ background:'none', border:'none', cursor:'pointer', color:'#4db8ff', fontSize:11, marginTop:7, padding:0, fontFamily:'"Heebo",sans-serif' }}>
                          {expandedResort===r.id ? '▲ פחות פרטים' : '▼ פרטים נוספים'}
                        </button>
                        {expandedResort === r.id && (
                          <div className="fu" style={{ marginTop:8, paddingTop:8, borderTop:'1px solid #1a2840', fontSize:11, color:'#7a9bbf', lineHeight:1.65 }}>{r.details}</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* INSURANCE */}
            <div style={S.card}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:13, flexWrap:'wrap', gap:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                  <h2 style={{ fontSize:15, fontWeight:700 }}>🛡️ השוואת ביטוחים</h2>
                  <span style={{ fontSize:10, background:'rgba(248,113,113,.15)', color:'#fca5a5', padding:'3px 10px', borderRadius:20, fontWeight:600 }}>⚠️ חובה: הרחבה לספורט חורף!</span>
                </div>
                <button onClick={() => setShowAddIns(v => !v)} style={{ ...S.btn, background:showAddIns?'rgba(30,45,74,0.6)':'linear-gradient(135deg,#3b82f6,#60a5fa)', color:'#fff', padding:'7px 14px', boxShadow:showAddIns?undefined:'0 6px 20px rgba(59,130,246,.18)' }}>{showAddIns?'✕ סגור':'+ הוסף ביטוח'}</button>
              </div>
              {showAddIns && (
                <div className="fu" style={{ background:'rgba(16,185,129,.05)', border:'1px solid rgba(16,185,129,.2)', borderRadius:11, padding:13, marginBottom:14 }}>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:7 }}>
                    <Inp value={newIns.logo} onChange={v => setNewIns(p => ({...p, logo:v}))} placeholder="🛡️" style={{ width:46, textAlign:'center', padding:'8px 4px' }} />
                    <Inp value={newIns.name} onChange={v => setNewIns(p => ({...p, name:v}))} placeholder="שם החברה..." style={{ flex:'1 1 130px' as unknown as undefined }} />
                    <Inp value={newIns.medical} onChange={v => setNewIns(p => ({...p, medical:v}))} placeholder="כיסוי רפואי ($)..." style={{ flex:'1 1 130px' as unknown as undefined }} />
                    <Inp value={newIns.price} onChange={v => setNewIns(p => ({...p, price:v}))} placeholder="מחיר..." style={{ flex:'0 1 90px' as unknown as undefined }} />
                  </div>
                  <Inp value={newIns.sports_detail} onChange={v => setNewIns(p => ({...p, sports_detail:v}))} placeholder="פרטי ספורט חורף..." style={{ width:'100%', marginBottom:5 }} />
                  <Inp value={newIns.cancelNote} onChange={v => setNewIns(p => ({...p, cancelNote:v}))} placeholder="תנאי ביטול..." style={{ width:'100%', marginBottom:5 }} />
                  <Inp value={newIns.contact} onChange={v => setNewIns(p => ({...p, contact:v}))} placeholder="איש קשר / אתר..." style={{ width:'100%', marginBottom:5 }} />
                  <textarea value={newInsFeatures} onChange={e => setNewInsFeatures(e.target.value)} placeholder="תכולה (מופרדת בפסיקים): כיסוי רפואי, פינוי ממסוק, ..."
                    style={{ ...S.inp, width:'100%', minHeight:48, marginBottom:8 }} />
                  <button onClick={addIns} style={{ ...S.btn, background:'linear-gradient(135deg,#34d399,#10b981)', color:'#000', boxShadow:'0 6px 20px rgba(16,185,129,.12)' }}>✓ הוסף ביטוח</button>
                </div>
              )}
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {insurances.map(ins => (
                  <div key={ins.id}>
                    {editInsId === ins.id ? (
                      <div className="fu" style={{ padding:13, border:'2px solid #10b981', borderRadius:11, background:'rgba(16,185,129,.04)' }}>
                        <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:7 }}>
                          <Inp value={editInsForm.logo ?? ''} onChange={v => setEditInsForm(p => ({...p, logo:v}))} style={{ width:46, textAlign:'center', padding:'8px 4px' }} />
                          <Inp value={editInsForm.name ?? ''} onChange={v => setEditInsForm(p => ({...p, name:v}))} style={{ flex:'1 1 130px' as unknown as undefined }} />
                          <Inp value={editInsForm.medical ?? ''} onChange={v => setEditInsForm(p => ({...p, medical:v}))} style={{ flex:'1 1 120px' as unknown as undefined }} />
                          <Inp value={editInsForm.price ?? ''} onChange={v => setEditInsForm(p => ({...p, price:v}))} style={{ flex:'0 1 90px' as unknown as undefined }} />
                        </div>
                        <Inp value={editInsForm.sports_detail ?? ''} onChange={v => setEditInsForm(p => ({...p, sports_detail:v}))} placeholder="פרטי ספורט חורף..." style={{ width:'100%', marginBottom:5 }} />
                        <Inp value={editInsForm.cancelNote ?? ''} onChange={v => setEditInsForm(p => ({...p, cancelNote:v}))} placeholder="תנאי ביטול..." style={{ width:'100%', marginBottom:5 }} />
                        <Inp value={editInsForm.contact ?? ''} onChange={v => setEditInsForm(p => ({...p, contact:v}))} placeholder="איש קשר..." style={{ width:'100%', marginBottom:7 }} />
                        <div style={{ display:'flex', gap:5 }}>
                          <button onClick={() => saveInsEdit(ins.id)} style={{ ...S.btn, background:'linear-gradient(135deg,#34d399,#10b981)', color:'#000', boxShadow:'0 6px 20px rgba(16,185,129,.12)' }}>שמור</button>
                          <button onClick={() => setEditInsId(null)} style={{ ...S.btn, background:'rgba(30,45,74,0.6)', color:'#dde8f7' }}>ביטול</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ border:`1px solid ${expandedIns===ins.id?'rgba(16,185,129,.45)':'#1a2840'}`, borderRadius:11, overflow:'hidden' }}>
                        <div className="rh" style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 13px', cursor:'pointer' }}
                          onClick={() => setExpandedIns(expandedIns===ins.id ? null : ins.id)}>
                          <span style={{ fontSize:20, flexShrink:0 }}>{ins.logo}</span>
                          <span style={{ flex:1, fontWeight:700, fontSize:14 }}>{ins.name}</span>
                          <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                            <span style={{ fontSize:11, color:'#4db8ff' }}>{ins.medical}</span>
                            <span style={{ fontSize:11 }}>{ins.sports===true ? '✅ ספורט' : ins.sports===false ? '❌' : `⚠️ ${ins.sports}`}</span>
                            <span style={{ fontSize:12, color:'#34d399', fontWeight:700 }}>{ins.price}</span>
                          </div>
                          <button className="eb" onClick={e => { e.stopPropagation(); setEditInsId(ins.id); setEditInsForm({...ins}); }}>✏️</button>
                          <button className="db" onClick={e => { e.stopPropagation(); setInsurances(p => p.filter(x => x.id !== ins.id)); }}>✕</button>
                          <span style={{ color:'#3d5269', fontSize:11 }}>{expandedIns===ins.id ? '▲' : '▼'}</span>
                        </div>
                        {expandedIns === ins.id && (
                          <div className="fu" style={{ padding:'0 13px 13px', borderTop:'1px solid #1a2840' }}>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10 }}>
                              <div style={{ background:'rgba(255,255,255,.02)', borderRadius:9, padding:11 }}>
                                <div style={{ fontSize:11, fontWeight:700, color:'#34d399', marginBottom:7 }}>✅ תכולה</div>
                                {ins.features.map((f, i) => <div key={i} style={{ fontSize:12, color:'#7a9bbf', marginBottom:3 }}>· {f}</div>)}
                              </div>
                              <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                                <div style={{ background:'rgba(77,184,255,.05)', borderRadius:9, padding:10 }}>
                                  <div style={{ fontSize:10, fontWeight:700, color:'#4db8ff', marginBottom:3 }}>⛷️ ספורט חורף</div>
                                  <div style={{ fontSize:11, color:'#7a9bbf', lineHeight:1.6 }}>{ins.sports_detail}</div>
                                </div>
                                <div style={{ background:'rgba(251,191,36,.05)', borderRadius:9, padding:10 }}>
                                  <div style={{ fontSize:10, fontWeight:700, color:'#fbbf24', marginBottom:3 }}>📋 ביטול</div>
                                  <div style={{ fontSize:11, color:'#7a9bbf' }}>{ins.cancelNote}</div>
                                </div>
                                <div style={{ background:'rgba(255,255,255,.02)', borderRadius:9, padding:10 }}>
                                  <div style={{ fontSize:10, fontWeight:700, color:'#9ca3af', marginBottom:3 }}>📞 יצירת קשר</div>
                                  <div style={{ fontSize:11, color:'#60a5fa' }}>{ins.contact}</div>
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

        {/* ════ DURING ════ */}
        {phase === 'during' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

            {/* BUDGET */}
            <div style={{ ...S.card, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#8b5cf6,#ec4899)' }} />
              <h2 style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>💰 ניהול תקציב משותף</h2>
              <div style={{ display:'flex', gap:7, marginBottom:14, flexWrap:'wrap' }}>
                {PEOPLE.map((p, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:5, background:'#131e30', borderRadius:20, padding:'4px 12px 4px 4px' }}>
                    <div style={{ width:25, height:25, borderRadius:'50%', background:PC[i], display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800 }}>{p[0]}</div>
                    <span style={{ fontSize:12 }}>{p}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:'rgba(255,255,255,.02)', border:'1px solid #1a2840', borderRadius:11, padding:13, marginBottom:16 }}>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:7 }}>
                  <Inp value={expDesc} onChange={setExpDesc} placeholder="תיאור הוצאה..." style={{ flex:'2 1 150px' as unknown as undefined }} />
                  <Inp value={expAmt} onChange={setExpAmt} placeholder="סכום (€)" type="number" style={{ flex:'1 1 80px' as unknown as undefined }} />
                </div>
                <div style={{ display:'flex', gap:5, alignItems:'center', marginBottom:7, flexWrap:'wrap' }}>
                  <span style={{ fontSize:11, color:'#4d6a8a' }}>שילם:</span>
                  {PEOPLE.map((p, i) => (
                    <button key={i} onClick={() => setExpPayer(i)}
                      style={{ padding:'3px 11px', borderRadius:16, border:`2px solid ${expPayer===i?PC[i]:'#1a2840'}`, background:expPayer===i?`${PC[i]}25`:'transparent', color:expPayer===i?PC[i]:'#4d6a8a', cursor:'pointer', fontSize:11, transition:'all .2s', fontFamily:'"Heebo",sans-serif' }}>{p}</button>
                  ))}
                </div>
                <div style={{ display:'flex', gap:5, alignItems:'center', marginBottom:11, flexWrap:'wrap' }}>
                  <span style={{ fontSize:11, color:'#4d6a8a' }}>מחלקים:</span>
                  {PEOPLE.map((p, i) => (
                    <button key={i} onClick={() => setExpSplit(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev, i])}
                      style={{ padding:'3px 11px', borderRadius:16, border:`2px solid ${expSplit.includes(i)?'#34d399':'#1a2840'}`, background:expSplit.includes(i)?'rgba(52,211,153,.15)':'transparent', color:expSplit.includes(i)?'#34d399':'#4d6a8a', cursor:'pointer', fontSize:11, transition:'all .2s', fontFamily:'"Heebo",sans-serif' }}>{p}</button>
                  ))}
                </div>
                <button onClick={addExpense} style={{ ...S.btn, background:'linear-gradient(135deg,#8b5cf6,#7c3aed)', color:'#fff', boxShadow:'0 6px 20px rgba(139,92,246,.18)' }}>+ הוסף הוצאה</button>
              </div>
              {expenses.length > 0 && (
                <>
                  {expenses.map(e => (
                    <div key={e.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 11px', borderRadius:9, background:'rgba(255,255,255,.02)', marginBottom:5 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:500 }}>{e.desc}</div>
                        <div style={{ fontSize:10, color:'#4d6a8a', marginTop:2 }}>שילם: <span style={{ color:PC[e.payer], fontWeight:600 }}>{PEOPLE[e.payer]}</span> · {e.split.map(i=>PEOPLE[i]).join(', ')} · {e.date}</div>
                      </div>
                      <div style={{ fontSize:16, fontWeight:800, color:'#34d399' }}>€{e.amount.toFixed(2)}</div>
                      <button className="db" onClick={() => setExpenses(p => p.filter(x => x.id !== e.id))}>✕</button>
                    </div>
                  ))}
                  <div style={{ textAlign:'left', padding:'6px 11px', fontSize:11, color:'#4d6a8a' }}>
                    סה"כ: <span style={{ color:'#34d399', fontWeight:700, fontSize:15 }}>€{expenses.reduce((s,e) => s+e.amount, 0).toFixed(2)}</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(115px,1fr))', gap:8, margin:'11px 0' }}>
                    {balances.map((b, i) => (
                      <div key={i} style={{ padding:11, borderRadius:9, border:`1px solid ${b.balance>.01?'rgba(52,211,153,.3)':b.balance<-.01?'rgba(248,113,113,.3)':'#1a2840'}`, textAlign:'center' }}>
                        <div style={{ width:26, height:26, borderRadius:'50%', background:PC[i], margin:'0 auto 4px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800 }}>{b.name[0]}</div>
                        <div style={{ fontSize:16, fontWeight:900, color:b.balance>.01?'#34d399':b.balance<-.01?'#f87171':'#4d6a8a' }}>{b.balance>0?'+':''}€{b.balance.toFixed(0)}</div>
                        <div style={{ fontSize:11, marginTop:2 }}>{b.name}</div>
                        <div style={{ fontSize:10, color:'#4d6a8a', marginTop:2 }}>{b.balance>.01?'מגיע לו':b.balance<-.01?'חייב':'✅'}</div>
                      </div>
                    ))}
                  </div>
                  {settlements.length > 0 && (
                    <div style={{ background:'rgba(139,92,246,.07)', border:'1px solid rgba(139,92,246,.28)', borderRadius:9, padding:11 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:'#a78bfa', marginBottom:7 }}>💸 העברות לסילוק</div>
                      {settlements.map((s, i) => (
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:7, fontSize:13, marginBottom:5 }}>
                          <span style={{ color:'#f87171', fontWeight:600 }}>{s.from}</span><span style={{ color:'#4d6a8a' }}>→</span><span style={{ color:'#34d399', fontWeight:600 }}>{s.to}</span>
                          <span style={{ color:'#fbbf24', fontWeight:900, marginRight:'auto' }}>€{s.amount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {expenses.length === 0 && <div style={{ textAlign:'center', padding:'18px 0', color:'#3d5269', fontSize:13 }}><span style={{ fontSize:28, display:'block', marginBottom:7 }}>💶</span>הוסף את ההוצאה הראשונה</div>}
            </div>

            {/* PLACES */}
            <div style={S.card}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:13, flexWrap:'wrap', gap:8 }}>
                <h2 style={{ fontSize:15, fontWeight:700 }}>📍 מקומות לביקור</h2>
                <button onClick={() => setShowAddPlace(v => !v)} style={{ ...S.btn, background:showAddPlace?'rgba(30,45,74,0.6)':'linear-gradient(135deg,#8b5cf6,#7c3aed)', color:'#fff', padding:'7px 14px', boxShadow:showAddPlace?undefined:'0 6px 20px rgba(139,92,246,.14)' }}>{showAddPlace?'✕ סגור':'+ הוסף מקום'}</button>
              </div>
              {showAddPlace && (
                <div className="fu" style={{ background:'rgba(139,92,246,.05)', border:'1px solid rgba(139,92,246,.2)', borderRadius:11, padding:13, marginBottom:13 }}>
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:7 }}>
                    <Inp value={newPlace.emoji} onChange={v => setNewPlace(p => ({...p, emoji:v}))} placeholder="📍" style={{ width:46, textAlign:'center', padding:'8px 4px' }} />
                    <Inp value={newPlace.name} onChange={v => setNewPlace(p => ({...p, name:v}))} placeholder="שם המקום..." style={{ flex:'1 1 150px' as unknown as undefined }} />
                    <select value={newPlace.type} onChange={e => setNewPlace(p => ({...p, type:e.target.value}))} style={{ ...S.inp, flex:'0 1 100px' as unknown as undefined }}>
                      {['בילוי','אוכל','רלקסיישן','תצפית','קניות','פעילות','אחר'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <Inp value={newPlace.note} onChange={v => setNewPlace(p => ({...p, note:v}))} placeholder="הערה / טיפ..." style={{ width:'100%', marginBottom:8 }} />
                  <button onClick={addPlace} style={{ ...S.btn, background:'linear-gradient(135deg,#8b5cf6,#7c3aed)', color:'#fff', boxShadow:'0 6px 20px rgba(139,92,246,.14)'} }>+ הוסף מקום</button>
                </div>
              )}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))', gap:9 }}>
                {places.map(p => (
                  <div key={p.id}>
                    {editPlaceId === p.id ? (
                      <div className="fu" style={{ padding:11, border:'2px solid #8b5cf6', borderRadius:11, background:'rgba(139,92,246,.04)' }}>
                        <div style={{ display:'flex', gap:4, marginBottom:5 }}>
                          <Inp value={editPlaceForm.emoji ?? ''} onChange={v => setEditPlaceForm(f => ({...f, emoji:v}))} style={{ width:40, textAlign:'center', padding:'6px 3px' }} />
                          <Inp value={editPlaceForm.name ?? ''} onChange={v => setEditPlaceForm(f => ({...f, name:v}))} style={{ flex:'1 1 auto' as unknown as undefined }} />
                        </div>
                        <Inp value={editPlaceForm.note ?? ''} onChange={v => setEditPlaceForm(f => ({...f, note:v}))} placeholder="הערה..." style={{ width:'100%', marginBottom:5 }} />
                        <div style={{ display:'flex', gap:4 }}>
                          <button onClick={() => savePlaceEdit(p.id)} style={{ ...S.btn, background:'linear-gradient(135deg,#34d399,#10b981)', color:'#000', padding:'5px 11px', flex:1, boxShadow:'0 6px 20px rgba(16,185,129,.12)'}}>שמור</button>
                          <button onClick={() => setEditPlaceId(null)} style={{ ...S.btn, background:'rgba(30,45,74,0.6)', color:'#dde8f7', padding:'5px 9px' }}>ביטול</button>
                        </div>
                      </div>
                    ) : (
                      <div className="ch" style={{ padding:13, borderRadius:11, border:`1px solid ${p.visited?'rgba(52,211,153,.35)':'#1a2840'}`, background:p.visited?'rgba(52,211,153,.04)':'transparent', opacity:p.visited?.75:1 }}>
                        <div style={{ display:'flex', justifyContent:'flex-end', gap:1, marginBottom:1 }}>
                          <button className="eb" onClick={e => { e.stopPropagation(); setEditPlaceId(p.id); setEditPlaceForm({...p}); }}>✏️</button>
                          <button className="db" onClick={e => { e.stopPropagation(); setPlaces(prev => prev.filter(x => x.id !== p.id)); }}>✕</button>
                        </div>
                        <div style={{ fontSize:25, marginBottom:5 }}>{p.emoji}</div>
                        <div style={{ fontSize:13, fontWeight:600, textDecoration:p.visited?'line-through':'none', color:p.visited?'#4d6a8a':'#dde8f7', marginBottom:2 }}>{p.name}</div>
                        <div style={{ fontSize:11, color:'#4db8ff', marginBottom:p.note?4:0 }}>{p.type}</div>
                        {p.note && <div style={{ fontSize:11, color:'#4d6a8a', lineHeight:1.5, marginBottom:7 }}>{p.note}</div>}
                        <button onClick={() => setPlaces(prev => prev.map(x => x.id===p.id ? {...x, visited:!x.visited} : x))}
                          style={{ ...S.btn, background:p.visited? 'linear-gradient(135deg,#34d399,#10b981)' : 'linear-gradient(135deg,#8b5cf6,#7c3aed)', color:p.visited?'#06150b':'#fff', padding:'5px 11px', marginTop:7, width:'100%', fontSize:11, boxShadow:p.visited? '0 6px 20px rgba(16,185,129,.08)' : '0 6px 18px rgba(139,92,246,.08)'}}>
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
              <h2 style={{ fontSize:15, fontWeight:700, marginBottom:5 }}>🎬 סנכרון צילומים ← מסלולים</h2>
              <p style={{ fontSize:11, color:'#4d6a8a', marginBottom:13 }}>קשר כל קטע וידאו למסלול/ראן — כדי שתוכל לערוך אחר כך בקלות</p>
              <div style={{ background:'rgba(255,255,255,.02)', border:'1px solid #1a2840', borderRadius:10, padding:11, marginBottom:13 }}>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                  <select value={mediaDevice} onChange={e => setMediaDevice(e.target.value)} style={{ ...S.inp, flex:'0 1 135px' as unknown as undefined }}>
                    <option>GoPro</option><option>Garmin Venu 4</option><option>טלפון</option>
                  </select>
                  <Inp value={mediaDesc} onChange={setMediaDesc} placeholder="תיאור (ירידה, נוף, אפטר-סקי...)" style={{ flex:'2 1 155px' as unknown as undefined }} />
                  <Inp value={mediaRun} onChange={setMediaRun} placeholder="ראן / מסלול / שעה..." style={{ flex:'1 1 120px' as unknown as undefined }} />
                  <button onClick={addMedia} style={{ ...S.btn, background:'linear-gradient(135deg,#ec4899,#f472b6)', color:'#fff', boxShadow:'0 6px 20px rgba(236,72,153,.12)'} }>+ הוסף</button>
                </div>
              </div>
              {media.length === 0 && <div style={{ textAlign:'center', color:'#3d5269', fontSize:12, padding:'14px 0' }}>📭 עדיין לא הוספת קטעים</div>}
              {media.map(m => (
                <div key={m.id} style={{ marginBottom:7 }}>
                  {editMediaId === m.id ? (
                    <div className="fu" style={{ padding:9, border:'1px solid #ec4899', borderRadius:9, background:'rgba(236,72,153,.03)' }}>
                      <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:6 }}>
                        <select value={editMediaForm.device ?? 'GoPro'} onChange={e => setEditMediaForm(p => ({...p, device:e.target.value}))} style={{ ...S.inp, flex:'0 1 135px' as unknown as undefined }}>
                          <option>GoPro</option><option>Garmin Venu 4</option><option>טלפון</option>
                        </select>
                        <Inp value={editMediaForm.desc ?? ''} onChange={v => setEditMediaForm(p => ({...p, desc:v}))} placeholder="תיאור..." style={{ flex:'2 1 150px' as unknown as undefined }} />
                        <Inp value={editMediaForm.run ?? ''} onChange={v => setEditMediaForm(p => ({...p, run:v}))} placeholder="מסלול / ראן..." style={{ flex:'1 1 110px' as unknown as undefined }} />
                      </div>
                      <div style={{ display:'flex', gap:5 }}>
                        <button onClick={() => saveMediaEdit(m.id)} style={{ ...S.btn, background:'linear-gradient(135deg,#34d399,#10b981)', color:'#000', padding:'5px 12px', boxShadow:'0 6px 20px rgba(16,185,129,.12)' }}>שמור</button>
                        <button onClick={() => setEditMediaId(null)} style={{ ...S.btn, background:'rgba(30,45,74,0.6)', color:'#dde8f7', padding:'5px 12px' }}>ביטול</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 11px', borderRadius:9, background:'rgba(255,255,255,.02)', border:'1px solid #1a2840' }}>
                      <span style={{ fontSize:17, flexShrink:0 }}>{m.device==='GoPro'?'📷':m.device==='Garmin Venu 4'?'⌚':'📱'}</span>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.desc}</div>
                        {m.run && <div style={{ fontSize:11, color:'#a78bfa', marginTop:1 }}>🎿 {m.run}</div>}
                        <div style={{ fontSize:10, color:'#4d6a8a', marginTop:1 }}>{m.device}</div>
                      </div>
                      <button onClick={() => setMedia(p => p.map(x => x.id===m.id ? {...x, uploaded:!x.uploaded} : x))}
                        style={{ fontSize:10, padding:'3px 9px', borderRadius:20, border:`1px solid ${m.uploaded?'#34d399':'#1a2840'}`, background:m.uploaded?'rgba(52,211,153,.15)':'transparent', color:m.uploaded?'#34d399':'#4d6a8a', cursor:'pointer', transition:'all .2s', fontFamily:'"Heebo",sans-serif', flexShrink:0 }}>
                        {m.uploaded ? '✅ הועלה' : '⏳ ממתין'}
                      </button>
                      <button className="eb" onClick={() => { setEditMediaId(m.id); setEditMediaForm({ device:m.device, desc:m.desc, run:m.run }); }}>✏️</button>
                      <button className="db" onClick={() => setMedia(p => p.filter(x => x.id !== m.id))}>✕</button>
                    </div>
                  )}
                </div>
              ))}
              {/* Tips */}
              <div style={{ marginTop:18, borderTop:'1px solid #1a2840', paddingTop:16 }}>
                <div style={{ fontSize:13, fontWeight:700, marginBottom:11 }}>💡 טיפי עריכה לפי מכשיר</div>
                <div style={{ display:'flex', gap:6, marginBottom:13, flexWrap:'wrap' }}>
                  {Object.keys(TIPS).map(d => (
                    <button key={d} onClick={() => setActiveTip(activeTip===d ? null : d)}
                      style={{ padding:'6px 15px', borderRadius:20, border:`2px solid ${activeTip===d?'#ec4899':'#1a2840'}`, background:activeTip===d?'rgba(236,72,153,.1)':'transparent', color:activeTip===d?'#ec4899':'#4d6a8a', cursor:'pointer', fontWeight:600, fontSize:12, transition:'all .2s', fontFamily:'"Heebo",sans-serif' }}>
                      {d==='GoPro'?'📷 GoPro':d==='Garmin'?'⌚ Garmin Venu 4':'📱 טלפון'}
                    </button>
                  ))}
                </div>
                {activeTip && (
                  <div className="fu" style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {TIPS[activeTip].map((tip, i) => (
                      <div key={i} style={{ padding:'10px 12px', borderRadius:9, background:'rgba(255,255,255,.02)', border:'1px solid #1a2840' }}>
                        <div style={{ fontSize:13, fontWeight:700, color:'#ec4899', marginBottom:3 }}>💡 {tip.t}</div>
                        <div style={{ fontSize:12, color:'#7a9bbf', lineHeight:1.65 }}>{tip.d}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════ AFTER ════ */}
        {phase === 'after' && (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ ...S.card, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#ec4899,#f97316)' }} />
              <h2 style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>💸 סיכום כספי סופי</h2>
              {expenses.length === 0 ? (
                <div style={{ textAlign:'center', padding:'26px 0' }}>
                  <div style={{ fontSize:36, marginBottom:9 }}>💶</div>
                  <div style={{ color:'#4d6a8a', fontSize:13 }}>לא הוזנו הוצאות — עבור ל"בזמן הטיול"</div>
                </div>
              ) : (
                <>
                  <div style={{ background:'rgba(236,72,153,.05)', border:'1px solid rgba(236,72,153,.18)', borderRadius:11, padding:14, marginBottom:14 }}>
                    <div style={{ fontSize:10, color:'#f9a8d4', fontWeight:700, marginBottom:5 }}>סה"כ הוצאות</div>
                    <div style={{ fontSize:34, fontWeight:900, color:'#fff', marginBottom:3 }}>€{expenses.reduce((s,e) => s+e.amount, 0).toFixed(2)}</div>
                    <div style={{ fontSize:11, color:'#4d6a8a' }}>{expenses.length} הוצאות · {PEOPLE.length} אנשים · ממוצע €{(expenses.reduce((s,e) => s+e.amount, 0)/PEOPLE.length).toFixed(2)} לאדם</div>
                  </div>
                  {settlements.length > 0 ? (
                    <>
                      <div style={{ fontSize:13, fontWeight:700, marginBottom:7 }}>העברות נדרשות:</div>
                      {settlements.map((s, i) => (
                        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 14px', borderRadius:9, background:'rgba(255,255,255,.02)', border:'1px solid #1a2840', marginBottom:7 }}>
                          <div style={{ fontSize:13, display:'flex', alignItems:'center', gap:6 }}>
                            <span style={{ color:'#f87171', fontWeight:700 }}>{s.from}</span><span style={{ color:'#3d5269' }}>→</span><span style={{ color:'#34d399', fontWeight:700 }}>{s.to}</span>
                          </div>
                          <span style={{ fontSize:19, fontWeight:900, color:'#fbbf24' }}>€{s.amount}</span>
                        </div>
                      ))}
                    </>
                  ) : <div style={{ textAlign:'center', color:'#34d399', fontSize:14, fontWeight:700, padding:'9px 0' }}>✅ כולם מסולקים!</div>}
                </>
              )}
            </div>
            <div style={S.card}>
              <h2 style={{ fontSize:15, fontWeight:700, marginBottom:13 }}>📤 תוכן להעלאה</h2>
              {uploads.map(task => (
                <div key={task.id} onClick={() => setUploads(p => p.map(t => t.id===task.id ? {...t, done:!t.done} : t))}
                  style={{ display:'flex', alignItems:'center', gap:9, padding:'10px 12px', borderRadius:9, border:`1px solid ${task.done?'rgba(52,211,153,.28)':'#1a2840'}`, background:task.done?'rgba(52,211,153,.03)':'transparent', cursor:'pointer', marginBottom:7, transition:'all .2s', opacity:task.done?.7:1 }}>
                  <div style={{ width:19, height:19, borderRadius:5, border:`2px solid ${task.done?'#34d399':'#1a2840'}`, background:task.done?'#34d399':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s' }}>
                    {task.done && <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round"/></svg>}
                  </div>
                  <span style={{ flex:1, fontSize:13, textDecoration:task.done?'line-through':'none', color:task.done?'#4d6a8a':'#dde8f7' }}>{task.title}</span>
                  <span style={{ fontSize:10, background:'rgba(77,184,255,.1)', color:'#4db8ff', padding:'3px 9px', borderRadius:20, flexShrink:0 }}>{task.platform}</span>
                </div>
              ))}
              {uploads.every(t => t.done) && (
                <div className="fu" style={{ marginTop:11, textAlign:'center', padding:'18px', background:'rgba(52,211,153,.05)', borderRadius:11, border:'1px solid rgba(52,211,153,.25)' }}>
                  <div style={{ fontSize:32, marginBottom:7 }}>🎉</div>
                  <div style={{ fontSize:15, fontWeight:800, color:'#34d399' }}>הכל הועלה! חופשת סקי מושלמת 🏔️⛷️</div>
                </div>
              )}
            </div>
            <div style={S.card}>
              <h2 style={{ fontSize:15, fontWeight:700, marginBottom:13 }}>🌟 סיכום הטיול</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(125px,1fr))', gap:9 }}>
                {[
                  { l:'פריטים נארזו', v:`${packStats.packed}/${packStats.total}`, e:'🎒' },
                  { l:'הוצאות',       v:expenses.length,                           e:'💶' },
                  { l:'מקומות בוקרו',v:places.filter(p => p.visited).length,      e:'📍' },
                  { l:'קטעי צילום',  v:media.length,                              e:'🎬' },
                  { l:'תוכן הועלה',  v:`${uploads.filter(t => t.done).length}/${uploads.length}`, e:'📤' },
                  { l:'סה"כ',        v:expenses.length ? `€${expenses.reduce((s,e) => s+e.amount, 0).toFixed(0)}` : '—', e:'💰' },
                ].map((s, i) => (
                  <div key={i} style={{ padding:13, borderRadius:11, background:'rgba(255,255,255,.02)', border:'1px solid #1a2840', textAlign:'center' }}>
                    <div style={{ fontSize:22, marginBottom:4 }}>{s.e}</div>
                    <div style={{ fontSize:19, fontWeight:900, color:'#4db8ff' }}>{s.v}</div>
                    <div style={{ fontSize:10, color:'#4d6a8a', marginTop:3 }}>{s.l}</div>
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
