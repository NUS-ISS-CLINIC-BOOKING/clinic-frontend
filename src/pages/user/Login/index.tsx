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

  // ✅ 获取 setInitialState 用于设置 currentUser
  const { setInitialState } = useModel('@@initialState');

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const res = await login(values);
      if (res.code === 200 && res.data?.token) {
        message.success('登录成功！');

        // ✅ 设置 currentUser，避免跳回 login
        await setInitialState((prev) => ({
          ...prev,
          currentUser: {
            ...res.data,
            id: res.data.userId,
            name: 'issTeam',     // ✅ mock 一个 name
            access: 'admin',     // ✅ mock 一个 access 权限
          },
        }));

        // ✅ 然后跳转
        history.push('/clinic/all');
      } else {
        setLoginError(true);
      }
    } catch (error) {
      message.error('登录失败，请检查邮箱和密码');
      setLoginError(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="Clinic Booking"
          subTitle="用户登录"
          initialValues={{ autoLogin: true }}
          onFinish={async (values) => {
            await handleSubmit(values as { email: string; password: string });
          }}
        >
          {loginError && <LoginMessage content="邮箱或密码错误" />}

          <ProFormText
            name="email"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder="请输入邮箱"
            rules={[{ required: true, message: '请输入邮箱！' }]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder="请输入密码"
            rules={[{ required: true, message: '请输入密码！' }]}
          />
          <div style={{ marginBottom: 24 }}>
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a style={{ float: 'right' }}>忘记密码</a>
          </div>
          <Link to="/user/register">新用户注册</Link>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
