import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Latitude/Longitude for "Opposite Neptune Tamtam, Yaounde" - approximately
const RESTAURANT_POSITION = { lat: 3.8666, lng: 11.5166 };

export default function MapComponent() {
  if (!hasValidKey) {
    return (
      <div className="w-full h-80 bg-zinc-900 flex items-center justify-center p-8 border border-white/5 text-center">
        <div className="max-w-xs space-y-4">
          <h3 className="text-white font-serif">Map Setup Required</h3>
          <p className="text-zinc-500 text-xs leading-relaxed uppercase tracking-widest font-bold">
            Please add your GOOGLE_MAPS_PLATFORM_KEY to the project secrets to enable the location map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-80 border border-white/5 overflow-hidden grayscale">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={RESTAURANT_POSITION}
          defaultZoom={15}
          mapId="FIL_LOCATION_MAP"
          style={{ width: '100%', height: '100%' }}
          disableDefaultUI={true}
          gestureHandling={'cooperative'}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        >
          <AdvancedMarker position={RESTAURANT_POSITION}>
            <Pin 
              background={'#b45309'} 
              glyphColor={'#fff'} 
              borderColor={'#78350f'} 
            />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
}
