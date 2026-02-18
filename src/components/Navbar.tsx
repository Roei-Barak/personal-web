import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, FolderOpen, Mail, CloudSnow } from 'lucide-react'; // שנה ל-Skiing אם Lucide אין CloudSnow

const navLinks = [
  { path: '/', label: 'בית', icon: HomeIcon },
  { path: '/ski', label: '⛷️ Ski Planner', icon: CloudSnow },
  { path: '/projects', label: 'פרויקטים', icon: FolderOpen },
  { path: '/contact', label: 'צור קשר', icon: Mail },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold tracking-tight">
          <span className="text-blue-400">ROEI</span>BARAK
        </Link>
        <div className="flex items-center gap-10 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 transition-colors hover:text-blue-400 ${
                location.pathname === link.path ? 'text-blue-400' : 'text-gray-300'
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </div>
        <a
          href="mailto:Roeibarak123@gmail.com"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
        >
          <Mail size={16} /> שלח מייל
        </a>
      </div>
    </nav>
  );
}