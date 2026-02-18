// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import SkiDashboard from './pages/SkiDashboard';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* דף הבית - הפורטפוליו הציבורי שלך */}
//         <Route path="/" element={<Home />} />
        
//         {/* דשבורד הסקי - נגיש בכתובת /ski */}
//         <Route path="/ski" element={<SkiDashboard />} />
        
//         {/* אופציונלי: ניתוב לכל כתובת לא מוכרת בחזרה לדף הבית */}
//         <Route path="*" element={<Home />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SkiDashboard from './pages/SkiDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* דף הפורטפוליו הראשי */}
        <Route path="/" element={<Home />} />
        
        {/* דף דשבורד סקי */}
        <Route path="/ski" element={<SkiDashboard />} />
        
        {/* ניתוב לכל דף אחר בחזרה לבית */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;