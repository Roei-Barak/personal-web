// Default INIT data for new users
module.exports = {
  items: [
    { cat: 'ביגוד סקי', name: 'חולצה תרמית (בסיס)', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=300&h=300&fit=crop' },
    { cat: 'ביגוד סקי', name: 'מכנס תרמי / גטקס', status: 'have', packed: false, optional: false, img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&h=300&fit=crop' },
    // ... (add all INIT_ITEMS here, no id, user_id)
  ],
  reminders: [
    { text: 'הזמן כרטיסי טיסה', done: false, priority: 'urgent', emoji: '✈️' },
    { text: 'הזמן מלון / Airbnb', done: false, priority: 'urgent', emoji: '🏨' },
    // ... (add all INIT_REMINDERS here)
  ],
  resorts: [
    { name: 'Zermatt', flag: '🇨🇭', country: 'שווייץ', flight: '€280–€420', pkg: '€1,800–€2,800 לאדם', level: 'כל הרמות', rating: 5, details: 'גובה 3,883מ׳. עונה ארוכה עד מאי. מטרהורן אייקוני. מסועי כבל מהמודרניים בעולם. Apres-ski מעולה. אין מכוניות בכפר.', lat: 46.0207, lng: 7.7491, airport: 'Zurich', airportCode: 'ZRH', airportLat: 47.4582, airportLng: 8.5516 },
    // ... (add all INIT_RESORTS here)
  ],
  insurance: [
    { name: 'כלל ביטוח', logo: '🛡️', medical: '$100,000', sports: true, cancel: true, cancelNote: 'ביטול עד 72 שעות', price: '~₪180', features: ['כיסוי רפואי מלא','פינוי ממסוק','הרחבה לסקי/סנובורד','ביטול טיסה','אובדן כבודה $1,500','עיכוב טיסה'], sports_detail: 'כולל: סקי, סנובורד, פרפר. לא כולל: Off-Piste ללא מדריך.', contact: '*2066 | kll.co.il' },
    // ... (add all INIT_INSURANCE here)
  ],
  places: [
    { name: 'כפר האפטר-סקי המרכזי', type: 'בילוי', visited: false, emoji: '🏔️', note: 'מוזיקה, בירה ואווירה אחרי הגלישה' },
    // ... (add all INIT_PLACES here)
  ],
  uploads: [
    { title: 'GoPro: Highlight מגלישות מגניבות', done: false, platform: 'Instagram / TikTok' },
    // ... (add all INIT_UPLOADS here)
  ]
};