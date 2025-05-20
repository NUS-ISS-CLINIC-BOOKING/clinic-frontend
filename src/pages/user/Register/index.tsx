import { register } from '@/services/auth';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-components';
import { message } from 'antd';
import React, { useState } from 'react';
import { history } from 'umi';

const specialityOptions = [
  { label: '内科', value: 'internal_medicine' },
  { label: '外科', value: 'surgery' },
  { label: '儿科', value: 'pediatrics' },
  { label: '皮肤科', value: 'dermatology' },
  { label: '妇产科', value: 'obstetrics_gynecology' },
  { label: '耳鼻喉科', value: 'ent' },
  { label: '眼科', value: 'ophthalmology' },
  { label: '口腔科', value: 'dentistry' },
  { label: '精神科', value: 'psychiatry' },
  { label: '中医科', value: 'traditional_chinese_medicine' },
  { label: '放射科', value: 'radiology' },
  { label: '康复科', value: 'rehabilitation' },
];

const Register: React.FC = () => {
  const [usertype, setUsertype] = useState<number | undefined>(undefined);

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
      };

      console.log('最终提交 payload：', payload);

      const res = await register(payload);
      if (res.code === 200) {
        // if (values.usertype === 0) {
        //   message.success('注册成功，请完善健康信息');
        //   history.push(`/user/health_info/${res.data.userId}`);
        // } else {
          message.success('注册成功，请登录');
          history.push('/user/login');
        // }
      }

    } catch (e) {
      message.error('注册失败，请检查信息');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: '100px' }}>
      <LoginForm
        title="注册新账号"
        onFinish={handleSubmit}
        submitter={{
          searchConfig: { submitText: '注册' },
        }}
      >
        <ProFormText
          name="name"
          fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
          placeholder="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        />
        <ProFormText
          name="email"
          fieldProps={{ size: 'large', prefix: <MailOutlined /> }}
          placeholder="邮箱"
          rules={[{ required: true, type: 'email', message: '请输入有效邮箱' }]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
          placeholder="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        />
        <ProFormSelect
          name="gender"
          options={[
            { label: '男', value: 0 },
            { label: '女', value: 1 },
          ]}
          placeholder="性别"
          rules={[{ required: true, message: '请选择性别' }]}
        />
        <ProFormSelect
          name="usertype"
          options={[
            { label: '病人', value: 0 },
            { label: '医生', value: 1 },
            { label: '诊所员工', value: 2 },
            { label: '管理员', value: 3 },
          ]}
          placeholder="用户类型"
          rules={[{ required: true, message: '请选择用户类型' }]}
          fieldProps={{
            onChange: (value) => setUsertype(value),
          }}
        />

        {(usertype === 1 || usertype === 2) && (
          <>
            <ProFormText
              name="clinicid"
              placeholder="诊所ID"
              rules={[{ required: true, message: '请输入诊所ID' }]}
            />
            <ProFormSelect
              name="speciality"
              options={specialityOptions}
              placeholder="请选择科室/职责"
              rules={[{ required: true, message: '请选择专业或职责' }]}
            />
          </>
        )}
      </LoginForm>
    </div>
  );
};

export default Register;
