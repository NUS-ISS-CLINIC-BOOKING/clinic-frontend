/// 1. specialtyList 页面：src/pages/clinic/specialtyList/index.tsx
import React, { useEffect, useState } from 'react';
import { useParams, history } from 'umi';
import { Card, List, message, Empty } from 'antd';
import styles from './index.less';
import { getSpecialtiesByClinicId } from '@/services/clinic';

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
          message.error(res.message || '加载科室失败');
        }
      })
      .catch(() => {
        message.error('接口请求失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clinicId]);

  return (
    <div className={styles.container}>
      <h2>科室列表（诊所ID: {clinicId}）</h2>
      <List
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        dataSource={specialties}
        locale={{ emptyText: <Empty description="暂无科室信息" /> }}
        renderItem={(item) => (
          <List.Item key={item.specialty}>
            <Card
              title={item.specialty}
              hoverable
              onClick={() => {
                // 点击后跳转展示医生页（下一步）
                history.push(`/clinic/${clinicId}/doctorList/${item.specialty}`);
              }}
            >
              <p>点击查看医生列表</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default SpecialtyList;
