import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, message } from 'antd';
import { useLocation } from 'umi';
import { getClinicLocation } from '@/services/clinic'; // ✅ 你需要定义这个接口方法

// 声明全局 window.google
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

// 解析 query 参数（如 ?clinicId=1）
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const MapPage: React.FC = () => {
  const [lat, setLat] = useState(35.6895); // 默认东京
  const [lng, setLng] = useState(139.6917);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const query = useQuery();
  const clinicId = query.get('clinicId');

  // 地图初始化
  useEffect(() => {
    window.initMap = () => {
      const position = { lat, lng };
      const map = new window.google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: position,
        zoom: 12,
      });

      mapRef.current = map;

      markerRef.current = new window.google.maps.Marker({
        position,
        map,
      });
    };

    // 如果脚本已加载完毕，立即初始化
    if (window.google && window.google.maps) {
      window.initMap();
    }
  }, []);

  // 请求诊所坐标并跳转地图
  useEffect(() => {
    if (clinicId) {
      getClinicLocation(Number(clinicId)).then((res) => {
        if (res.code === 200 && res.data?.clinic) {
          const { latitude, longitude } = res.data.clinic;
          setLat(latitude);
          setLng(longitude);
          const position = { lat: latitude, lng: longitude };

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
        } else {
          message.error(res.message || '获取诊所坐标失败');
        }
      });
    }
  }, [clinicId]);

  // 手动跳转地图位置
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
