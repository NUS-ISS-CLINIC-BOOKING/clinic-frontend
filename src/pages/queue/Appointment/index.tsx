import React, { useState, useEffect } from 'react';
import { useParams } from 'umi';
import { List, Card, Button, message, Layout, Modal, Select, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { getDoctorQueue, bookAppointment } from '@/services/queue';
import BackButton from '@/components/BackButton';
import styles from './index.less';

const { Content } = Layout;
const { Title } = Typography;

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00'
];

interface Slot {
  date: string;
  startTime: string;
  patientId: number | null;
  available: boolean;
}

const AppointmentPage: React.FC = () => {
  const { doctorId, clinicId, patientId } = useParams<{
    doctorId: string;
    clinicId: string;
    patientId: string;
  }>();

  const dates = [...Array(7)].map((_, i) => dayjs().add(i, 'day').format('YYYY-MM-DD'));
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [queueSlots, setQueueSlots] = useState<Slot[]>([]);

  useEffect(() => {
    if (doctorId && selectedDate) {
      getDoctorQueue(doctorId, selectedDate)
        .then((res) => {
          if (res.code === 200) {
            setQueueSlots(res.data.slots);
          } else {
            message.error(res.message || 'Failed to fetch doctor queue');
          }
        })
        .catch(() => {
          message.error('Request failed');
        });
    }
  }, [doctorId, selectedDate]);

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
          const res = await bookAppointment(selectedDate, slotId, clinicId, doctorId, patientId);
          if (res.data?.success) {
            message.success(`Appointment booked successfully on ${selectedDate} at ${time}`);
          } else {
            message.error(res.data?.message || 'Booking failed');
          }
        } catch (error) {
          console.error('Booking request failed:', error);
          message.error('Booking request failed. Please try again later.');
        }
      },
    });
  };

  const isSlotAvailable = (time: string) =>
    queueSlots.find((s) => s.startTime.endsWith(time))?.available !== false;

  return (
    <Layout className={styles.container}>
      <BackButton to={`/clinic/${clinicId}/specialtyList`} text="Back to Specialty List" />

      <Content className={styles.content}>
        <Card title={<Title level={4}>Select Appointment Date</Title>} className={styles.card}>
          <Select
            style={{ width: 240 }}
            value={selectedDate}
            onChange={(val) => setSelectedDate(val)}
            options={dates.map((d) => ({ label: d, value: d }))}
          />
        </Card>

        <Card
          title={<Title level={4}>Available Time Slots on {selectedDate}</Title>}
          className={styles.card}
        >
          {TIME_SLOTS.map((time) => {
            const available = isSlotAvailable(time);
            return (
              <Button
                key={time}
                type={available ? 'primary' : 'default'}
                className={styles.timeButton}
                disabled={!available}
                onClick={() => handleTimeClick(time)}
              >
                {time}
              </Button>
            );
          })}
        </Card>

        <Card
          title={<Title level={4}>Doctor's Booked Appointments</Title>}
          className={styles.card}
        >
          <List
            dataSource={queueSlots.filter((slot) => !slot.available)}
            locale={{ emptyText: 'No appointments yet for this day.' }}
            renderItem={(slot) => (
              <List.Item>
                <Tag color="red">{slot.startTime}</Tag>
                <span className={styles.slotText}>Booked by patient {slot.patientId}</span>
              </List.Item>
            )}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default AppointmentPage;
