import React, { useEffect, useState } from 'react';
import { useParams, history } from 'umi';
import { Card, List, message, Empty } from 'antd';
import styles from './index.less';
import { getDoctorsByClinicAndSpecialty } from '@/services/queue';
import BackButton from '@/components/BackButton';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

const DoctorList: React.FC = () => {
  const { clinicId, specialty } = useParams<{ clinicId: string; specialty: string }>();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorsByClinicAndSpecialty(clinicId, specialty)
      .then((res) => {
        if (res.code === 200 && res.data?.doctors) {
          setDoctors(res.data.doctors);
        } else {
          message.error(res.message || 'Failed to load doctors');
        }
      })
      .catch(() => {
        message.error('API request failed');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clinicId, specialty]);

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <BackButton to={`/clinic/${clinicId}/specialtyList`} text="Back to Specialty List" />
        <h2 className={styles.pageTitle}>
          Doctor List - {specialty.toUpperCase()} (Clinic ID: {clinicId})
        </h2>
      </div>
      <List
        loading={loading}
        grid={{ gutter: 24, column: 3 }}
        dataSource={doctors}
        locale={{ emptyText: <Empty description="No doctors available" /> }}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card
              className={styles.doctorCard}
              title={
                <span className={styles.cardTitle}>
                  <UserOutlined /> {item.name}
                </span>
              }
              hoverable
              onClick={() => {
                const patientId = localStorage.getItem('userId');
                if (!patientId) {
                  message.error('请先登录');
                  return;
                }

                history.push(`/queue/appointment/${clinicId}/${item.id}/${patientId}`);
              }}
            >
              <p><strong>ID:</strong> {item.id}</p>
              <p><strong>Specialty:</strong> {item.specialty}</p>
              <p className={styles.selectTip}>
                <CalendarOutlined /> Click to select appointment time
              </p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default DoctorList;
