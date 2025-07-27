import { request } from 'umi';

// 获取某诊所某科室下的医生列表
export async function getDoctorsByClinicAndSpecialty(clinicId: string, specialty: string) {
  return request(`/api/queue/clinicSpecialtyDoctor/${clinicId}/${specialty}`, {
    method: 'GET',
  });
}

// 获取医生某天的预约队列
export async function getDoctorQueue(doctorId: string, date: string) {
  return request(`/api/queue/getDoctorQueue/${doctorId}/${date}`, {
    method: 'GET',
  });
}

// 提交预约
export async function bookAppointment(
  date: string,
  slotId: number,
  clinicId: string,
  doctorId: string,
  patientId: string,
) {
  return request(`/api/queue/bookSlot/${date}/${slotId}/${clinicId}/${doctorId}/${patientId}`, {
    method: 'PUT',
  });
}
