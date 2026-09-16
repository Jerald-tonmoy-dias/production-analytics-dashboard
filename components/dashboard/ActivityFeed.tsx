import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/lib/format";
import type { Activity } from "@/lib/schemas/activity";

type DashboardListState = "default" | "loading" | "error";

type ActivityFeedProps = {
  activities: Activity[];
  state?: DashboardListState;
};

function ActivityFeedSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="space-y-1.5">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function ActivityFeed({
  activities,
  state = "default",
}: ActivityFeedProps) {
  const empty = state === "default" && activities.length === 0;

  return (
    <Card className="h-full min-h-0 min-w-0">
      <CardHeader className="shrink-0">
        <CardTitle>Activity</CardTitle>
        <CardDescription>Latest system events.</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col">
        {state === "loading" ? (
          <div aria-busy="true" aria-live="polite">
            <ActivityFeedSkeleton />
          </div>
        ) : state === "error" ? (
          <ErrorState
            title="Couldn’t load activity"
            description="The feed failed to load. Try again in a moment."
            className="border-0 py-8"
          />
        ) : empty ? (
          <EmptyState
            title="No activity yet"
            description="System events will show up here as orders and customers change."
            className="border-0 py-8"
          />
        ) : (
          <div className="relative flex min-h-0 flex-1 flex-col">
            <ul className="divide-border min-h-0 flex-1 divide-y overflow-y-auto overscroll-contain pb-8">
              {activities.map((activity) => {
                const timestamp = (
                  <time
                    className="text-muted-foreground text-xs"
                    dateTime={activity.createdAt}
                  >
                    {formatDateTime(activity.createdAt)}
                  </time>
                );

                const message = activity.orderId ? (
                  <Link
                    href={`/orders/${activity.orderId}`}
                    className="rounded-sm text-sm underline-offset-4 outline-none hover:underline focus-visible:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {activity.message}
                  </Link>
                ) : (
                  <p className="text-sm">{activity.message}</p>
                );

                return (
                  <li
                    key={activity.id}
                    className="flex flex-col gap-1 py-2.5 first:pt-0 last:pb-0"
                  >
                    {timestamp}
                    {message}
                  </li>
                );
              })}
            </ul>
            <div
              aria-hidden="true"
              className="from-card pointer-events-none absolute inset-x-0 bottom-0 hidden h-8 bg-gradient-to-t to-transparent xl:block"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
