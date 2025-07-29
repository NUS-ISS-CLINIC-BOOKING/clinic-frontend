import React, { useEffect, useState } from 'react';
import { useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import { Card, List, Pagination, message, Tag, Typography } from 'antd';
import axios from 'axios';
import BackButton from '@/components/BackButton';
import styles from './index.less';

const { Title } = Typography;
const PAGE_SIZE = 10;

interface Slot {
  date: string;
  startTime: string;
  patientId: number;
  doctorId: number;
  clinicId: number;
  available: boolean;
}

const AppointmentHistoryPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/queue/getSelfSlots/${patientId}`);
        setSlots(res.data?.data?.slots || []);
      } catch (error) {
        message.error('Failed to load appointment history');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentData = slots.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <PageContainer>
      <div className={styles.container}>
        <BackButton to="/clinic/all" text="Back to Clinic List" />
        <Card
          className={styles.historyCard}
          title={<Title level={4}>My Appointment History</Title>}
        >
          <List
            loading={loading}
            dataSource={currentData}
            itemLayout="vertical"
            locale={{ emptyText: 'No appointments found.' }}
            renderItem={(item, index) => (
              <List.Item key={index} className={styles.slotItem}>
                <Card className={styles.slotCard} hoverable>
                  <div className={styles.slotTop}>
                    <div className={styles.dateTime}>
                      <strong>{item.date}</strong> @ {item.startTime}
                    </div>
                    <Tag color={item.available ? 'green' : 'red'}>
                      {item.available ? 'Available' : 'Booked'}
                    </Tag>
                  </div>
                  <div className={styles.slotInfo}>
                    <div>Clinic ID: {item.clinicId}</div>
                    <div>Doctor ID: {item.doctorId}</div>
                  </div>
                </Card>
              </List.Item>
            )}
          />

          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={slots.length}
            onChange={(page) => setCurrentPage(page)}
            className={styles.pagination}
          />
        </Card>
      </div>
    </PageContainer>
  );
};

export default AppointmentHistoryPage;
