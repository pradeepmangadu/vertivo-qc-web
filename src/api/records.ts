import type { ChecklistSection, InspectionRecord } from '../types';
import { request } from './client';

export const getChecklist = () => request<ChecklistSection[]>('GET', '/checklist');
export const getRecords = (deliveryId: string) => request<InspectionRecord[]>('GET', `/deliveries/${deliveryId}/records`);
export const saveRecord = (deliveryId: string, itemId: number, body: Record<string, unknown>) =>
  request<InspectionRecord>('PUT', `/deliveries/${deliveryId}/records/${itemId}`, body);

export function uploadPhoto(deliveryId: string, itemId: number, blob: Blob) {
  const fd = new FormData();
  fd.append('photo', blob, 'photo.jpg');
  return request<InspectionRecord>('POST', `/deliveries/${deliveryId}/records/${itemId}/photo`, fd);
}
export const deletePhoto = (deliveryId: string, itemId: number) =>
  request<InspectionRecord>('DELETE', `/deliveries/${deliveryId}/records/${itemId}/photo`);
