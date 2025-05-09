import React, { useEffect, useState } from 'react';
import { Card, List, message, Empty } from 'antd';
import { getAllClinics } from '@/services/clinic';
import styles from './index.less';

const ClinicList: React.FC = () => {
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllClinics()
      .then((res) => {
        if (res.code === 200 && res.data?.clinics) {
          setClinics(res.data.clinics);
          if (res.data.clinics.length === 0) {
            message.info(res.data.message || 'No clinics found');
          }
        } else {
          message.error(res.message || '加载诊所失败');
        }
      })
      .catch(() => {
        message.error('接口请求失败');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h2>诊所列表</h2>
      <List
        loading={loading}
        grid={{ gutter: 16, column: 3 }}
        dataSource={clinics}
        locale={{ emptyText: <Empty description="暂无诊所信息" /> }}
        renderItem={(clinic) => (
          <List.Item key={clinic.id}>
            <Card title={clinic.name}>
              <p><strong>地址：</strong>{clinic.address}</p>
              <p><strong>电话：</strong>{clinic.phone}</p>
              <p><strong>经纬度：</strong>{clinic.latitude}, {clinic.longitude}</p>
              <p><strong>负责人ID：</strong>{clinic.staff_list_id}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ClinicList;
