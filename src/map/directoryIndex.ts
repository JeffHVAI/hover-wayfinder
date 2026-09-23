import type { LocationItem, CategoryItem, FloorItem } from '../types';

export interface DirectoryIndex {
  locations: LocationItem[];
  categories: CategoryItem[];
  floors: FloorItem[];
  bySpaceId: Map<string, LocationItem>;
}

export function buildIndex(mapData: any): DirectoryIndex {
  const locations: LocationItem[] = [];
  const categoryCounts = new Map<string, number>();

  // Try enterprise-location first
  const enterpriseLocations = mapData.getByType('enterprise-location') || [];

  if (enterpriseLocations.length > 0) {
    enterpriseLocations.forEach((ent: any) => {
      if (!ent.name || !ent.spaces?.length) return;

      const catNames: string[] = [];
      if (ent.categories && Array.isArray(ent.categories)) {
        ent.categories.forEach((c: any) => {
          if (c.name) {
            catNames.push(c.name);
            categoryCounts.set(c.name, (categoryCounts.get(c.name) || 0) + 1);
          }
        });
      }
      if (catNames.length === 0) {
        catNames.push('General');
        categoryCounts.set('General', (categoryCounts.get('General') || 0) + 1);
      }

      const primarySpace = ent.spaces[0];
      locations.push({
        id: ent.id || primarySpace.id,
        name: ent.name,
        description: ent.description || '',
        logoUrl: ent.logo?.medium || ent.logo?.small || '',
        hours: ent.hours || '',
        floorId: primarySpace.floor?.id,
        floorName: primarySpace.floor?.name || `Level ${primarySpace.floor?.elevation ?? 1}`,
        categoryNames: catNames,
        spaces: ent.spaces,
      });
    });
  } else {
    // Fallback to named space objects and location profiles
    const spaces = mapData.getByType('space') || [];
    spaces.forEach((s: any) => {
      if (!s.name || !s.name.trim()) return;

      const profiles = s.locationProfiles || [];
      const primaryProfile = profiles[0] || null;

      const catNames: string[] = [];
      profiles.forEach((p: any) => {
        if (p.categories && Array.isArray(p.categories)) {
          p.categories.forEach((c: any) => {
            if (c.name && !catNames.includes(c.name)) {
              catNames.push(c.name);
              categoryCounts.set(c.name, (categoryCounts.get(c.name) || 0) + 1);
            }
          });
        }
      });
      if (catNames.length === 0) {
        catNames.push('General');
        categoryCounts.set('General', (categoryCounts.get('General') || 0) + 1);
      }

      locations.push({
        id: s.id,
        name: primaryProfile?.name || s.name,
        description: primaryProfile?.description || '',
        logoUrl: primaryProfile?.logo?.medium || primaryProfile?.logo?.small || '',
        hours: primaryProfile?.hours || '',
        floorId: s.floor?.id,
        floorName: s.floor?.name || `Level ${s.floor?.elevation ?? 1}`,
        categoryNames: catNames,
        spaces: [s],
      });
    });
  }

  // Sort locations alphabetically
  locations.sort((a, b) => a.name.localeCompare(b.name));

  // Build category list
  const categories: CategoryItem[] = [];
  categoryCounts.forEach((count, name) => {
    categories.push({
      id: name,
      name,
      count,
    });
  });
  categories.sort((a, b) => b.count - a.count);

  // Extract floors sorted by elevation
  const rawFloors = mapData.getByType('floor') || [];
  const floors: FloorItem[] = rawFloors.map((f: any) => ({
    id: f.id,
    name: f.name || `Level ${f.elevation ?? 0}`,
    elevation: f.elevation ?? 0,
    rawFloor: f,
  })).sort((a: FloorItem, b: FloorItem) => a.elevation - b.elevation);

  // Map space.id -> LocationItem
  const bySpaceId = new Map<string, LocationItem>();
  locations.forEach(loc => {
    loc.spaces.forEach(s => {
      bySpaceId.set(s.id, loc);
    });
  });

  return { locations, categories, floors, bySpaceId };
}
