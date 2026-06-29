import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine, Cell,
} from 'recharts'
import {
  BarChart3, Cpu, Code2, FlaskConical, TrendingUp, TrendingDown,
  AlertCircle, CheckCircle2, Clock, Bug, ChevronRight, ArrowLeft,
  Zap, Target, Activity,
} from 'lucide-react'
import { hardwareSprints, softwareSprints, qualitySprints } from '../data/sprintData'
import type { SprintData, TeamName, TicketStatus } from '../types'

// ─── Team config ──────────────────────────────────────────────────────────────

const TEAMS: { name: TeamName; icon: React.ReactNode; color: string; bg: string; border: string }[] = [
  {
    name: 'Hardware',
    icon: <Cpu className="w-4 h-4" />,
    color: 'text-cyan-700',
    bg: 'bg-cyan-50',
    border: 'border-cyan-200',
  },
  {
    name: 'Software',
    icon: <Code2 className="w-4 h-4" />,
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
  },
  {
    name: 'Quality',
    icon: <FlaskConical className="w-4 h-4" />,
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
]

const TEAM_SPRINTS: Record<TeamName, SprintData[]> = {
  Hardware: hardwareSprints,
  Software: softwareSprints,
  Quality:  qualitySprints,
}

const TEAM_ACCENT: Record<TeamName, { planned: string; completed: string; avgLine: string }> = {
  Hardware: { planned: '#a5f3fc', completed: '#06b6d4', avgLine: '#0891b2' },
  Software: { planned: '#c7d2fe', completed: '#6366f1', avgLine: '#4f46e5' },
  Quality:  { planned: '#e9d5ff', completed: '#a855f7', avgLine: '#7c3aed' },
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: { value: number; name: string; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const planned   = payload.find(p => p.name === 'Planned')?.value ?? 0
  const completed = payload.find(p => p.name === 'Completed')?.value ?? 0
  const vel = planned > 0 ? Math.round((completed / planned) * 100) : 0

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card-lg p-3 text-xs min-w-[150px]">
      <p className="font-semibold text-slate-700 mb-2 border-b border-slate-100 pb-1.5">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ background: p.color }} />
            <span className="text-slate-600">{p.name}</span>
          </div>
          <span className="font-mono font-semibold text-slate-800">{p.value} pts</span>
        </div>
      ))}
      <div className="border-t border-slate-100 mt-1.5 pt-1.5 flex items-center justify-between">
        <span className="text-slate-500">Velocity</span>
        <span className={`font-mono font-bold ${vel >= 80 ? 'text-emerald-600' : vel >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
          {vel}%
        </span>
      </div>
    </div>
  )
}

// ─── Ticket status pill ───────────────────────────────────────────────────────

function TicketStatusPill({ status }: { status: TicketStatus }) {
  const map: Record<TicketStatus, string> = {
    'Done':        'bg-emerald-100 text-emerald-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    'To Do':       'bg-slate-100 text-slate-600',
    'Blocked':     'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[status]}`}>
      {status}
    </span>
  )
}

