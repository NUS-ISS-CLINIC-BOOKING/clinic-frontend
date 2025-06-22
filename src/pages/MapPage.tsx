import React, { useEffect, useRef, useState } from 'react';
import { Input, Button } from 'antd';

// ✅ 声明 window.google 类型
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const MapPage: React.FC = () => {
  const [lat, setLat] = useState(35.6895); // 默认东京
  const [lng, setLng] = useState(139.6917);

  const mapRef = useRef<any>(null); // 地图实例
  const markerRef = useRef<any>(null); // Marker 实例

  useEffect(() => {
    // 定义供 script callback 使用的 initMap
    window.initMap = () => {
      const position = { lat, lng };
      const map = new window.google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: position,
          zoom: 12,
        }
      );

      mapRef.current = map;

      // 初始 marker
      markerRef.current = new window.google.maps.Marker({
        position,
        map: map,
      });
    };

    // 若 Google Maps 脚本已加载完
    if (window.google && window.google.maps) {
      window.initMap();
    }
  }, []);

  // 跳转地图中心
  const goToLocation = () => {
    const newLat = parseFloat(lat as any);
    const newLng = parseFloat(lng as any);
    const position = { lat: newLat, lng: newLng };

    if (mapRef.current) {
      mapRef.current.setCenter(position);

      if (markerRef.current) {
        markerRef.current.setPosition(position);
      } else {
        markerRef.current = new window.google.maps.Marker({
          position,
          map: mapRef.current,
        });
      }
    }
  };

  return (
    <div>
      <div style={{ padding: '12px', display: 'flex', gap: 8 }}>
        <Input
          style={{ width: 120 }}
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(Number(e.target.value))}
        />
        <Input
          style={{ width: 120 }}
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(Number(e.target.value))}
        />
        <Button type="primary" onClick={goToLocation}>
          跳转
        </Button>
      </div>

      <div id="map" style={{ width: '100%', height: '90vh' }} />
    </div>
  );
};

export default MapPage;
