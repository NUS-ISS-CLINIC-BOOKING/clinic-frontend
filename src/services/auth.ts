import { request } from 'umi';


export async function login(body: { email: string; password: string }) {
  return request<{
    code: number;
    message: string;
    data: {
      userId: number;
      token: string;
      message: string;
    };
  }>('/api/auth/login', {
    method: 'POST',
    data: body,
  });
}

export async function register(body: {
  name: string;
  email: string;
  password: string;
  gender: number;
  usertype: number;
  clinicid?: number; // 匹配后端字段
  speciality?: string; // 注意拼写，匹配后端字段
}) {
  return request<{
    code: number;
    message: string;
    data: {
      userId: number;
      message: string;
    };
  }>('/api/auth/register', {
    method: 'POST',
    data: body,
  });
}

// src/services/auth.ts

/** 修改健康信息 */
export async function modifyHealthInfo(userId: string, allergyInfo: string) {
  return fetch(`/api/auth/health_info/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ allergyInfo }),
  }).then(async (res) => {
    const result = await res.json();
    if (!res.ok || result.code !== 200) {
      throw new Error(result.message || '保存失败');
    }
    return result;
  });
}


