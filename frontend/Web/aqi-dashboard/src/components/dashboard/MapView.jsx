// src/components/dashboard/MapView.jsx
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";

const delhiCenter = [28.6139, 77.2090];

export default function MapView({ zones, reports }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-4 md:p-6 shadow-lg border border-slate-800">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-lg font-semibold">AQI by Zones</h2>
          <p className="text-xs text-slate-400">
            Tap markers for station details & citizen reports
          </p>
        </div>
      </div>

      <div className="h-80 rounded-xl overflow-hidden">
        <MapContainer
          center={delhiCenter}
          zoom={10}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* AQI zonal markers */}
          {zones?.map((zone) => (
            <CircleMarker
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={12}
              pathOptions={{ color: "white", weight: 1 }}
              fillOpacity={0.7}
            >
              <Tooltip direction="top" offset={[0, -10]}>
                <div className="text-xs">
                  <div className="font-semibold">{zone.name}</div>
                  <div>AQI: {zone.aqi}</div>
                  <div>Category: {zone.category}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

          {/* Citizen reports markers */}
          {reports?.map((r) => (
            <CircleMarker
              key={r.id}
              center={[r.lat, r.lng]}
              radius={6}
              pathOptions={{ color: "#22c55e", weight: 1 }}
              fillOpacity={0.8}
            >
              <Tooltip direction="top" offset={[0, -8]}>
                <div className="text-xs">
                  <div className="font-semibold">Citizen report</div>
                  <div>{r.type}</div>
                  <div className="text-[10px] text-slate-400">
                    {r.message}
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
