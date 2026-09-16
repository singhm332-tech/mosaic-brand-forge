import { cn } from "@/lib/utils";
import logoAsset from "@/assets/admosaic-logo.png.asset.json";
import logoLightAsset from "@/assets/admosaic-logo-light.png.asset.json";

export function Logo({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <img
      src={light ? logoLightAsset.url : logoAsset.url}
      alt="AdMosaic Marketing"
      width={358}
      height={88}
      className={cn("block h-auto w-auto object-contain", className)}
    />
  );
}