function TicketTypePill({ type }: { type: 'Story' | 'Bug' | 'Task' }) {
  const map = {
    Story: 'bg-green-50 text-green-700 border-green-200',
    Bug:   'bg-red-50 text-red-700 border-red-200',
    Task:  'bg-slate-50 text-slate-600 border-slate-200',
  }
  return (
    <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border ${map[type]}`}>
      {type}
    </span>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SprintMetricsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const teamParam = searchParams.get('team') as TeamName | null
  const defaultTeam: TeamName = (teamParam && TEAM_SPRINTS[teamParam]) ? teamParam : 'Software'
  const [selectedTeam, setSelectedTeam] = useState<TeamName>(defaultTeam)
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null)

  useEffect(() => {
    if (teamParam && TEAM_SPRINTS[teamParam as TeamName]) {
      setSelectedTeam(teamParam as TeamName)
    }
  }, [teamParam])

  const sprints = TEAM_SPRINTS[selectedTeam]
  const completedSprints = sprints.filter(s => s.status === 'Completed')
  const activeSprint = sprints.find(s => s.status === 'Active')

  // Chart data
  const chartData = sprints
    .filter(s => s.status !== 'Future')
    .map(s => ({
      name: s.name.replace(`${selectedTeam[0]}W` , 'S').replace('HW ', 'S').replace('SW ', 'S').replace('QA ', 'S').split(' ').slice(-2).join(' '),
      Planned: s.plannedPoints,
      Completed: s.completedPoints,
      velocity: s.velocity,
      status: s.status,
    }))

  const avgVelocity = completedSprints.length
    ? Math.round(completedSprints.reduce((a, b) => a + b.velocity, 0) / completedSprints.length)
    : 0

  const totalBugs = completedSprints.reduce((a, s) => a + s.bugsFound, 0) + (activeSprint?.bugsFound ?? 0)
  const totalBlocked = completedSprints.reduce((a, s) => a + s.blockedCount, 0) + (activeSprint?.blockedCount ?? 0)
  const totalPointsDelivered = completedSprints.reduce((a, s) => a + s.completedPoints, 0) + (activeSprint?.completedPoints ?? 0)

  const accent = TEAM_ACCENT[selectedTeam]

  // Selected sprint for ticket detail
  const detailSprint = selectedSprintId
    ? sprints.find(s => s.id === selectedSprintId)
    : activeSprint

  const teamConfig = TEAMS.find(t => t.name === selectedTeam)!

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  const referredFrom = searchParams.get('team')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sprint Metrics</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                JIRA sprint data · Jan – Jun 2026 · 13 sprints per team
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {referredFrom && (
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Feature Releases
              </button>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Sprint 13 active · Jun 22 – Jul 3</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Team selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">Team</span>
          {TEAMS.map(team => (
            <button
              key={team.name}
              onClick={() => {
                setSelectedTeam(team.name)
                setSelectedSprintId(null)
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                selectedTeam === team.name
                  ? `${team.bg} ${team.color} ${team.border} shadow-sm`
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {team.icon}
              {team.name}
            </button>
          ))}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="kpi-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Velocity</p>
                <p className={`text-3xl font-bold mt-1 ${
                  avgVelocity >= 80 ? 'text-emerald-600' :
                  avgVelocity >= 65 ? 'text-amber-600' : 'text-red-600'
                }`}>{avgVelocity}%</p>
              </div>
              <div className={`p-2 rounded-lg ${avgVelocity >= 80 ? 'bg-emerald-50' : avgVelocity >= 65 ? 'bg-amber-50' : 'bg-red-50'}`}>
                {avgVelocity >= 80
                  ? <TrendingUp className="w-4 h-4 text-emerald-600" />
                  : <TrendingDown className="w-4 h-4 text-red-600" />
                }
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Across {completedSprints.length} completed sprints</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Points Delivered</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{totalPointsDelivered}</p>
              </div>
              <div className="p-2 rounded-lg bg-brand-50">
                <Target className="w-4 h-4 text-brand-600" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Story points completed YTD</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-red-500 uppercase tracking-wider">Bugs Found</p>
                <p className="text-3xl font-bold text-red-700 mt-1">{totalBugs}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-50">
                <Bug className="w-4 h-4 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Across all sprints (YTD)</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Blocked Items</p>
                <p className="text-3xl font-bold text-orange-700 mt-1">{totalBlocked}</p>
              </div>
              <div className="p-2 rounded-lg bg-orange-50">
                <AlertCircle className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Total blocked ticket-sprints</p>
          </div>
        </div>

        {/* Velocity trend + active sprint */}
        <div className="grid grid-cols-3 gap-4">
          {/* Velocity bar chart - spans 2 cols */}
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-card">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Sprint Velocity Trend</h3>
                <p className="text-xs text-slate-400 mt-0.5">Planned vs. Completed story points</p>
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${teamConfig.bg} ${teamConfig.color} ${teamConfig.border}`}>
                {teamConfig.icon}
                {selectedTeam} Team
              </div>
            </div>
            <div className="px-5 py-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap="30%" barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: string) => v.replace('Sprint ', 'S')}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.04)' }} />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                    iconType="square"
                    iconSize={8}
                  />
                  <ReferenceLine
                    y={avgVelocity > 0 ? Math.round(completedSprints.reduce((a,b) => a + b.plannedPoints, 0) / completedSprints.length) : 0}
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    strokeWidth={1}
                    label={{ value: 'Avg Plan', position: 'right', fontSize: 9, fill: '#94a3b8' }}
                  />
                  <Bar dataKey="Planned" fill={accent.planned} radius={[3, 3, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.status === 'Active' ? '#ddd6fe' : accent.planned}
                        opacity={entry.status === 'Active' ? 0.6 : 1}
                      />
                    ))}
                  </Bar>
                  <Bar dataKey="Completed" fill={accent.completed} radius={[3, 3, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.status === 'Active' ? accent.completed : accent.completed}
                        opacity={entry.status === 'Active' ? 0.5 : 1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Velocity health bar */}
            <div className="px-5 pb-4 flex items-center gap-3">
              <span className="text-xs text-slate-500 shrink-0">Sprint health</span>
              <div className="flex flex-1 gap-0.5 h-2 rounded-full overflow-hidden">
                {completedSprints.map(s => (
                  <div
                    key={s.id}
                    className={`flex-1 ${
                      s.velocity >= 80 ? 'bg-emerald-400' :
                      s.velocity >= 60 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    title={`${s.name}: ${s.velocity}%`}
                  />
                ))}
                {activeSprint && (
                  <div className="flex-1 bg-brand-300 opacity-60 animate-pulse" title="Active sprint" />
                )}
              </div>
              <span className={`text-xs font-bold tabular-nums ${
                avgVelocity >= 80 ? 'text-emerald-600' : avgVelocity >= 65 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {avgVelocity}% avg
              </span>
            </div>
          </div>

          {/* Active sprint panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-card">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-semibold text-slate-800">Active Sprint</h3>
              {activeSprint && (
                <span className="ml-auto text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  LIVE
                </span>
              )}
            </div>

            {activeSprint ? (
              <div className="px-5 py-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-800">{activeSprint.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatDate(activeSprint.startDate)} – {formatDate(activeSprint.endDate)}
                  </p>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 leading-relaxed">
                  <span className="font-semibold text-slate-700">Goal: </span>
                  {activeSprint.goal}
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-600">Completion</span>
                    <span className="text-xs font-bold text-slate-800 tabular-nums">
                      {activeSprint.completedPoints}/{activeSprint.plannedPoints} pts
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        activeSprint.velocity < 60 ? 'bg-red-400' :
                        activeSprint.velocity < 80 ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (activeSprint.completedPoints / activeSprint.plannedPoints) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-slate-400">~43% sprint time elapsed</span>
                    <span className={`text-[10px] font-semibold ${
                      activeSprint.velocity < 60 ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {Math.round((activeSprint.completedPoints / activeSprint.plannedPoints) * 100)}% done
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Bugs', value: activeSprint.bugsFound, color: 'text-red-600' },
                    { label: 'Blocked', value: activeSprint.blockedCount, color: 'text-orange-600' },
                    { label: 'Carried', value: activeSprint.carriedOver, color: 'text-slate-600' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center bg-slate-50 rounded-lg py-2 border border-slate-100">
                      <p className={`text-lg font-bold ${color}`}>{value}</p>
                      <p className="text-[10px] text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Tickets */}
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Tickets ({activeSprint.tickets.length})
                  </p>
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto scrollbar-hidden">
                    {activeSprint.tickets.map(ticket => (
                      <div key={ticket.id} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-mono text-slate-400">{ticket.id}</span>
                            <TicketTypePill type={ticket.type} />
                          </div>
                          <p className="text-[11px] text-slate-700 mt-0.5 leading-snug line-clamp-2">{ticket.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{ticket.assignee}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <TicketStatusPill status={ticket.status} />
                          <span className="text-[10px] font-mono text-slate-500">{ticket.storyPoints}p</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-5 py-8 text-center text-sm text-slate-400">
                No active sprint
              </div>
            )}
          </div>
        </div>

        {/* Sprint history table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Sprint History</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedTeam} team · {sprints.length} sprints · Jan 5 – Jul 3, 2026
              </p>
            </div>
            <p className="text-xs text-slate-400">Click row to see tickets</p>
          </div>
          <table className="data-table w-full">
            <thead>
              <tr>
                <th style={{ width: '12%' }}>Sprint</th>
                <th style={{ width: '32%' }}>Goal</th>
                <th style={{ width: '12%' }}>Dates</th>
                <th style={{ width: '8%' }}>Planned</th>
                <th style={{ width: '8%' }}>Done</th>
                <th style={{ width: '10%' }}>Velocity</th>
                <th style={{ width: '6%' }}>Bugs</th>
                <th style={{ width: '6%' }}>Blocked</th>
                <th style={{ width: '6%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[...sprints].reverse().map(sprint => {
                const isSelected = selectedSprintId === sprint.id
                const vel = sprint.velocity
                return (
                  <>
                    <tr
                      key={sprint.id}
                      onClick={() => setSelectedSprintId(isSelected ? null : sprint.id)}
                      className={`cursor-pointer ${isSelected ? 'bg-brand-50' : ''}`}
                    >
                      <td>
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                          <span className="text-xs font-semibold text-slate-700 font-mono">{sprint.id}</span>
                        </div>
                        {sprint.status === 'Active' && (
                          <span className="ml-5 inline-flex items-center gap-1 text-[10px] font-semibold text-brand-600">
                            <Zap className="w-2.5 h-2.5" />
                            Active
                          </span>
                        )}
                      </td>

                      <td>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-snug">{sprint.goal}</p>
                      </td>

                      <td>
                        <p className="text-xs text-slate-600 tabular-nums">
                          {formatDate(sprint.startDate)} –<br />
                          {formatDate(sprint.endDate)}
                        </p>
                      </td>

                      <td>
                        <span className="text-xs font-mono font-semibold text-slate-700">{sprint.plannedPoints}</span>
                      </td>

                      <td>
                        <span className="text-xs font-mono font-semibold text-slate-700">{sprint.completedPoints}</span>
                        {sprint.carriedOver > 0 && (
                          <p className="text-[10px] text-orange-500 mt-0.5">+{sprint.carriedOver} CO</p>
                        )}
                      </td>

                      <td>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  vel >= 80 ? 'bg-emerald-500' :
                                  vel >= 60 ? 'bg-amber-400' : 'bg-red-400'
                                }`}
                                style={{ width: `${Math.min(100, vel)}%` }}
                              />
                            </div>
                          </div>
                          <span className={`text-xs font-bold tabular-nums ${
                            vel >= 80 ? 'text-emerald-600' :
                            vel >= 60 ? 'text-amber-600' : 'text-red-600'
                          }`}>{vel}%</span>
                        </div>
                      </td>

                      <td>
                        <span className={`text-xs font-semibold ${sprint.bugsFound > 5 ? 'text-red-600' : sprint.bugsFound > 2 ? 'text-orange-600' : 'text-slate-600'}`}>
                          {sprint.bugsFound}
                        </span>
                      </td>

                      <td>
                        <span className={`text-xs font-semibold ${sprint.blockedCount > 3 ? 'text-red-600' : sprint.blockedCount > 0 ? 'text-orange-500' : 'text-slate-400'}`}>
                          {sprint.blockedCount}
                        </span>
                      </td>

                      <td>
                        {sprint.status === 'Completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : sprint.status === 'Active' ? (
                          <div className="w-4 h-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-300" />
                        )}
                      </td>
                    </tr>

                    {/* Expanded ticket rows */}
                    {isSelected && sprint.tickets.length > 0 && (
                      <tr key={`${sprint.id}-tickets`}>
                        <td colSpan={9} className="!py-0 !px-0">
                          <div className="mx-4 my-3 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
                            <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-slate-600">
                                Sprint Tickets — {sprint.name}
                              </span>
                              <span className="text-[10px] text-slate-400">({sprint.tickets.length} tickets)</span>
                            </div>
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-slate-200">
                                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-[10%]">ID</th>
                                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-[40%]">Title</th>
                                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-[10%]">Type</th>
                                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-[8%]">Pts</th>
                                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-[16%]">Assignee</th>
                                  <th className="text-left px-4 py-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-[16%]">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sprint.tickets.map(t => (
                                  <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-100/50 transition-colors">
                                    <td className="px-4 py-2 font-mono text-[10px] text-slate-400">{t.id}</td>
                                    <td className="px-4 py-2 text-[11px] text-slate-700">{t.title}</td>
                                    <td className="px-4 py-2"><TicketTypePill type={t.type} /></td>
                                    <td className="px-4 py-2 font-mono font-semibold text-slate-700">{t.storyPoints}</td>
                                    <td className="px-4 py-2 text-[11px] text-slate-600">{t.assignee}</td>
                                    <td className="px-4 py-2"><TicketStatusPill status={t.status} /></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
      </div>
    </div>
  )
}
