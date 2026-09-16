import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  description,
  children,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border px-6 py-12 text-center",
        className
      )}
    >
      <CircleAlert
        className="text-destructive size-5"
        aria-hidden="true"
      />
      <p className="font-medium">{title}</p>
      {description ? (
        <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      ) : null}
      {children ? <div className="mt-2">{children}</div> : null}
    </div>
  );
}
