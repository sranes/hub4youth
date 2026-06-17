import {
  BrainCircuit,
  Cloud,
  Code,
  Database,
  Globe,
  GraduationCap,
  LineChart,
  Palette,
  Shield,
  Smartphone,
  type LucideIcon,
} from 'lucide-react'
import React from 'react'

const ICONS: Record<string, LucideIcon> = {
  code: Code,
  globe: Globe,
  chart: LineChart,
  brain: BrainCircuit,
  cloud: Cloud,
  smartphone: Smartphone,
  shield: Shield,
  database: Database,
  palette: Palette,
}

export const CourseIcon: React.FC<{ name?: string | null; className?: string }> = ({
  name,
  className,
}) => {
  const Icon = (name && ICONS[name]) || GraduationCap
  return <Icon className={className} aria-hidden="true" />
}
