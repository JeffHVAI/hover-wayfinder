export interface CameraSettings {
  home: {
    zoomLevel: number;
    bearing: number;
    pitch: number;
  };
  minZoom: number;
  maxZoom: number;
}

export interface SiteConfig {
  name: string;
  mapId: string;
  originExternalId: string;
  camera: CameraSettings;
  idle: {
    warnSeconds: number;
    resetSeconds: number;
  };
  layout: 'auto' | 'portrait' | 'landscape';
}

export interface LocationItem {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  hours?: string;
  floorId?: string;
  floorName?: string;
  categoryNames: string[];
  spaces: any[];
}

export interface CategoryItem {
  id: string;
  name: string;
  count: number;
  icon?: string;
}

export interface FloorItem {
  id: string;
  name: string;
  elevation: number;
  rawFloor: any;
}

export type ScreenType = 'attract' | 'home' | 'category' | 'results' | 'detail' | 'route' | 'probe';

export interface ScreenState {
  type: ScreenType;
  selectedCategory?: CategoryItem;
  selectedLocation?: LocationItem;
  searchQuery?: string;
}

export interface RouteStep {
  text: string;
  distanceMeters: number;
  action: string;
}

export interface RouteDetails {
  originName: string;
  destinationName: string;
  totalDistanceMeters: number;
  estimatedMinutes: number;
  steps: RouteStep[];
}

export interface TelemetryData {
  fps: number;
  mapLoadTimeMs: number;
  sdkVersion: string;
  lastError?: string;
  lastGestureTime: number;
}
