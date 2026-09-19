"use client";

import Link from "next/link";
import { Check, CircleDollarSign, Plus } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { showDemoToast } from "@/lib/demo-toast";
import { formatDateTime } from "@/lib/format";
import type { Activity } from "@/lib/schemas/activity";
import { cn } from "@/lib/utils";

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

function activityTone(message: string): {
  icon: typeof Check;
  className: string;
} {
  const lower = message.toLowerCase();
  if (lower.includes("payment")) {
    return {
      icon: CircleDollarSign,
      className:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400",
    };
  }
  if (lower.includes("created")) {
    return {
      icon: Plus,
      className:
        "bg-purple-100 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400",
    };
  }
  return {
    icon: Check,
    className:
      "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
  };
}

function renderMessage(message: string, orderId: string | null | undefined) {
  if (!orderId || !message.includes(orderId)) {
    return message;
  }
  const parts = message.split(orderId);
  return (
    <>
      {parts[0]}
      <span className="rounded border border-slate-200/60 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-slate-900 group-hover:border-primary/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
        {orderId}
      </span>
      {parts.slice(1).join(orderId)}
    </>
  );
}

export function ActivityFeed({
  activities,
  state = "default",
}: ActivityFeedProps) {
  const empty = state === "default" && activities.length === 0;

  return (
    <div className="bg-card flex h-full min-h-0 min-w-0 flex-col justify-between rounded-2xl border border-slate-200/80 p-6 shadow-sm dark:border-slate-800">
      <div>
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
              Activity
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Latest system events.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-primary/5 hover:text-primary dark:border-slate-700 dark:text-slate-300"
            onClick={() =>
              showDemoToast("Full activity stream is demo-only.")
            }
          >
            View all
          </button>
        </div>

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
          <div className="relative space-y-4 pl-6">
            <div
              className="absolute top-2 bottom-3 left-2.5 w-[1.5px] bg-slate-200 dark:bg-slate-800"
              aria-hidden="true"
            />
            <ul className="space-y-4">
              {activities.map((activity) => {
                const tone = activityTone(activity.message);
                const Icon = tone.icon;
                const body = (
                  <>
                    <div
                      className={cn(
                        "absolute -left-6 top-0.5 flex size-5 items-center justify-center rounded-full border-2 border-white shadow-xs transition-transform group-hover:scale-110 dark:border-slate-900",
                        tone.className
                      )}
                    >
                      <Icon className="size-2.5" aria-hidden="true" />
                    </div>
                    <div className="-my-1 rounded-xl p-2 transition group-hover:bg-primary/5 dark:group-hover:bg-slate-800/50">
                      <time
                        className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500"
                        dateTime={activity.createdAt}
                      >
                        {formatDateTime(activity.createdAt)}
                      </time>
                      <p className="mt-0.5 text-xs leading-snug font-medium text-slate-800 dark:text-slate-200">
                        {renderMessage(activity.message, activity.orderId)}
                      </p>
                    </div>
                  </>
                );

                return (
                  <li key={activity.id} className="relative">
                    {activity.orderId ? (
                      <Link
                        href={`/orders/${activity.orderId}`}
                        className="group relative block outline-none"
                      >
                        {body}
                      </Link>
                    ) : (
                      <div className="group relative">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
