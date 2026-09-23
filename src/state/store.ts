import { create } from 'zustand';
import type {
  SiteConfig,
  ScreenState,
  LocationItem,
  RouteDetails,
  FloorItem,
  TelemetryData,
} from '../types';
import type { MapController } from '../map/mapController';
import { FALLBACK_SITE } from '../config';

interface AppStore {
  site: SiteConfig;
  setSite: (site: SiteConfig) => void;

  mapData: any;
  setMapData: (data: any) => void;

  controller: MapController | null;
  setController: (ctrl: MapController) => void;

  // Screen stack & navigation
  stack: ScreenState[];
  currentScreen: ScreenState;
  pushScreen: (screen: ScreenState) => void;
  popScreen: () => void;
  resetToHome: () => void;
  resetToAttract: () => void;

  // Selected state
  currentFloor: FloorItem | null;
  setCurrentFloor: (floor: FloorItem | null) => void;
  activeRoute: RouteDetails | null;
  setActiveRoute: (route: RouteDetails | null) => void;

  // Idle tracking
  isIdleWarning: boolean;
  setIdleWarning: (warn: boolean) => void;
  lastActivityTime: number;
  recordActivity: () => void;

  // Helper actions
  openLocation: (loc: LocationItem) => void;
  openLocationForSpace: (space: any) => void;

  // Telemetry
  telemetry: TelemetryData;
  updateTelemetry: (partial: Partial<TelemetryData>) => void;
}

export const useStore = create<AppStore>((set, get) => ({
  site: FALLBACK_SITE,
  setSite: (site) => set({ site }),

  mapData: null,
  setMapData: (mapData) => set({ mapData }),

  controller: null,
  setController: (controller) => set({ controller }),

  stack: [{ type: 'attract' }],
  currentScreen: { type: 'attract' },

  pushScreen: (screen) => {
    const { stack, controller } = get();
    const nextStack = [...stack, screen];
    set({ stack: nextStack, currentScreen: screen });

    // Handle screen transition map updates
    if (screen.type === 'home' && controller) {
      controller.reset();
    } else if (screen.type === 'detail' && screen.selectedLocation && controller) {
      controller.focus(screen.selectedLocation);
    }
  },

  popScreen: () => {
    const { stack, controller } = get();
    if (stack.length <= 1) {
      // Stay on attract screen or home
      return;
    }
    const nextStack = stack.slice(0, -1);
    const currentScreen = nextStack[nextStack.length - 1];
    set({ stack: nextStack, currentScreen });

    if (currentScreen.type === 'home' && controller) {
      controller.reset();
    } else if (currentScreen.type === 'detail' && currentScreen.selectedLocation && controller) {
      controller.focus(currentScreen.selectedLocation);
    }
  },

  resetToHome: () => {
    const { controller } = get();
    controller?.reset();
    const homeState: ScreenState = { type: 'home' };
    set({
      stack: [homeState],
      currentScreen: homeState,
      activeRoute: null,
      isIdleWarning: false,
    });
  },

  resetToAttract: () => {
    const { controller } = get();
    controller?.reset();
    const attractState: ScreenState = { type: 'attract' };
    set({
      stack: [attractState],
      currentScreen: attractState,
      activeRoute: null,
      isIdleWarning: false,
    });
  },

  currentFloor: null,
  setCurrentFloor: (currentFloor) => set({ currentFloor }),

  activeRoute: null,
  setActiveRoute: (activeRoute) => set({ activeRoute }),

  isIdleWarning: false,
  setIdleWarning: (isIdleWarning) => set({ isIdleWarning }),

  lastActivityTime: Date.now(),
  recordActivity: () => set({ lastActivityTime: Date.now(), isIdleWarning: false }),

  openLocation: (loc) => {
    const { pushScreen } = get();
    pushScreen({
      type: 'detail',
      selectedLocation: loc,
    });
  },

  openLocationForSpace: (space) => {
    const { controller, openLocation } = get();
    if (!controller) return;
    const loc = controller.index.bySpaceId.get(space.id);
    if (loc) {
      openLocation(loc);
    }
  },

  telemetry: {
    fps: 60,
    mapLoadTimeMs: 0,
    sdkVersion: 'v6.11.0',
    lastGestureTime: Date.now(),
  },
  updateTelemetry: (partial) => {
    set({ telemetry: { ...get().telemetry, ...partial } });
  },
}));
