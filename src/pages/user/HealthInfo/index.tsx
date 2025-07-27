import React, { useState } from 'react';
import { useParams } from 'umi';
import { Input, Button, Card, message } from 'antd';
import { PageContainer } from '@ant-design/pro-components'; // ✅ 加入 PageContainer
import { modifyHealthInfo } from '@/services/auth';
import BackButton from '@/components/BackButton';

const HealthInfoPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [allergyInfo, setAllergyInfo] = useState('');

  const handleSubmit = async () => {
    if (!allergyInfo) {
      message.warning('Please enter allergy info');
      return;
    }
    try {
      await modifyHealthInfo(userId, allergyInfo);
      message.success('Saved successfully');
    } catch (e: any) {
      message.error(e.message || 'Submission failed');
    }
  };

  return (
    <PageContainer> {/* ✅ 改为 PageContainer 包裹整个页面 */}
      <BackButton to="/clinic/all" text="Back to Clinic List" />
      <Card title="Fill in Health Information">
        <p><strong>User ID:</strong> {userId}</p>
        <div style={{ display: 'flex', gap: 12, maxWidth: 1200, marginBottom: 16 }}>
          <Input
            placeholder="Please enter allergy (e.g. peanut)"
            value={allergyInfo}
            onChange={(e) => setAllergyInfo(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Card>

    </PageContainer>
  );
};

export default HealthInfoPage;
