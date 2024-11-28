import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import mapData from './mapData.json';
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const initialZoom = mapData.mapConfig.initial_zoom || 4;
  const startLat = mapData.mapConfig.start_lat || 0;
  const startLng = mapData.mapConfig.start_lng || 0;

  const [activeCategories, setActiveCategories] = useState(['11899']); // Object.keys(mapData.categories)

  const getCategoryIcon = (categoryId) => {
    const category = mapData.categories[categoryId];
    return L.icon({
      iconUrl: `${window.location.href.includes('localhost') ? '' : '/mosaics-map'}/icons/${category.icon}.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
  };

  const toggleCategory = (categoryId) => {
    setActiveCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const tileUrl = `https://tiles.mapgenie.io/games/${mapData.mapConfig.tile_sets[0].pattern}`;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="map-view">
      {/* Sidebar Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Hide Categories' : 'Show Categories'}
      </button>

      {/* Sidebar */}
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
                  {/* Optional: Add icon next to category title */}
                  <span className="category-title">
                    {category.icon && (
                      <img
                        src={`${window.location.href.includes('localhost') ? '' : '/mosaics-map'}/icons/${category.icon}.png`}
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


      {/* Map */}
      <MapContainer center={[startLat, startLng]} zoom={initialZoom} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url={tileUrl}
          minZoom={mapData.mapConfig.tile_sets[0].min_zoom}
          maxZoom={mapData.mapConfig.tile_sets[0].max_zoom}
          attribution="&copy; Your Attribution"
        />

        {/* Regions */}
        {mapData.regions.map((region) =>
          region.features.map((feature) => {
            const coordinates = feature.geometry.coordinates[0].map((coord) => [coord[1], coord[0]]);
            const style = mapData.styles.regionStyles[region.id] || {};

            return (
              <Polygon
                key={feature.id}
                positions={coordinates}
                pathOptions={{
                  color: style['line-color'] || 'blue',
                  fillColor: style['fill-color'] || 'blue',
                  fillOpacity: style['fill-opacity'] || 0,
                }}
              />
            );
          })
        )}

        {/* Locations */}
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
                    <img key={mediaItem.id} src={`${window.location.href.includes('localhost') ? '' : '/mosaics-map'}mediaItem.url`} alt={mediaItem.title} style={{ width: '-webkit-fill-available' }} />
                  ))}
              </Popup>
            </Marker>
          ))}

        {/* Notes */}
        {mapData.notes.map((note) => (
          <Marker key={note.id} position={[note.latitude, note.longitude]}>
            <Popup>
              <h3>{note.title}</h3>
              <p>{note.description}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;