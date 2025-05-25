import { request } from 'umi';

export async function getDoctorsByClinicAndSpecialty(clinicId: string, specialty: string) {
  return request(`/api/queue/clinicSpecialtyDoctor/${clinicId}/${specialty}`, {
    method: 'GET',
  });
}
