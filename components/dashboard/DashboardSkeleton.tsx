import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { PageHeaderSkeleton } from "@/components/shared/PageSkeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CHART_WINDOW_DAYS } from "@/lib/constants";

function ChartSkeleton({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Last {CHART_WINDOW_DAYS} UTC days</CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full" />
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <PageHeaderSkeleton />
      <section
        aria-label="Key metrics"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard label="Total revenue" format="currency" state="loading" />
        <KpiCard label="Orders" format="number" state="loading" />
        <KpiCard label="Active customers" format="number" state="loading" />
        <KpiCard label="Conversion rate" format="percent" state="loading" />
      </section>
      <section aria-label="Trends" className="grid gap-4 lg:grid-cols-2">
        <ChartSkeleton title="Revenue" />
        <ChartSkeleton title="Orders" />
      </section>
      <section
        aria-label="Recent orders and activity"
        className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
      >
        <div className="min-w-0">
          <RecentOrders orders={[]} state="loading" />
        </div>
        <ActivityFeed activities={[]} state="loading" />
      </section>
    </div>
  );
}
