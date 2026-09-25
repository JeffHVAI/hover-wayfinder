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
import { FALLBACK_SITE, loadSiteConfig } from '../config';
import { loadMapData } from '../map/loadMapData';

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

  // Nav pane collapse/expand state
  isNavCollapsed: boolean;
  setIsNavCollapsed: (collapsed: boolean) => void;
  toggleNav: () => void;

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

  // Venue selection
  activeVenueId: string;
  setActiveVenueId: (id: string) => void;
  isVenueLoading: boolean;
  setIsVenueLoading: (loading: boolean) => void;
  switchVenue: (venueId: string) => Promise<void>;

  // Telemetry
  telemetry: TelemetryData;
  updateTelemetry: (partial: Partial<TelemetryData>) => void;
}

let lastNavToggleTime = 0;

export const useStore = create<AppStore>((set, get) => ({
  site: FALLBACK_SITE,
  setSite: (site) => set({ site }),

  activeVenueId: 'mall-a',
  setActiveVenueId: (activeVenueId) => set({ activeVenueId }),

  isVenueLoading: false,
  setIsVenueLoading: (isVenueLoading) => set({ isVenueLoading }),

  isNavCollapsed: false,
  setIsNavCollapsed: (isNavCollapsed) => {
    set({ isNavCollapsed });
    setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    setTimeout(() => window.dispatchEvent(new Event('resize')), 320);
  },
  toggleNav: () => {
    const now = Date.now();
    if (now - lastNavToggleTime < 350) return;
    lastNavToggleTime = now;
    const next = !get().isNavCollapsed;
    set({ isNavCollapsed: next });
    setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    setTimeout(() => window.dispatchEvent(new Event('resize')), 320);
  },

  switchVenue: async (venueId: string) => {
    set({ isVenueLoading: true, activeVenueId: venueId });
    try {
      const newSite = await loadSiteConfig(venueId);
      const url = new URL(window.location.href);
      url.searchParams.set('site', venueId);
      window.history.replaceState({}, '', url.toString());

      const data = await loadMapData(newSite);

      set({
        site: newSite,
        mapData: data,
        isVenueLoading: false,
        stack: [{ type: 'attract' }, { type: 'home' }],
        currentScreen: { type: 'home' },
        activeRoute: null,
        isNavCollapsed: false,
      });
    } catch (err: any) {
      console.error('Failed to switch venue map:', err);
      set({ isVenueLoading: false });
    }
  },

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

    try {
      window.history.pushState({ screen: screen.type }, '');
    } catch {
      // ignore
    }

    // Handle screen transition map updates
    if (screen.type === 'home' && controller) {
      controller.reset();
    } else if (screen.type === 'detail' && screen.selectedLocation && controller) {
      controller.focus(screen.selectedLocation);
    }
  },

  popScreen: () => {
    const now = Date.now();
    if (now - lastNavToggleTime < 350) return;
    lastNavToggleTime = now;
    const { stack, controller, resetToAttract } = get();
    if (stack.length <= 1) {
      resetToAttract();
      return;
    }
    const nextStack = stack.slice(0, -1);
    const currentScreen = nextStack[nextStack.length - 1];
    set({ stack: nextStack, currentScreen });

    if (currentScreen.type === 'home' && controller) {
      controller.reset();
    } else if (currentScreen.type === 'detail' && currentScreen.selectedLocation && controller) {
      controller.focus(currentScreen.selectedLocation);
    } else if (currentScreen.type === 'attract') {
      controller?.reset();
    }
  },

  resetToHome: () => {
    const now = Date.now();
    if (now - lastNavToggleTime < 350) return;
    lastNavToggleTime = now;
    const { controller } = get();
    controller?.reset();
    const homeState: ScreenState = { type: 'home' };
    set({
      stack: [{ type: 'attract' }, homeState],
      currentScreen: homeState,
      activeRoute: null,
      isIdleWarning: false,
      isNavCollapsed: false,
    });
  },

  resetToAttract: () => {
    const now = Date.now();
    if (now - lastNavToggleTime < 350) return;
    lastNavToggleTime = now;
    const { controller } = get();
    controller?.reset();
    const attractState: ScreenState = { type: 'attract' };
    set({
      stack: [attractState],
      currentScreen: attractState,
      activeRoute: null,
      isIdleWarning: false,
      isNavCollapsed: false,
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
