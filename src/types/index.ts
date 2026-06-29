export type Category = 'Bug' | 'Top Customer Feature Ask' | 'KTLO';
export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type ReleaseStatus = 'Delayed' | 'At Risk' | 'On Track';
export type TeamName = 'Hardware' | 'Software' | 'Quality';
export type TicketType = 'Story' | 'Bug' | 'Task';
export type TicketStatus = 'To Do' | 'In Progress' | 'Done' | 'Blocked';

export interface JiraTicket {
  id: string;
  title: string;
  type: TicketType;
  storyPoints: number;
  status: TicketStatus;
  assignee: string;
  featureId: string;
}

export interface SprintData {
  id: string;
  name: string;
  team: TeamName;
  startDate: string;
  endDate: string;
  status: 'Completed' | 'Active' | 'Future';
  plannedPoints: number;
  completedPoints: number;
  carriedOver: number;
  bugsFound: number;
  blockedCount: number;
  velocity: number;
  tickets: JiraTicket[];
  featureIds: string[];
  goal: string;
}

export interface FeatureRelease {
  id: string;
  name: string;
  description: string;
  category: Category;
  teams: TeamName[];
  committedDate: string;
  deliveredDate?: string;
  status: ReleaseStatus;
  riskLevel: RiskLevel;
  riskReason: string;
  atRiskTeam?: TeamName;
  progress: number;
  jiraEpic: string;
}
