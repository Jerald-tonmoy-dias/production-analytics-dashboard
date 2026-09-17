import { customerInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

type CustomerAvatarProps = {
  name: string;
  className?: string;
};

/**
 * Initials mark for a customer row. Presentation only — no image URLs.
 */
export function CustomerAvatar({ name, className }: CustomerAvatarProps) {
  return (
    <span
      className={cn(
        "bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-semibold tabular-nums",
        className
      )}
      aria-hidden="true"
    >
      {customerInitials(name)}
    </span>
  );
}
