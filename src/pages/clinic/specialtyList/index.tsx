import React, { useEffect, useState } from 'react';
import { useParams, history } from 'umi';
import { Card, List, message, Empty } from 'antd';
import styles from './index.less';
import { getSpecialtiesByClinicId } from '@/services/clinic';
import BackButton from '@/components/BackButton';
import { MedicineBoxOutlined } from '@ant-design/icons';

interface Specialty {
  specialty: string;
}

const SpecialtyList: React.FC = () => {
  const { clinicId } = useParams<{ clinicId: string }>();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpecialtiesByClinicId(clinicId)
      .then((res) => {
        if (res.code === 200 && res.data?.specialtyList) {
          setSpecialties(res.data.specialtyList);
          if (res.data.specialtyList.length === 0) {
            message.info(res.data.message || 'No specialties found');
          }
        } else {
          message.error(res.message || 'Failed to load specialties');
        }
      })
      .catch(() => {
        message.error('API request failed');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clinicId]);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <BackButton to="/clinic/all" text="Back to Clinic List" />
        <h2 className={styles.pageTitle}>Specialty List (Clinic ID: {clinicId})</h2>
      </div>
      <List
        loading={loading}
        grid={{ gutter: 24, column: 3 }}
        dataSource={specialties}
        locale={{ emptyText: <Empty description="No specialties available" /> }}
        renderItem={(item) => (
          <List.Item key={item.specialty}>
            <Card
              className={styles.specialtyCard}
              title={
                <span className={styles.cardTitle}>
                  <MedicineBoxOutlined /> {item.specialty}
                </span>
              }
              hoverable
              onClick={() => {
                history.push(`/queue/clinicSpecialtyDoctor/${clinicId}/${item.specialty}`);
              }}
            >
              <p>Click to view doctor list</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default SpecialtyList;
