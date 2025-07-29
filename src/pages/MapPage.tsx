import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, message } from 'antd';
import { useLocation } from 'umi';
import { getClinicLocation, getAllClinics } from '@/services/clinic';
import styles from './MapPage.less';
import BackButton from '@/components/BackButton';

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

  useEffect(() => {
    window.initMap = () => {
      const position = { lat, lng };
      const map = new window.google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: position,
        zoom: 3,
      });
      mapRef.current = map;

      markerRef.current = new window.google.maps.Marker({
        position,
        map,
      });

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
              map.fitBounds(bounds);
            }
          })
          .catch(() => message.error('Failed to load all clinics'));
      }
    };

    if (window.google && window.google.maps) {
      window.initMap();
    }
  }, []);

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
          message.error(res.message || 'Failed to get clinic coordinates');
        }
      });
    }
  }, [clinicId]);

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
    <div className={styles.container}>
      <div className={styles.controlPanel}>
        <BackButton to="/clinic/all" text="Back to Clinic List" />
        <div className={styles.inputGroup}>
          <div className={styles.inputRow}>
            <label>Latitude:</label>
            <Input
              style={{ width: 120 }}
              value={lat}
              onChange={(e) => setLat(Number(e.target.value))}
            />
          </div>
          <div className={styles.inputRow}>
            <label>Longitude:</label>
            <Input
              style={{ width: 120 }}
              value={lng}
              onChange={(e) => setLng(Number(e.target.value))}
            />
          </div>
          <Button type="primary" onClick={goToLocation} className={styles.goButton}>
            Go to Location
          </Button>
        </div>
      </div>
      <div id="map" className={styles.mapContainer} />
    </div>
  );
};

export default MapPage;
