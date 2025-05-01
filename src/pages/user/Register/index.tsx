import { register } from '@/services/auth';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { message } from 'antd';
import React from 'react';
import { history } from 'umi';

const Register: React.FC = () => {
  const handleSubmit = async (values: any) => {
    try {
      const res = await register(values);
      if (res.code === 200) {
        message.success('注册成功，请登录');
        history.push('/user/login'); // 注册成功跳转登录页
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
          name="userType"
          options={[
            { label: '病人', value: 0 },
            { label: '医生', value: 1 },
            { label: '诊所员工', value: 2 },
            { label: '管理员', value: 3 },
          ]}
          placeholder="用户类型"
          rules={[{ required: true, message: '请选择用户类型' }]}
        />
      </LoginForm>
    </div>
  );
};

export default Register;
