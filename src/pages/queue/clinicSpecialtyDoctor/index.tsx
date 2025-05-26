import React, { useEffect, useState } from 'react';
import { useParams, history } from 'umi'; // ✅ 加上 history
import { Card, List, message, Empty } from 'antd';
import styles from './index.less';
import { getDoctorsByClinicAndSpecialty } from '@/services/queue';
import BackButton from '@/components/BackButton';

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
          message.error(res.message || '加载医生失败');
        }
      })
      .catch(() => {
        message.error('接口请求失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clinicId, specialty]);

  return (
    <div className={styles.container}>
      <BackButton to={`/clinic/${clinicId}/specialtyList`} text="返回科室列表" />
      <h2>医生列表 - {specialty}（诊所ID: {clinicId}）</h2>
      <List
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        dataSource={doctors}
        locale={{ emptyText: <Empty description="暂无医生信息" /> }}
        renderItem={(item) => (
          <List.Item key={item.id}>
            {/* ✅ 点击医生卡片跳转预约页面 */}
            <Card
              title={item.name}
              hoverable
              onClick={() => {
                history.push(`/queue/appointment/${item.id}`);
              }}
            >
              <p><strong>ID：</strong>{item.id}</p>
              <p><strong>科室：</strong>{item.specialty}</p>
              <p style={{ color: '#1890ff', marginTop: 12 }}>👉 点击选择预约时间</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default DoctorList;
