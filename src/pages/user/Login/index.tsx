import Footer from '@/components/Footer';
import { login } from '@/services/auth';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
  ProFormCheckbox,
} from '@ant-design/pro-components';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { history, Link, useModel } from 'umi';
import styles from './index.less';

const LoginMessage: React.FC<{ content: string }> = ({ content }) => (
  <Alert
    style={{ marginBottom: 24 }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [loginError, setLoginError] = useState<boolean>(false);
  const { setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const res = await login(values);
      if (res.code === 200 && res.data?.token) {
        message.success('Login Successful!');

        await setInitialState((prev) => ({
          ...prev,
          currentUser: {
            ...res.data,
            id: res.data.userId,
            name: 'issTeam',
            access: 'admin',
          },
        }));

        history.push('/clinic/all');
      } else {
        setLoginError(true);
      }
    } catch (error) {
      message.error('Login failed. Please check your email and password.');
      setLoginError(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="Clinic Booking"
          subTitle="User Login"
          initialValues={{ autoLogin: true }}
          onFinish={async (values) => {
            await handleSubmit(values as { email: string; password: string });
          }}
        >
          {loginError && <LoginMessage content="Incorrect email or password" />}

          <ProFormText
            name="email"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder="Please enter email"
            rules={[{ required: true, message: 'Email is required!' }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder="Please enter password"
            rules={[{ required: true, message: 'Password is required!' }]}
          />
          <div style={{ marginBottom: 24 }}>
            <ProFormCheckbox noStyle name="autoLogin">
              Auto Login
            </ProFormCheckbox>
            <a style={{ float: 'right' }}>Forgot Password</a>
          </div>
          <Link to="/user/register">Register a New Account</Link>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
