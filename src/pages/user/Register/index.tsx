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

const Register: React.FC = () => {
  const [usertype, setUsertype] = useState<number | undefined>(undefined); // ✅ 跟字段名保持一致

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values, // ✅ 不要多余添加 roleId 之类字段
      };

      console.log("最终提交 payload：", payload); // ✅ 调试用，可删

      const res = await register(payload);
      if (res.code === 200) {
        message.success('注册成功，请登录');
        history.push('/user/login');
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
          name="usertype" // ✅ 必须为 usertype（小写）
          options={[
            { label: '病人', value: 0 },
            { label: '医生', value: 1 },
            { label: '诊所员工', value: 2 },
            { label: '管理员', value: 3 },
          ]}
          placeholder="用户类型"
          rules={[{ required: true, message: '请选择用户类型' }]}
          fieldProps={{
            onChange: (value) => setUsertype(value), // ✅ 注意状态变量也改成 usertype
          }}
        />

        {/* 仅医生或诊所员工才显示额外信息 */}
        {(usertype === 1 || usertype === 2) && (
          <>
            <ProFormText
              name="clinicid" // ✅ 与后端保持一致
              placeholder="诊所ID"
              rules={[{ required: true, message: '请输入诊所ID' }]}
            />
            <ProFormText
              name="speciality" // ✅ 英式拼写小写
              placeholder="专业/职责"
              rules={[{ required: true, message: '请输入专业或职责' }]}
            />
          </>
        )}
      </LoginForm>
    </div>
  );
};

export default Register;
