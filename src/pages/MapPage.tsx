import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, message } from 'antd';
import { useLocation } from 'umi';
import { getClinicLocation, getAllClinics } from '@/services/clinic';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const MapPage: React.FC = () => {
  const [lat, setLat] = useState(35.6895);
  const [lng, setLng] = useState(139.6917);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const allMarkersRef = useRef<any[]>([]);
  const query = useQuery();
  const clinicId = query.get('clinicId');

  // 初始化地图
  useEffect(() => {
    window.initMap = () => {
      const position = { lat, lng };
      const map = new window.google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: position,
        zoom: 3,
      });
      mapRef.current = map;

      // 初始化一个默认 marker
      markerRef.current = new window.google.maps.Marker({
        position,
        map,
      });

      // 如果没有 clinicId，加载全部诊所 Marker
      if (!clinicId) {
        getAllClinics()
          .then((res) => {
            if (res.code === 200 && res.data?.clinics?.length > 0) {
              const bounds = new window.google.maps.LatLngBounds();
              res.data.clinics.forEach((clinic: any) => {
                const pos = {
                  lat: clinic.latitude,
                  lng: clinic.longitude,
                };
                const marker = new window.google.maps.Marker({
                  position: pos,
                  map,
                  title: clinic.name,
                });
                allMarkersRef.current.push(marker);
                bounds.extend(pos);
              });
              map.fitBounds(bounds); // 自动缩放与居中
            }
          })
          .catch(() => message.error('加载全部诊所失败'));
      }
    };

    if (window.google && window.google.maps) {
      window.initMap();
    }
  }, []);

  // 若传入 clinicId，则仅定位该诊所
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
            mapRef.current.setZoom(14);
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

  // 手动跳转
  const goToLocation = () => {
    const newLat = parseFloat(lat as any);
    const newLng = parseFloat(lng as any);
    const position = { lat: newLat, lng: newLng };

    if (mapRef.current) {
      mapRef.current.setCenter(position);
      mapRef.current.setZoom(14);

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
      <div style={{ padding: '12px', display: 'flex', gap: 16, alignItems: 'center' }}>
        <label>
          纬度 (Latitude):<Input
          style={{ width: 120 }}
          value={lat}
          onChange={(e) => setLat(Number(e.target.value))}
        />
        </label>
        <label>
          经度 (Longitude):<Input
          style={{ width: 120 }}
          value={lng}
          onChange={(e) => setLng(Number(e.target.value))}
        />
        </label>
        <Button type="primary" onClick={goToLocation}>
          跳转
        </Button>
      </div>
      <div id="map" style={{ width: '100%', height: '90vh' }} />
    </div>
  );
};

export default MapPage;
