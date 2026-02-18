import { SkiItem, Reminder, Resort, Insurance, Place, UploadTask } from "../types/skiTypes";

export const INIT_ITEMS: SkiItem[] = [
  { id: 1, cat: 'ביגוד סקי', name: 'חולצה תרמית (בסיס)', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=300&h=300&fit=crop' },
  { id: 2, cat: 'ביגוד סקי', name: 'מכנס תרמי / גטקס', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&h=300&fit=crop' },
  { id: 3, cat: 'ביגוד סקי', name: 'מיקרו-פליז / סווטשירט', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=300&fit=crop' },
  { id: 4, cat: 'ביגוד סקי', name: 'מעיל סקי (עמיד למים)', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1551698618-1fed5d978028?w=300&h=300&fit=crop' },
  { id: 5, cat: 'ביגוד סקי', name: 'מכנסי סקי (עמידים למים)', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=300&h=300&fit=crop' },
  { id: 6, cat: 'ביגוד סקי', name: 'גרבי סקי ארוכות (5 זוגות)', status: 'buy', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1582309801060-d51357b9e8f5?w=300&h=300&fit=crop' },
  { id: 7, cat: 'ביגוד סקי', name: 'כפפות סקי Touch', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1544923246-77307dd654ca?w=300&h=300&fit=crop' },
  { id: 8, cat: 'ביגוד סקי', name: 'כפפות ליינר Touch', status: 'buy', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=300&h=300&fit=crop' },
  { id: 9, cat: 'ביגוד סקי', name: 'כפפות מחממות עם סוללות', status: 'buy', packed: false, optional: true, img: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?w=300&h=300&fit=crop' },
  { id: 10, cat: 'ביגוד סקי', name: 'צעיף באף BUFF', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1610486801905-2d4e3bc31062?w=300&h=300&fit=crop' },
  { id: 11, cat: 'ציוד גלישה', name: 'קסדה', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=300&h=300&fit=crop' },
  { id: 12, cat: 'ציוד גלישה', name: 'גוגלס (משקפי סקי)', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1526827251190-3944697b0033?w=300&h=300&fit=crop' },
  { id: 13, cat: 'ציוד גלישה', name: 'מגלשיים / בורד', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1551698618-1fed5d978028?w=300&h=300&fit=crop' },
  { id: 14, cat: 'ציוד גלישה', name: 'מחזיק לברך / תומך ברך', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1597040660350-02f623098553?w=300&h=300&fit=crop' },
  { id: 15, cat: 'ערב ומלון', name: 'נעלי הליכה בשלג (ייעודיות)', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop' },
  { id: 16, cat: 'ערב ומלון', name: 'בגד ים וכפכפים (ספא)', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1559004065-175aa1368b63?w=300&h=300&fit=crop' },
  { id: 17, cat: 'ערב ומלון', name: "בגדים נוחים / ג'ינסים", status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=300&h=300&fit=crop' },
  { id: 18, cat: 'ערב ומלון', name: "פיג'מה", status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?w=300&h=300&fit=crop' },
  { id: 19, cat: 'פארם והיגיינה', name: 'קרם הגנה לפנים SPF 50+', status: 'buy', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300&h=300&fit=crop' },
  { id: 20, cat: 'פארם והיגיינה', name: 'שפתון הגנה', status: 'buy', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1617462441994-08f3226a273b?w=300&h=300&fit=crop' },
  { id: 21, cat: 'פארם והיגיינה', name: 'משחת אובליפיכה', status: 'buy', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop' },
  { id: 22, cat: 'פארם והיגיינה', name: 'מגבוני אובליפיכה', status: 'buy', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop' },
  { id: 23, cat: 'פארם והיגיינה', name: 'משחת בן גיי (שרירים)', status: 'buy', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' },
  { id: 24, cat: 'פארם והיגיינה', name: 'משכי כאבים ותרופות', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop' },
  { id: 25, cat: 'פארם והיגיינה', name: 'היגיינה (מברשת/שמפו/דאודורנט)', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=300&h=300&fit=crop' },
  { id: 26, cat: 'מסמכים ואלקטרוניקה', name: 'דרכון (תוקף 6+ חודשים)', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=300&fit=crop' },
  { id: 27, cat: 'מסמכים ואלקטרוניקה', name: 'ביטוח נסיעות + הרחבה ספורט חורף', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=300&h=300&fit=crop' },
  { id: 28, cat: 'מסמכים ואלקטרוניקה', name: 'מטען נייד (Power Bank)', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1609091839697-eb211ff66842?w=300&h=300&fit=crop' },
  { id: 29, cat: 'מסמכים ואלקטרוניקה', name: 'מתאם לשקע חשמל', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=300&h=300&fit=crop' },
  { id: 30, cat: 'מסמכים ואלקטרוניקה', name: 'כרטיס אשראי + מזומן', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=300&h=300&fit=crop' },
  { id: 31, cat: 'שומרי מסורת', name: 'תפילין, טלית וציצית', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1515658323406-25d61c141a6e?w=300&h=300&fit=crop' },
  { id: 32, cat: 'שומרי מסורת', name: 'סידור / ספרי קודש', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1544648630-36655c697841?w=300&h=300&fit=crop' },
  { id: 33, cat: 'שומרי מסורת', name: 'אוכל כשר (שימורים/מנות חמות)', status: 'buy', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=300&fit=crop' },
  { id: 34, cat: 'שומרי מסורת', name: 'נרות שבת, הבדלה ויין לקידוש', status: 'buy', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=300&h=300&fit=crop' },
];

export const INIT_REMINDERS: Reminder[] = [
  { id: 1, text: 'הזמן כרטיסי טיסה', done: false, priority: 'urgent', emoji: '✈️' },
  { id: 2, text: 'הזמן מלון / Airbnb', done: false, priority: 'urgent', emoji: '🏨' },
  { id: 3, text: 'קנה ביטוח נסיעות + ספורט חורף', done: false, priority: 'urgent', emoji: '🛡️' },
  { id: 4, text: 'רכוש Ski Pass לאתר הנבחר', done: false, priority: 'medium', emoji: '⛷️' },
  { id: 5, text: 'הזמן שכירת ציוד (מגלשיים/נעליים)', done: false, priority: 'medium', emoji: '🎿' },
  { id: 6, text: 'הכן כסף מזומן במטבע מקומי', done: false, priority: 'medium', emoji: '💶' },
  { id: 7, text: 'הורד מפות אופליין (Google Maps)', done: false, priority: 'low', emoji: '🗺️' },
  { id: 8, text: 'בדוק זמינות GoPro + SD + סוללות', done: false, priority: 'low', emoji: '📷' },
  { id: 9, text: 'הכן אוכל כשר לנסיעה', done: false, priority: 'medium', emoji: '🥘' },
  { id: 10, text: 'הכן נרות שבת, הבדלה ויין', done: false, priority: 'low', emoji: '🕯️' },
];

export const INIT_RESORTS: Resort[] = [
  { id: 1, name: 'Zermatt', flag: '🇨🇭', country: 'שווייץ', flight: '€280–€420', pkg: '€1,800–€2,800 לאדם', level: 'כל הרמות', rating: 5, details: 'גובה 3,883מ׳. עונה ארוכה עד מאי. מטרהורן אייקוני. מסועי כבל מהמודרניים בעולם. Apres-ski מעולה. אין מכוניות בכפר.' },
  { id: 2, name: 'Kitzbühel', flag: '🇦🇹', country: 'אוסטריה', flight: '€180–€290', pkg: '€1,200–€2,000 לאדם', level: 'בינוני–מתקדם', rating: 4, details: 'אחד מאתרי הסקי הנחשבים בעולם. Hahnenkamm Race. אחרי-סקי אגדי. עיירה מימי הביניים. מתאים למי שכבר גולש.' },
  { id: 3, name: 'Val Thorens', flag: '🇫🇷', country: 'צרפת', flight: '€160–€260', pkg: '€1,100–€1,900 לאדם', level: 'כל הרמות', rating: 5, details: 'הגבוה באלפים (2,300מ׳). חלק מ-3 Vallées. שלג מובטח. מסועי גונדולה מהמהירים. מאות ק"מ של מסלולים. מוסיקה ואפטר-סקי.' },
  { id: 4, name: 'Livigno', flag: '🇮🇹', country: 'איטליה', flight: '€150–€240', pkg: '€900–€1,500 לאדם', level: 'כל הרמות', rating: 4, details: 'Duty Free – קניות זולות! ידידותי לכשרות יחסית. אווירה איטלקית נינוחה. מחירים סבירים לאחד מהיפים באיטליה.' },
  { id: 5, name: 'Bansko', flag: '🇧🇬', country: 'בולגריה', flight: '€100–€180', pkg: '€500–€900 לאדם', level: 'מתחילים', rating: 3, details: 'הכי זול באירופה! מסועי כבל חדשים (2023). מסלולים בינוניים. עיירת מורשת יפה. מתאים לחופשת מתחילים בתקציב.' },
  { id: 6, name: 'Jasná', flag: '🇸🇰', country: 'סלובקיה', flight: '€130–€210', pkg: '€700–€1,200 לאדם', level: 'בינוני', rating: 3, details: 'האתר הגדול ביותר בסלובקיה. מחירים טובים. שלג טוב בינואר–מרץ. קהל ישראלי שעולה. הסעות מבודפשט.' },
];

export const INIT_INSURANCE: Insurance[] = [
  { id: 1, name: 'כלל ביטוח', logo: '🛡️', medical: '$100,000', sports: true, cancel: true, cancelNote: 'ביטול עד 72 שעות', price: '~₪180', features: ['כיסוי רפואי מלא', 'פינוי ממסוק', 'הרחבה לסקי/סנובורד', 'ביטול טיסה', 'אובדן כבודה $1,500', 'עיכוב טיסה'], sports_detail: 'כולל: סקי, סנובורד, פרפר. לא כולל: Off-Piste ללא מדריך.', contact: '*2066 | kll.co.il' },
  { id: 2, name: 'הפניקס', logo: '🔥', medical: '$150,000', sports: true, cancel: true, cancelNote: 'ביטול עד 48 שעות', price: '~₪220', features: ['כיסוי רפואי $150K', 'פינוי אוויר', 'הרחבה ספורט חורף כלולה', 'ביטול עד 48שע', 'אובדן כבודה $2,000', 'אחריות כלפי שלישי'], sports_detail: 'כולל: סקי, סנובורד, Telemark. Off-Piste מותר!', contact: '*6262 | phoenix.co.il' },
  { id: 3, name: 'Chubb/מנורה', logo: '💎', medical: '$250,000', sports: 'תוספת', cancel: 'חלקי', cancelNote: 'ביטול מחלה בלבד', price: '~₪350', features: ['כיסוי רפואי $250K', 'הרחבה ספורט בתוספת', 'ביטול מחלה בלבד', 'אובדן כבודה $3,000', 'אחריות כלפי שלישי $1M'], sports_detail: 'ספורט חורף בתוספת: +₪80. כולל Off-Piste ו-Helicopter Skiing.', contact: 'chubb.com/il' },
  { id: 4, name: 'World Nomads', logo: '🌍', medical: '$100,000', sports: true, cancel: true, cancelNote: 'גמיש', price: '~$30/שבוע', features: ['כיסוי רפואי $100K', 'ספורט חורף כלול', 'ביטול גמיש', 'גנבת ציוד ספורט', 'Adventure Sports Package'], sports_detail: 'הכי גמיש. כולל Off-Piste, סקי מחוץ לתחומים מוסדרים.', contact: 'worldnomads.com' },
];

export const INIT_PLACES: Place[] = [
  { id: 1, name: 'כפר האפטר-סקי המרכזי', type: 'בילוי', visited: false, emoji: '🏔️', note: 'מוזיקה, בירה ואווירה אחרי הגלישה' },
  { id: 2, name: 'בר/קפה על שיפוע Ski-in', type: 'אוכל', visited: false, emoji: '☕', note: 'לצהריים על המסלול' },
  { id: 3, name: "ספא / ג'קוזי במלון", type: 'רלקסיישן', visited: false, emoji: '🛁', note: 'לכל יום אחרי גלישה' },
  { id: 4, name: 'גונדולה לפסגה', type: 'תצפית', visited: false, emoji: '🚡', note: 'שקיעה מהפסגה = בלתי נשכחת' },
  { id: 5, name: 'שוק / עיר מקומית', type: 'קניות', visited: false, emoji: '🛍️', note: 'ביום ללא גלישה' },
  { id: 6, name: 'מסלול ביסלון / טיובינג', type: 'פעילות', visited: false, emoji: '🛷', note: 'כיף לכולם גם ללא גלישה' },
];

export const INIT_UPLOADS: UploadTask[] = [
  { id: 1, title: 'GoPro: Highlight מגלישות מגניבות', done: false, platform: 'Instagram / TikTok' },
  { id: 2, title: 'GoPro: וידאו מלא מהיום הטוב ביותר', done: false, platform: 'YouTube' },
  { id: 3, title: 'Garmin: ייצוא מסלולים ל-Strava', done: false, platform: 'Strava' },
  { id: 4, title: 'טלפון: אלבום תמונות משותף', done: false, platform: 'Google Photos' },
  { id: 5, title: 'Reels / TikTok מהחופשה', done: false, platform: 'Instagram / TikTok' },
  { id: 6, title: 'גיבוי כל הקבצים לענן', done: false, platform: 'Google Drive / iCloud' },
];

export const CATS = [
  { name: 'ביגוד סקי', emoji: '🧥', color: '#3b82f6' },
  { name: 'ציוד גלישה', emoji: '⛷️', color: '#6366f1' },
  { name: 'ערב ומלון', emoji: '🏨', color: '#f97316' },
  { name: 'פארם והיגיינה', emoji: '💊', color: '#ec4899' },
  { name: 'מסמכים ואלקטרוניקה', emoji: '📋', color: '#10b981' },
  { name: 'שומרי מסורת', emoji: '✡️', color: '#f59e0b' },
];

export const TIPS: Record<string, { t: string, d: string }[]> = {
  GoPro: [
    { t: '4K / 60fps לגלישה', d: 'בגלישה מהירה, 60fps מונע blur ומאפשר Slow Motion ×2. עבור ל-Protune לשליטה מלאה.' },
    { t: 'TimeWarp בגונדולה', d: 'TimeWarp 2.0 במהירות Auto – מושלם לנסיעות ארוכות בגונדולה ובאוטובוס.' },
    { t: 'HiLight Tagging', d: 'לחץ כפתור HiLight בזמן גלישה מגניבה – מסמן נקודה לעריכה מהירה אחר כך.' },
    { t: 'Color: Flat', d: 'בהגדרות Protune בחר Color: Flat – צבעים שטוחים לגמישות בעריכה.' },
    { t: 'CapCut / DaVinci', d: 'CapCut למהיר בנייד. DaVinci Resolve בחינם למחשב עם LUTs לסקי.' },
    { t: 'סוללה בקור', d: 'בקור קיצוני הסוללה מתרוקנת מהר – שמור על GoPro בתוך הכיס בין גלישות.' },
  ],
  Garmin: [
    { t: 'GPS Track & Export', d: 'Garmin Venu 4 עוקב GPS – ייצוא GPX מ-Garmin Connect ועשה Overlay על וידאו.' },
    { t: 'Garmin Connect', d: 'ראה מהירות מקסימלית, גובה ו-elevation gain מכל יום גלישה.' },
    { t: 'Strava Sync', d: 'סנכרן עם Strava לראות השוואה עם אחרים ולשתף הישגים.' },
    { t: 'Body Battery', d: 'עקוב אחרי Body Battery – אם ממש נמוך (מתחת ל-30) יום מנוחה מומלץ.' },
  ],
  Phone: [
    { t: 'Snapseed לתמונות', d: 'Snapseed: HDR + Tune Image = תמונות הר מדהימות בפחות מדקה.' },
    { t: 'Google Photos Backup', d: 'הפעל גיבוי אוטומטי – חבר WiFi של המלון בלילה.' },
    { t: 'Reels עם Transition', d: 'חתוך בתזמון עם מוזיקה, השתמש ב-Transition בין שוטים שונים.' },
    { t: 'שמור על הטלפון חם', d: 'הסוללה מתרוקנת מהר בקור – שמור טלפון בכיס פנימי ב-PowerBank.' },
  ],
};

export const PEOPLE = ['אבי', 'דני', 'יוסי', 'שרה'];
export const PC = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];
export const PRIO_CFG: Record<string, { label: string, color: string, dot: string }> = {
  urgent: { label: 'דחוף', color: '#f87171', dot: '#f87171' },
  medium: { label: 'בינוני', color: '#fbbf24', dot: '#fbbf24' },
  low: { label: 'נמוך', color: '#60a5fa', dot: '#60a5fa' }
};