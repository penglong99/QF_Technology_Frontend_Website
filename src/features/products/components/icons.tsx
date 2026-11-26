import {
  BatteryFull,
  Camera,
  Cpu,
  Gamepad2,
  Gpu,
  HardDrive,
  Keyboard,
  Laptop,
  MemoryStick,
  Monitor,
  MonitorSmartphone,
  Printer,
  Server,
  Sparkles,
  Wifi,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { CategoryIcon, SpecKind } from '../types';

export const specIcons: Record<SpecKind, LucideIcon> = {
  processor: Cpu,
  memory: MemoryStick,
  storage: HardDrive,
  graphics: Gpu,
  display: Monitor,
  battery: BatteryFull,
  connectivity: Wifi,
  feature: Sparkles,
};

export const categoryIcons: Record<CategoryIcon, LucideIcon> = {
  laptop: Laptop,
  desktop: MonitorSmartphone,
  workstation: Server,
  gaming: Gamepad2,
  monitor: Monitor,
  component: Cpu,
  accessory: Keyboard,
  printer: Printer,
  cctv: Camera,
  service: Wrench,
};
