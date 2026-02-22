import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './routes/Home';
import SkiDashboard from './routes/SkiDashboard';
// הוסף כאן routes נוספים בעתיד, כמו:
// import Projects from './routes/Projects';
import ProtectedRoute from './components/ProtectedRoute';



function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white font-heebo">
      <Navbar />
      <main className="pt-20"> {/* כדי שה-Navbar לא יכסה תוכן */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ski" element={
            <ProtectedRoute>
              <SkiDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;