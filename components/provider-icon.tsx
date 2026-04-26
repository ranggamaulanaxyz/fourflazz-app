import type { Provider } from "@/types";
import {
  Smartphone,
  Signal,
  Wifi,
  Radio,
  Zap,
} from "lucide-react";

const providerIcons: Record<string, typeof Smartphone> = {
  telkomsel: Signal,
  xl: Wifi,
  indosat: Radio,
  tri: Smartphone,
  smartfren: Zap,
};

interface ProviderIconProps {
  provider: Provider;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { container: "h-8 w-8", icon: "h-4 w-4" },
  md: { container: "h-10 w-10", icon: "h-5 w-5" },
  lg: { container: "h-14 w-14", icon: "h-7 w-7" },
};

export function ProviderIcon({ provider, size = "md" }: ProviderIconProps) {
  const Icon = providerIcons[provider.id] ?? Smartphone;
  const s = sizes[size];

  return (
    <div
      className={`${s.container} rounded-xl flex items-center justify-center shrink-0`}
      style={{ backgroundColor: provider.color + "20", color: provider.color }}
    >
      <Icon className={s.icon} />
    </div>
  );
}
