import { useState, ReactNode } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet/hooks'
import L from 'leaflet';
import mapDataNoType from './mapData.json';
import 'leaflet/dist/leaflet.css';
import { MapData } from '../../types/mapData';

const mapData = mapDataNoType as unknown as MapData;

const baseUrl = window.location.href.includes('localhost') ? '' : '/mosaics-map';

const MapViewEvents = ({ children }: { children: ReactNode }) => {
  useMapEvents({
      contextmenu: (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        L.popup()
          .setLatLng(e.latlng)
          .setContent(`latitude: ${lat}, longitude: ${lng}`)
          .openOn(e.target);
      },
    });

    return children;
}

const MapView = () => {
  const initialZoom = mapData.mapConfig.initial_zoom || 4;
  const startLat = mapData.mapConfig.start_lat || 0;
  const startLng = mapData.mapConfig.start_lng || 0;

  const [activeCategories, setActiveCategories] = useState(['11899']);

  const getCategoryIcon = (categoryId: number) => {
    const category = mapData.categories[categoryId];
    return L.icon({
      iconUrl: `${baseUrl}/icons/${category.icon}.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
  };

  const toggleCategory = (categoryId: string) => {
    setActiveCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const tileUrl = `./${mapData.mapConfig.tile_sets[0].pattern}`;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="map-view">
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Hide Categories' : 'Show Categories'}
      </button>

      {isSidebarOpen && (
        <div className="sidebar">
          <h2>Categories</h2>
          <ul className="category-list">
            {Object.values(mapData.categories).map((category) => (
              <li key={category.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={activeCategories.includes(category.id.toString())}
                    onChange={() => toggleCategory(category.id.toString())}
                  />
                  <span className="category-title">
                    {category.icon && (
                      <img
                        src={`${baseUrl}/icons/${category.icon}.png`}
                        alt={category.title}
                        className="category-icon"
                      />
                    )}
                    {category.title}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      <MapContainer
        center={[startLat, startLng]}
        zoom={initialZoom}
        style={{ height: '100vh', width: '100%' }}
      >
        <MapViewEvents>
          <TileLayer
            url={tileUrl}
            minZoom={mapData.mapConfig.tile_sets[0].min_zoom}
            maxZoom={mapData.mapConfig.tile_sets[0].max_zoom}
            attribution="&copy; Your Attribution"
          />

          {mapData.regions.map((region) =>
            region.features.map((feature) => {
              const coordinates = feature.geometry.coordinates[0].map((coord) => [coord[1], coord[0]] as [number, number]);
              const style = mapData.styles.regionStyles[region.id] || {};

              return (
                <Polygon
                  key={feature.id}
                  positions={coordinates}
                  pathOptions={{
                    color: style['line-color'] || 'blue',
                    fillColor: style['fill-color'] || 'blue',
                    fillOpacity: 0 //style['fill-opacity'] || 0,
                  }}
                />
              );
            })
          )}

          {mapData.locations
            .filter((location) => activeCategories.includes(location.category_id.toString()))
            .map((location) => (
              <Marker
                key={location.id}
                position={[location.latitude, location.longitude]}
                icon={getCategoryIcon(location.category_id)}
              >
                <Popup>
                  <h3>{location.title}</h3>
                  <p>{location.description}</p>
                  {location.media &&
                    location.media.map((mediaItem) => (
                      <img key={mediaItem.id} src={`${mediaItem.url}`} alt={mediaItem.title} style={{ width: '-webkit-fill-available' }} />
                    ))}
                </Popup>
              </Marker>
            ))}

          {mapData.notes.map((note) => (
            <Marker key={note.id} position={[note.latitude, note.longitude]}>
              <Popup>
                <h3>{note.title}</h3>
                <p>{note.description}</p>
              </Popup>
            </Marker>
          ))}
        </MapViewEvents>
      </MapContainer>
    </div>
  );
};

export default MapView;