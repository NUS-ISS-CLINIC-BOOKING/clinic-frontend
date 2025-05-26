import React, { useEffect, useState } from 'react';
import { useParams, history } from 'umi';
import { Card, List, message, Empty } from 'antd';
import styles from './index.less';
import { getSpecialtiesByClinicId } from '@/services/clinic';
import BackButton from '@/components/BackButton';

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
      <BackButton to="/clinic/all" text="Back to Clinic List" />
      <h2>Specialty List (Clinic ID: {clinicId})</h2>
      <List
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        dataSource={specialties}
        locale={{ emptyText: <Empty description="No specialties available" /> }}
        renderItem={(item) => (
          <List.Item key={item.specialty}>
            <Card
              title={item.specialty}
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
