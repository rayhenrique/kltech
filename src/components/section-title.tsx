import { cn } from "@/lib/utils";

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
}

export function SectionTitle({
  title,
  subtitle,
  align = "left",
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-2",
        {
          "text-left": align === "left",
          "text-center items-center": align === "center",
          "text-right items-end": align === "right",
        },
        className
      )}
      {...props}
    >
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-lg text-muted-foreground">{subtitle}</p>
      )}
      <div
        className={cn("h-1 w-20 rounded-full bg-blue-accent/80", {
          "mx-auto": align === "center",
          "ml-auto": align === "right",
        })}
      />
    </div>
  );
}
