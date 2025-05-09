import { request } from 'umi';

export async function getAllClinics() {
    return request('/api/clinic/all', {
        method: 'GET',
    });
}
