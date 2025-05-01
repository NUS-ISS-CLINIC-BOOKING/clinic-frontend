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
  userType: number;
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

