
export interface SupervisorData {
  name: string;
  critical: number;
  normal: number;
  totalHours: number;
  efficiency: number;
}

export interface TopicData {
  topic: string;
  hours: number;
  impact: string;
}

export interface IconProps {
  size?: number;
  className?: string;
}

export interface Workload {
  user_id: number;
  user_name: string;
  user_role: string;
  works: any;
}

export interface KPICardProps {
  title: string;
  value: string;
  subtext: string;
  icon: React.FC<IconProps>;
  colorClass: string;
  trend: "positive" | "negative";
}
