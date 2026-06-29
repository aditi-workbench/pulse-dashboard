import { NavLink, useLocation } from 'react-router-dom'
import { Activity, LayoutDashboard, BarChart3, ChevronRight } from 'lucide-react'

const navItems = [
  {
    label: 'Feature Releases',
    path: '/',
    icon: LayoutDashboard,
    description: 'Release health & risk',
    exact: true,
  },
  {
    label: 'Sprint Metrics',
    path: '/sprints',
    icon: BarChart3,
    description: 'Team velocity & JIRA',
    exact: false,
  },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="pulse-sidebar w-64 min-h-screen flex flex-col border-r border-white/5 shrink-0">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-brand-600 pulse-glow">
            <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-sidebar-bg animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold tracking-tight text-white leading-none">
              PULSE
            </h1>
            <p className="text-[10px] font-medium text-slate-500 tracking-widest uppercase mt-0.5">
              Release Monitor
            </p>
          </div>
        </div>

        <div className="mt-4 px-3 py-2 rounded-lg bg-white/4 border border-white/6">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Company</p>
          <p className="text-xs font-medium text-slate-300 mt-0.5">FleetVision Technologies</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Telematics Division</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
          Navigation
        </p>
        {navItems.map(({ label, path, icon: Icon, description, exact }) => {
          const isActive = exact
            ? location.pathname === path
            : location.pathname.startsWith(path)

          return (
            <NavLink
              key={path}
              to={path}
              className={`nav-item group ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[13px]">{label}</span>
                  <ChevronRight
                    className={`w-3 h-3 shrink-0 transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
                    }`}
                  />
                </div>
                <p className={`text-[10px] mt-0.5 truncate transition-colors ${
                  isActive ? 'text-brand-400/70' : 'text-slate-600 group-hover:text-slate-500'
                }`}>
                  {description}
                </p>
              </div>
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] text-slate-500">Live · Updated just now</span>
        </div>
        <p className="text-[10px] text-slate-700 leading-relaxed">
          Data reflects Jan – Jun 2026 sprint cycle. Engineering window: Q1–Q2 2026.
        </p>
        <p className="text-[10px] text-slate-700 mt-1">v1.0.0</p>
      </div>
    </aside>
  )
}
