import { cn } from "@/lib/utils";

export function Logo({
  className,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span className={cn("relative block shrink-0 overflow-hidden", className)}>
      <img
        src="/AdMosaic_logo.png"
        alt="AdMosaic Marketing"
        width={500}
        height={500}
        className="absolute top-1/2 left-1/2 h-[568%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2"
      />
    </span>
  );
}