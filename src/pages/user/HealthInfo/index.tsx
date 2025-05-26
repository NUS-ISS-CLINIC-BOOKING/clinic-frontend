import React, { useState } from 'react';
import { useParams } from 'umi';
import { Input, Button, Card, message } from 'antd';
import { modifyHealthInfo } from '@/services/auth';
import BackButton from '@/components/BackButton'; // ✅ 路径视你项目结构而定

const HealthInfoPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [allergyInfo, setAllergyInfo] = useState('');

  const handleSubmit = async () => {
    if (!allergyInfo) {
      message.warning('请输入过敏信息');
      return;
    }
    try {
      await modifyHealthInfo(userId, allergyInfo);
      message.success('保存成功');
    } catch (e: any) {
      message.error(e.message || '提交失败');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '24px auto' }}>
      {/* ✅ 复用你的返回组件 */}
      <BackButton to="/clinic/all" text="返回诊所列表" />

      <Card title="填写健康信息">
        <p>用户 ID: {userId}</p>
        <Input
          placeholder="请输入过敏原（如 peanut）"
          value={allergyInfo}
          onChange={(e) => setAllergyInfo(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" onClick={handleSubmit}>
          提交
        </Button>
      </Card>
    </div>
  );
};

export default HealthInfoPage;
