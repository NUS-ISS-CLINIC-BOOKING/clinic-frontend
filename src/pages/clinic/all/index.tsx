import React, { useEffect, useState } from 'react';
import { Card, List, message, Empty, Button } from 'antd';
import { getAllClinics } from '@/services/clinic';
import styles from './index.less';
import { history } from 'umi';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  CompassOutlined,
  MailOutlined,
} from '@ant-design/icons';

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
      <div className={styles.headerRow}>
        <h2 className={styles.pageTitle}>Clinic List</h2>
        <Button
          type="primary"
          className={styles.backButton}
          icon={<CompassOutlined />}
          onClick={() => history.push('/map')}
        >
          View map (manually enter coordinates)
        </Button>
      </div>
      <List
        loading={loading}
        grid={{ gutter: 24, column: 3 }}
        dataSource={clinics}
        locale={{ emptyText: <Empty description="No clinics available" /> }}
        renderItem={(clinic) => (
          <List.Item key={clinic.id}>
            <Card
              className={styles.clinicCard}
              title={<span className={styles.cardTitle}>{clinic.name}</span>}
              hoverable
              onClick={() =>
                history.push(`/clinic/${clinic.id}/specialtyList`)
              }
              actions={[
                <Button
                  type="link"
                  key="map"
                  icon={<CompassOutlined />}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent Card click
                    history.push(`/map?clinicId=${clinic.id}`);
                  }}
                >
                  Search by Map
                </Button>,
              ]}
            >
              <p>
                <EnvironmentOutlined /> <strong>Address:</strong>{' '}
                {clinic.address}
              </p>
              <p>
                <PhoneOutlined /> <strong>Phone:</strong> {clinic.phone}
              </p>
              <p>
                <MailOutlined /> <strong>Coordinates:</strong>{' '}
                {clinic.latitude}, {clinic.longitude}
              </p>
              <p>
                <strong>Postal Code:</strong> {clinic.postal_code}
              </p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ClinicList;
