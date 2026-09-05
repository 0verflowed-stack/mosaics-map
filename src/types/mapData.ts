interface Category {
    id: number; 
    group_id: number; 
    title: string; 
    icon: string; 
    info: null | string; 
    template: null | string; 
    order: number; 
    has_heatmap: boolean; 
    features_enabled: boolean; 
    display_type: string; 
    ign_enabled: boolean; 
    ign_visible: boolean; 
    visible: boolean; 
    description: null | string; 
    premium: boolean; 
}

export interface MapData {
    maps: Array<{
        id: number;
        title: string;
        slug: string;
    }>;
    map: {
        id: number;
        title: string;
        slug: string;
    };
    groups: Array<{
        id: number;
        game_id: number;
        title: string;
        order: number;
        color: string;
        expandable: boolean;
        categories: Array<Category>;
    }>;
    categories: Record<string, Category>;
    regions: Array<{
        id: number;
        map_id: number;
        parent_region_id: null | number;
        title: string;
        subtitle: null | string;
        features: Array<{
            id: number;
            type: string;
            geometry: {
                coordinates: Array<
                    Array<[number, number]>
                >;
                type: string;
            };
            properties: {
                id: number;
            }
        }>;
        center_x: null | number;
        center_y: null | number;
        order: number;
    }>;
    locations: Array<{
        id: number;
        map_id: number;
        region_id: number;
        category_id: number;
        title: string;
        description: null | string;
        latitude: number;
        longitude: number;
        features: null | string;
        ign_page_id: null | number;
        tags: [];
        media: Array<{
            id: number;
            title: string;
            file_name: string;
            attribution: string;
            url: string;
            type: string;
            mime_type: string;
            meta: null;
            order: number
        }>;
        category: {
            id: number;
            group_id: number;
            title: string;
            icon: string;
            info: null | string;
            template: null | string;
            order: number;
            has_heatmap: boolean;
            features_enabled: boolean;
            display_type: string;
            ign_enabled: boolean;
            ign_visible: boolean;
            visible: boolean;
            description: null | string;
            premium: boolean
        }
    }>;
    heatmapGroups: [];
    heatmapCategories: [];
    routes: [];
    notes: Array<{
        id: number;
        latitude: number;
        longitude: number;
        title: number;
        description: number;
    }>;
    sharedNotes: {};
    maxMarkedLocations: number;
    tags: [];
    tagsById: [];
    distanceToolConfig: null;
    mapConfig: {
        tile_sets: Array<
            {
                id: number;
                map_id: number;
                name: string;
                path: string;
                extension: string;
                pattern: string;
                min_zoom: number;
                max_zoom: number;
                order: number;
                bounds: [number, number, number, number]
            }
        >;
        initial_zoom: number;
        start_lat: number;
        start_lng: number;
        overlay: null;
        overzoom: boolean
    };
    proCategoryLocationCounts: [];
    searchQuery: null;
    presets: [];
    styles: {
        textStyles: {};
        lineStyles: {};
        regionStyles: Record<number, {
            'text-color': string;
            'text-halo-color': string;
            'line-color': string;
            'line-width': 2;
            'fill-color': string;
            'fill-opacity': [
                string,
                [
                    string,
                    [
                        string,
                        string
                    ],
                    boolean
                ],
                number,
                number
            ]
        }>;
    }
}