import { request } from 'umi';

export async function getAllClinics() {
    return request('/api/clinic/all', {
        method: 'GET',
    });
}

export async function getSpecialtiesByClinicId(clinicId: string) {
  return request(`/api/clinic/specialtyList/${clinicId}`, {
    method: 'GET',
  });
}



