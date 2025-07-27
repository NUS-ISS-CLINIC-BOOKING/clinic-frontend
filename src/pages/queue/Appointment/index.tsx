import React, { useState, useEffect } from 'react';
import { useParams } from 'umi';
import { List, Card, Button, message, Layout, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import { getDoctorQueue, bookAppointment } from '@/services/queue';
import BackButton from '@/components/BackButton';

const { Content } = Layout;

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

  // 加载医生该日预约队列
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

  return (
    <Layout style={{ padding: 24 }}>
      <BackButton to={`/clinic/${clinicId}/specialtyList`} text="Back to Specialty List" />

      <Content style={{ marginTop: 24 }}>
        <Card title="Select Appointment Date">
          <Select
            style={{ width: 240 }}
            value={selectedDate}
            onChange={(val) => setSelectedDate(val)}
            options={dates.map((d) => ({ label: d, value: d }))}
          />
        </Card>

        <Card title={`Select Time Slot (${selectedDate})`} style={{ marginTop: 24 }}>
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

        <Card title="Doctor's Appointments on This Day" style={{ marginTop: 24 }}>
          <List
            bordered
            dataSource={queueSlots.filter((slot) => !slot.available)} // ✅ 只展示已预约的
            locale={{ emptyText: 'No appointments yet for this day.' }}
            renderItem={(slot) => (
              <List.Item>
                <strong>{slot.startTime}</strong> — Booked by patient {slot.patientId}
              </List.Item>
            )}
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default AppointmentPage;
