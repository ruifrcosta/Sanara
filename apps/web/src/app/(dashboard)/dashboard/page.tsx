'use client';

import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ActivityList } from '@/components/dashboard/ActivityList';
import { AppointmentsChart } from '@/components/dashboard/AppointmentsChart';
import { SatisfactionChart } from '@/components/dashboard/SatisfactionChart';

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <StatsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentsChart />
        <SatisfactionChart />
      </div>
      <ActivityList />
    </div>
  );
} 