import React, { useState } from 'react';
import { useParams } from 'umi';
import { List, Card, Button, message, Layout, Modal } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import BackButton from '@/components/BackButton'; // ✅ 加载返回按钮

const { Sider, Content } = Layout;

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00'
];

const AppointmentPage: React.FC = () => {
  const { doctorId, clinicId, patientId } = useParams<{
    doctorId: string;
    clinicId: string;
    patientId: string;
  }>();

  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const dates = [...Array(7)].map((_, i) => dayjs().add(i, 'day').format('YYYY-MM-DD'));
  const selectedDate = dates[selectedDateIndex];

  const handleTimeClick = (time: string) => {
    const slotId = TIME_SLOTS.indexOf(time);
    if (slotId === -1) {
      message.error('Invalid time slot');
      return;
    }

    Modal.confirm({
      title: 'Confirm Appointment',
      content: `Do you want to book an appointment on ${selectedDate} at ${time}?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const res = await axios.put(
            `/api/queue/bookSlot/${selectedDate}/${slotId}/${clinicId}/${doctorId}/${patientId}`
          );
          if (res.data?.data?.success) {
            message.success(`Appointment booked successfully on ${selectedDate} at ${time}`);
          } else {
            message.error(res.data?.data?.message || 'Booking failed');
          }
        } catch (error) {
          console.error('Booking request failed:', error);
          message.error('Booking request failed. Please try again later.');
        }
      },
    });
  };

  return (
    <Layout style={{ padding: 24 }}>
      <BackButton to={`/clinic/${clinicId}/specialtyList`} text="Back to Specialty List" />

      <Layout style={{ marginTop: 16 }}>
        <Sider width={200} style={{ background: '#fff', marginRight: 24 }}>
          <List
            header={<strong>Select Date</strong>}
            bordered
            dataSource={dates}
            renderItem={(date, idx) => (
              <List.Item
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedDateIndex === idx ? '#e6f7ff' : undefined,
                }}
                onClick={() => setSelectedDateIndex(idx)}
              >
                {date}
              </List.Item>
            )}
          />
        </Sider>

        <Content>
          <Card title={`Select Time Slot (${selectedDate})`}>
            {TIME_SLOTS.map((time) => (
              <Button
                key={time}
                type="default"
                onClick={() => handleTimeClick(time)}
                style={{ margin: '8px' }}
              >
                {time}
              </Button>
            ))}
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppointmentPage;
