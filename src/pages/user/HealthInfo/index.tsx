import React, { useState } from 'react';
import { useParams } from 'umi';
import { Input, Button, Card, message } from 'antd';
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
    <div style={{ maxWidth: 600, margin: '24px auto' }}>
      <BackButton to="/clinic/all" text="Back to Clinic List" />

      <Card title="Fill in Health Information">
        <p>User ID: {userId}</p>
        <Input
          placeholder="Please enter allergy (e.g. peanut)"
          value={allergyInfo}
          onChange={(e) => setAllergyInfo(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Card>
    </div>
  );
};

export default HealthInfoPage;
