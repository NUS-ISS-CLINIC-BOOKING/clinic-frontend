import React, { useEffect, useState } from 'react';
import { Card, List, message, Empty, Button } from 'antd';
import { getAllClinics } from '@/services/clinic';
import styles from './index.less';
import { history } from 'umi';

const ClinicList: React.FC = () => {
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllClinics()
      .then((res) => {
        if (res.code === 200 && res.data?.clinics) {
          setClinics(res.data.clinics);
          if (res.data.clinics.length === 0) {
            message.info(res.data.message || 'No clinics found');
          }
        } else {
          message.error(res.message || 'Failed to load clinics');
        }
      })
      .catch(() => {
        message.error('API request failed');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Clinic List</h2>
        <Button type="primary" onClick={() => history.push('/map')}>
          View map (manually enter coordinates)
        </Button>
      </div>
      <List
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        dataSource={clinics}
        locale={{ emptyText: <Empty description="No clinics available" /> }}
        renderItem={(clinic) => (
          <List.Item key={clinic.id}>
            <Card
              title={clinic.name}
              hoverable
              onClick={() => {
                history.push(`/clinic/${clinic.id}/specialtyList`);
              }}
              actions={[
                <Button
                  type="link"
                  key="map"
                  onClick={(e) => {
                    e.stopPropagation(); // 防止触发 Card 的跳转
                    history.push(`/map?clinicId=${clinic.id}`);
                  }}
                >
                  Search by Map
                </Button>,
              ]}
            >
              <p><strong>Address:</strong> {clinic.address}</p>
              <p><strong>Phone:</strong> {clinic.phone}</p>
              <p><strong>Coordinates:</strong> {clinic.latitude}, {clinic.longitude}</p>
              <p><strong>Postal Code:</strong> {clinic.postal_code}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ClinicList;
