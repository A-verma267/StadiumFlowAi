import { motion } from 'framer-motion';
import { featuresData } from '../data/dummyData';

const colorMap = {
  blue: {
    gradient: 'from-cyan-500 to-blue-500',
    bg: 'from-cyan-500/10 to-blue-500/10',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    metric: 'bg-cyan-500/10 text-cyan-400',
  },
  cyan: {
    gradient: 'from-cyan-400 to-blue-400',
    bg: 'from-cyan-500/10 to-blue-400/10',
    border: 'border-cyan-400/20',
    text: 'text-cyan-400',
    metric: 'bg-cyan-500/10 text-cyan-400',
  },
  purple: {
    gradient: 'from-purple-500 to-pink-500',
    bg: 'from-purple-500/10 to-pink-500/10',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    metric: 'bg-purple-500/10 text-purple-400',
  },
  pink: {
    gradient: 'from-pink-500 to-orange-400',
    bg: 'from-pink-500/10 to-orange-400/10',
    border: 'border-pink-500/20',
    text: 'text-pink-400',
    metric: 'bg-pink-500/10 text-pink-400',
  },
  green: {
    gradient: 'from-emerald-400 to-cyan-400',
    bg: 'from-emerald-500/10 to-cyan-500/10',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    metric: 'bg-emerald-500/10 text-emerald-400',
  },
};

function FeatureCard({ feature, index }) {
  const c = colorMap[feature.color] || colorMap.blue;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.01 }}
      className={`glass-strong rounded-2xl sm:rounded-3xl p-5 sm:p-8 border ${c.border} relative overflow-hidden group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl sm:rounded-3xl`} />
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${c.gradient}`} />

      <div className="relative">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-11 sm:w-14 h-11 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${c.gradient} text-2xl sm:text-3xl mb-4 sm:mb-5 shadow-lg`}>
          {feature.icon}
        </div>

        <div className="mb-3 sm:mb-4">
          <h3 className="font-orbitron text-base sm:text-xl font-bold text-white mb-1">{feature.title}</h3>
          <div className={`text-xs sm:text-sm font-semibold ${c.text}`}>{feature.subtitle}</div>
        </div>

        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">{feature.description}</p>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {feature.metrics.map((m) => (
            <div key={m.label} className={`rounded-lg sm:rounded-xl p-2 sm:p-3 ${c.metric} text-center`}>
              <div className="font-orbitron font-bold text-sm sm:text-base">{m.value}</div>
              <div className="text-[9px] sm:text-[10px] mt-0.5 opacity-70 leading-tight">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const techStack = [
  { icon: '⚛️', name: 'React.js',      desc: 'Component UI'    },
  { icon: '🎨', name: 'Tailwind CSS',  desc: 'Design system'   },
  { icon: '🎬', name: 'Framer Motion', desc: 'Animations'       },
  { icon: '🧠', name: 'JS Engine',     desc: 'AI prediction'   },
  { icon: '🔄', name: 'Zustand',       desc: 'State mgmt'      },
  { icon: '🛣️', name: 'React Router',  desc: 'Navigation'      },
];

export default function Features() {
  return (
    <div className="min-h-screen animated-bg pt-16 sm:pt-20 pb-16 sm:pb-20 px-3 sm:px-4 lg:px-6 overflow-x-hidden">
      {/* Background glows */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-purple-500/5 blur-[80px] sm:blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-cyan-500/5 blur-[60px] sm:blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 sm:mb-16 pt-4 sm:pt-0">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass border border-cyan-500/20 mb-4 sm:mb-5">
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs text-cyan-400 font-medium uppercase tracking-wider">Core Technology • StadiumFlow AI</span>
          </div>
          <h1 className="font-orbitron text-2xl sm:text-3xl md:text-5xl font-black mb-3 sm:mb-5">
            Four Pillars of <span className="gradient-text">Antigravity</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-base max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
            Every component of StadiumFlow AI is engineered to eliminate friction and create a seamless, intelligent event experience that adapts to you — not the other way around.
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-14 sm:mb-20">
          {featuresData.map((feature, i) => (
            <FeatureCard key={feature.id} feature={feature} index={i} />
          ))}
        </div>

        {/* Tech Stack */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 sm:mb-16">
          <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
            Built With <span className="gradient-text">Modern Tech</span>
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {techStack.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, scale: 1.04 }}
                className="glass rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/5 text-center"
              >
                <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">{t.icon}</div>
                <div className="text-[10px] sm:text-xs font-bold text-white">{t.name}</div>
                <div className="text-[9px] sm:text-[10px] text-slate-500 mt-0.5">{t.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Architecture diagram */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-2xl sm:rounded-3xl border border-white/5 p-5 sm:p-8 md:p-12"
        >
          <h2 className="font-orbitron text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-10">
            Antigravity <span className="gradient-text">Architecture</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { title: 'Data Layer',       icon: '📡', items: ['Stadium sensors', 'Gate counters', 'Queue monitors', 'Historical data'],           color: 'cyan'   },
              { title: 'AI Engine',        icon: '🧠', items: ['Density prediction', 'Route optimization', 'Wait estimation', 'Alert generation'], color: 'purple', highlight: true },
              { title: 'Experience Layer', icon: '✨', items: ['Smart navigation', 'Queue suggestions', 'Real-time alerts', 'Zero-input UX'],      color: 'green'  },
            ].map((layer, i) => {
              const c = colorMap[layer.color] || colorMap.cyan;
              return (
                <motion.div
                  key={layer.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 ${layer.highlight ? `bg-gradient-to-br ${c.bg} border ${c.border}` : 'glass border border-white/5'}`}
                >
                  <div className="text-xl sm:text-2xl mb-2 sm:mb-3">{layer.icon}</div>
                  <h3 className={`font-orbitron font-bold text-sm sm:text-base mb-3 sm:mb-4 ${layer.highlight ? c.text : 'text-white'}`}>{layer.title}</h3>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {layer.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                        <span className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-gradient-to-r ${c.gradient} flex-shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
          <div className="hidden sm:flex items-center justify-center gap-4 mt-6">
            {['Data flows into AI →', '→ AI drives UX'].map((t) => (
              <motion.span key={t} className="text-xs text-slate-600 italic" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
                {t}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
