import React, { useState } from 'react';
import { useParams } from 'umi';
import { Input, Button, Card, message, Typography } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { modifyHealthInfo } from '@/services/auth';
import BackButton from '@/components/BackButton';
import styles from './index.less';

const { Title } = Typography;

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
    <PageContainer>
      <div className={styles.container}>
        <BackButton to="/clinic/all" text="Back to Clinic List" />

        <Card className={styles.healthCard} title={<Title level={4}>Fill in Health Information</Title>}>
          <p className={styles.userId}><strong>User ID:</strong> {userId}</p>

          <div className={styles.inputRow}>
            <Input
              className={styles.inputField}
              placeholder="e.g. peanut, penicillin, pollen..."
              value={allergyInfo}
              onChange={(e) => setAllergyInfo(e.target.value)}
            />
            <Button type="primary" className={styles.submitButton} onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default HealthInfoPage;
