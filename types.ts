import { LucideIcon } from 'lucide-react';

export enum AppType {
  PORTAL = 'PORTAL',
  AI_STUDIO = 'AI_STUDIO',
  AILM = 'AILM',
  AUTOML = 'AUTOML'
}

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive';
  access: AppType[];
}

export interface Project {
  id: string;
  name: string;
  status: 'Running' | 'Completed' | 'Failed' | 'Pending';
  owner: string;
  lastUpdated: string;
}
