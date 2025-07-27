import React, { useEffect, useState } from 'react';
import { useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-components';
import { Card, List, Pagination, message } from 'antd';
import axios from 'axios';
import BackButton from '@/components/BackButton';

interface Slot {
  date: string;
  startTime: string;
  patientId: number;
  doctorId: number;
  clinicId: number;
  available: boolean;
}

const PAGE_SIZE = 10;

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
      <BackButton to="/clinic/all" text="Back to Clinic List" />
      <Card title="Appointment History">
        <List
          loading={loading}
          dataSource={currentData}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <List.Item.Meta
                title={`Date: ${item.date} | Time: ${item.startTime}`}
                description={
                  <>
                    <div>Clinic ID: {item.clinicId}</div>
                    <div>Doctor ID: {item.doctorId}</div>
                    <div>Status: {item.available ? 'Available' : 'Booked'}</div>
                  </>
                }
              />
            </List.Item>
          )}
        />
        <Pagination
          current={currentPage}
          pageSize={PAGE_SIZE}
          total={slots.length}
          onChange={(page) => setCurrentPage(page)}
          style={{ textAlign: 'center', marginTop: 24 }}
        />
      </Card>
    </PageContainer>
  );
};

export default AppointmentHistoryPage;
