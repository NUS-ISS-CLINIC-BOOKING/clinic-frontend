import React, { useState } from 'react';
import { useParams } from 'umi';
import { List, Card, Button, message, Layout } from 'antd';
import dayjs from 'dayjs';

const { Sider, Content } = Layout;

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00'
];

const AppointmentPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  const dates = [...Array(7)].map((_, i) => dayjs().add(i, 'day').format('YYYY-MM-DD'));
  const selectedDate = dates[selectedDateIndex];

  const handleTimeClick = (time: string) => {
    message.success(`预约成功：${selectedDate} ${time}（医生 ID：${doctorId}）`);
  };

  return (
    <Layout style={{ padding: 24 }}>
      <Sider width={200} style={{ background: '#fff', marginRight: 24 }}>
        <List
          header={<strong>选择日期</strong>}
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
        <Card title={`选择时间段（${selectedDate}）`}>
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
  );
};

export default AppointmentPage;
