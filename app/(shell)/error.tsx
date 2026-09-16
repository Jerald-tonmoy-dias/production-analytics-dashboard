"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/ErrorState";

export default function ShellError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <ErrorState
      title="Something went wrong"
      description="This page failed to load. You can try again."
    >
      <Button onClick={() => retry()}>Try again</Button>
    </ErrorState>
  );
}
