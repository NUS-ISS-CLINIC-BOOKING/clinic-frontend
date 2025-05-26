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
  { label: 'Internal Medicine', value: 'internal_medicine' },
  { label: 'Surgery', value: 'surgery' },
  { label: 'Pediatrics', value: 'pediatrics' },
  { label: 'Dermatology', value: 'dermatology' },
  { label: 'Obstetrics & Gynecology', value: 'obstetrics_gynecology' },
  { label: 'ENT', value: 'ent' },
  { label: 'Ophthalmology', value: 'ophthalmology' },
  { label: 'Dentistry', value: 'dentistry' },
  { label: 'Psychiatry', value: 'psychiatry' },
  { label: 'Traditional Chinese Medicine', value: 'traditional_chinese_medicine' },
  { label: 'Radiology', value: 'radiology' },
  { label: 'Rehabilitation', value: 'rehabilitation' },
];

const Register: React.FC = () => {
  const [usertype, setUsertype] = useState<number | undefined>(undefined);

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
      };

      console.log('Final submitted payload:', payload);

      const res = await register(payload);
      if (res.code === 200) {
        message.success('Registered successfully. Please login.');
        history.push('/user/login');
      }

    } catch (e) {
      message.error('Registration failed. Please check the form.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: '100px' }}>
      <LoginForm
        title="Register a New Account"
        onFinish={handleSubmit}
        submitter={{
          searchConfig: { submitText: 'Register' },
        }}
      >
        <ProFormText
          name="name"
          fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
          placeholder="Username"
          rules={[{ required: true, message: 'Please enter username' }]}
        />
        <ProFormText
          name="email"
          fieldProps={{ size: 'large', prefix: <MailOutlined /> }}
          placeholder="Email"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
          placeholder="Password"
          rules={[{ required: true, message: 'Please enter password' }]}
        />
        <ProFormSelect
          name="gender"
          options={[
            { label: 'Male', value: 0 },
            { label: 'Female', value: 1 },
          ]}
          placeholder="Gender"
          rules={[{ required: true, message: 'Please select gender' }]}
        />
        <ProFormSelect
          name="usertype"
          options={[
            { label: 'Patient', value: 0 },
            { label: 'Doctor', value: 1 },
            { label: 'Clinic Staff', value: 2 },
            { label: 'Admin', value: 3 },
          ]}
          placeholder="User Type"
          rules={[{ required: true, message: 'Please select user type' }]}
          fieldProps={{
            onChange: (value) => setUsertype(value),
          }}
        />

        {(usertype === 1 || usertype === 2) && (
          <>
            <ProFormText
              name="clinicid"
              placeholder="Clinic ID"
              rules={[{ required: true, message: 'Please enter clinic ID' }]}
            />
            <ProFormSelect
              name="speciality"
              options={specialityOptions}
              placeholder="Please select specialty/role"
              rules={[{ required: true, message: 'Please select specialty' }]}
            />
          </>
        )}
      </LoginForm>
    </div>
  );
};

export default Register;
