import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Activity, AlertTriangle, CheckCircle2, Clock, XCircle,
  Bug, Star, Wrench, ChevronRight, Info, Users, CalendarDays,
  TrendingUp, Filter,
} from 'lucide-react'
import { featureReleases } from '../data/featureReleases'
import type { Category, RiskLevel, ReleaseStatus, TeamName } from '../types'

// ─── Badge helpers ────────────────────────────────────────────────────────────

function RiskBadge({ level }: { level: RiskLevel }) {
  const map: Record<RiskLevel, { cls: string; dot: string; label: string }> = {
    Critical: { cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500', label: 'Critical' },
    High:     { cls: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500', label: 'High' },
    Medium:   { cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400', label: 'Medium' },
    Low:      { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', label: 'Low' },
  }
  const { cls, dot, label } = map[level]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${level === 'Critical' ? 'animate-pulse' : ''}`} />
      {label}
    </span>
  )
}

function StatusBadge({ status }: { status: ReleaseStatus }) {
  const map: Record<ReleaseStatus, { cls: string; icon: React.ReactNode }> = {
    'On Track':  { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" /> },
    'At Risk':   { cls: 'bg-orange-50 text-orange-700 border-orange-200',   icon: <AlertTriangle className="w-3 h-3" /> },
    'Delayed':   { cls: 'bg-red-50 text-red-700 border-red-200',            icon: <XCircle className="w-3 h-3" /> },
  }
  const { cls, icon } = map[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>
      {icon}
      {status}
    </span>
  )
}

function CategoryBadge({ category }: { category: Category }) {
  const map: Record<Category, { cls: string; icon: React.ReactNode }> = {
    'Bug':                    { cls: 'bg-red-50 text-red-600 border-red-200',     icon: <Bug className="w-3 h-3" /> },
    'Top Customer Feature Ask': { cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Star className="w-3 h-3" /> },
    'KTLO':                   { cls: 'bg-violet-50 text-violet-700 border-violet-200', icon: <Wrench className="w-3 h-3" /> },
  }
  const { cls, icon } = map[category]
  const short: Record<Category, string> = {
    'Bug': 'Bug',
    'Top Customer Feature Ask': 'Customer Feature',
    'KTLO': 'KTLO',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cls}`}>
      {icon}
      {short[category]}
    </span>
  )
}

function TeamChip({ team }: { team: TeamName }) {
  const map: Record<TeamName, string> = {
    Hardware: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    Software: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Quality:  'bg-purple-50 text-purple-700 border-purple-200',
  }
  return (
    <span className={`team-chip border ${map[team]}`}>
      {team}
    </span>
  )
}

function ProgressBar({ value }: { value: number }) {
  const color =
    value === 100 ? 'bg-emerald-500' :
    value >= 70  ? 'bg-brand-500' :
    value >= 40  ? 'bg-amber-400' :
    'bg-red-400'

  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="progress-bar flex-1">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-mono text-slate-500 tabular-nums w-7 text-right">{value}%</span>
    </div>
  )
}

// ─── KPI Cards ───────────────────────────────────────────────────────────────

const ALL_CATEGORIES: Category[] = ['Bug', 'Top Customer Feature Ask', 'KTLO']

export default function FeatureReleasePage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const filtered = activeCategory === 'All'
    ? featureReleases
    : featureReleases.filter(f => f.category === activeCategory)

  const kpis = {
    total:    featureReleases.length,
    onTrack:  featureReleases.filter(f => f.status === 'On Track').length,
    atRisk:   featureReleases.filter(f => f.status === 'At Risk').length,
    delayed:  featureReleases.filter(f => f.status === 'Delayed').length,
  }

  const handleAtRiskLink = (team: TeamName) => {
    navigate(`/sprints?team=${team}`)
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const isOverdue = (iso: string) => new Date(iso) < new Date('2026-06-28')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-50 border border-brand-100">
              <Activity className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Feature Release Health
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Q1–Q2 2026 · FleetVision Telematics · 3 Engineering Teams
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <Clock className="w-3.5 h-3.5" />
            <span>As of June 28, 2026</span>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="kpi-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Releases</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{kpis.total}</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-100">
                <TrendingUp className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Jan – Jun 2026</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">On Track</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">{kpis.onTrack}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Meeting committed dates</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">At Risk</p>
                <p className="text-3xl font-bold text-orange-700 mt-1">{kpis.atRisk}</p>
              </div>
              <div className="p-2 rounded-lg bg-orange-50">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">May slip target date</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Delayed</p>
                <p className="text-3xl font-bold text-red-700 mt-1">{kpis.delayed}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-50">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Past committed date</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-medium">Filter by category</span>
          </div>
          <div className="flex items-center gap-1.5">
            {(['All', ...ALL_CATEGORIES] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat === 'Top Customer Feature Ask' ? 'Customer Feature' : cat}
                {cat !== 'All' && (
                  <span className="ml-1.5 opacity-70">
                    ({featureReleases.filter(f => f.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Feature releases table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">
              Feature Releases
              <span className="ml-2 text-xs font-normal text-slate-400">({filtered.length} of {featureReleases.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Click a row to see risk details
            </p>
          </div>

          <table className="data-table w-full">
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Feature</th>
                <th style={{ width: '14%' }}>Category</th>
                <th style={{ width: '18%' }}>Teams</th>
                <th style={{ width: '10%' }}>Committed</th>
                <th style={{ width: '10%' }}>Progress</th>
                <th style={{ width: '9%' }}>Status</th>
                <th style={{ width: '11%' }}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(feature => {
                const isExpanded = expandedRow === feature.id
                const overdueCommit = isOverdue(feature.committedDate) && feature.status !== 'On Track'

                return (
                  <>
                    <tr
                      key={feature.id}
                      className="cursor-pointer"
                      onClick={() => setExpandedRow(isExpanded ? null : feature.id)}
                    >
                      <td>
                        <div className="flex items-start gap-2.5">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-slate-400">{feature.id}</span>
                              {isExpanded
                                ? <ChevronRight className="w-3 h-3 text-slate-400 rotate-90 transition-transform" />
                                : <ChevronRight className="w-3 h-3 text-slate-300 transition-transform" />
                              }
                            </div>
                            <p className="text-sm font-semibold text-slate-800 leading-snug mt-0.5">
                              {feature.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 font-mono">{feature.jiraEpic}</p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <CategoryBadge category={feature.category} />
                      </td>

                      <td>
                        <div className="flex flex-wrap gap-1">
                          {feature.teams.map(t => <TeamChip key={t} team={t} />)}
                        </div>
                      </td>

                      <td>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className={`w-3.5 h-3.5 shrink-0 ${overdueCommit ? 'text-red-400' : 'text-slate-400'}`} />
                          <span className={`text-xs font-medium tabular-nums ${overdueCommit ? 'text-red-600' : 'text-slate-700'}`}>
                            {formatDate(feature.committedDate)}
                          </span>
                        </div>
                        {feature.deliveredDate && (
                          <p className="text-[10px] text-slate-400 mt-0.5 ml-5">
                            Delivered {formatDate(feature.deliveredDate)}
                          </p>
                        )}
                      </td>

                      <td>
                        <ProgressBar value={feature.progress} />
                      </td>

                      <td>
                        <StatusBadge status={feature.status} />
                      </td>

                      <td>
                        <div className="space-y-2">
                          <RiskBadge level={feature.riskLevel} />
                          {feature.atRiskTeam && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAtRiskLink(feature.atRiskTeam!)
                              }}
                              className="flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-800 transition-colors group"
                              title={`View ${feature.atRiskTeam} team sprint metrics`}
                            >
                              <Users className="w-3 h-3 shrink-0" />
                              <span className="group-hover:underline">{feature.atRiskTeam} Sprints</span>
                              <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded risk detail row */}
                    {isExpanded && (
                      <tr key={`${feature.id}-detail`}>
                        <td colSpan={7} className="!py-0 !px-0">
                          <div className="mx-4 my-3 rounded-xl bg-slate-50 border border-slate-200 p-4">
                            <div className="grid grid-cols-3 gap-4">
                              {/* Description */}
                              <div className="col-span-2">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Info className="w-3.5 h-3.5 text-slate-500" />
                                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">{feature.description}</p>
                              </div>

                              {/* Risk analysis */}
                              <div className={`rounded-lg p-3 border ${
                                feature.riskLevel === 'Critical' ? 'bg-red-50 border-red-200' :
                                feature.riskLevel === 'High'     ? 'bg-orange-50 border-orange-200' :
                                feature.riskLevel === 'Medium'   ? 'bg-amber-50 border-amber-200' :
                                'bg-emerald-50 border-emerald-200'
                              }`}>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <AlertTriangle className={`w-3.5 h-3.5 ${
                                    feature.riskLevel === 'Critical' ? 'text-red-600' :
                                    feature.riskLevel === 'High'     ? 'text-orange-600' :
                                    feature.riskLevel === 'Medium'   ? 'text-amber-600' :
                                    'text-emerald-600'
                                  }`} />
                                  <span className="text-xs font-semibold text-slate-700">Risk Analysis</span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed">{feature.riskReason}</p>
                                {feature.atRiskTeam && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleAtRiskLink(feature.atRiskTeam!)
                                    }}
                                    className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors"
                                  >
                                    <BarChart3Icon />
                                    View {feature.atRiskTeam} Team Sprints
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-xs text-slate-500 pb-6">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Critical — immediate escalation required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span>High — close monitoring needed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Medium — plan mitigation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Low — on track</span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-brand-600">
            <Users className="w-3 h-3" />
            <span className="font-medium">Team links navigate to Sprint Metrics</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Inline icon to avoid import cycle
function BarChart3Icon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}
