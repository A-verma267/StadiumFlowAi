import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    Product: ['Features', 'Dashboard', 'Booking', 'Simulation'],
    Company: ['About Us', 'Blog', 'Careers', 'Press'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
    Support: ['Help Center', 'Contact Us', 'Status', 'Community'],
  };

  return (
    <footer className="relative border-t border-white/5 pt-14 pb-8 px-4 sm:px-6 mt-8"
      style={{ background: 'rgba(5,8,17,0.95)' }}
    >
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #00d4ff 30%, #8b5cf6 70%, transparent 100%)' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Top section: Logo + Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-sm font-black text-white font-orbitron">
                SF
              </div>
              <div>
                <div className="font-orbitron font-bold text-base gradient-text">StadiumFlow AI</div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Live & Operational
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-4">
              The world's most advanced AI-powered stadium intelligence platform. Zero queues, instant tickets, live cricket scores.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {['𝕏', 'in', 'f', '▶'].map((icon, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-xs text-slate-400 hover:text-white hover:border-cyan-500/30 transition-colors"
                >
                  {icon}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <div className="text-xs font-semibold text-white uppercase tracking-wider mb-3">{category}</div>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-6" />

        {/* Bottom: Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {currentYear} StadiumFlow AI Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookie Policy</a>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>for cricket fans worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
