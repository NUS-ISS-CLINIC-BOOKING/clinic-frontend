import React from 'react';
import { useParams, history } from 'umi';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';

const HealthInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const handleSubmit = async (values: any) => {
    try {
      const res = await fetch(`/api/health_info/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allergyInfo: values.allergyInfo }),
      });

      if (res.ok) {
        message.success('提交成功，请登录');
        history.push('/user/login');
      } else {
        const errText = await res.text();
        console.error('错误详情：', errText);
        message.error('提交失败');
      }
    } catch (e) {
      console.error(e);
      message.error('请求异常');
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: 'auto', paddingTop: 100 }}>
      <h2 style={{ textAlign: 'center' }}>填写健康信息</h2>
      <ProForm
        onFinish={handleSubmit}
        submitter={{ searchConfig: { submitText: '提交' } }}
      >
        <ProFormText
          name="allergyInfo"
          label="过敏信息"
          placeholder="请输入过敏药物、食物等"
          rules={[{ required: true, message: '过敏信息不能为空' }]}
        />
      </ProForm>
    </div>
  );
};

export default HealthInfo;
