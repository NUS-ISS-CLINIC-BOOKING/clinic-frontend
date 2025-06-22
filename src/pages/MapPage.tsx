import React, { useEffect } from 'react';

// ✅ 声明 window.google 类型，防止 TS 报错
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const MapPage: React.FC = () => {
  useEffect(() => {
    // ✅ 定义 initMap，供 script 回调触发
    window.initMap = () => {
      new window.google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: { lat: 35.6895, lng: 139.6917 }, // 东京坐标
        zoom: 12,
      });
    };

    // ✅ 如果 script 已经加载完毕，手动调用 initMap
    if (window.google && window.google.maps) {
      window.initMap();
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div id="map" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default MapPage;
