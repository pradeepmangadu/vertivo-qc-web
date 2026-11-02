import type { Delivery, Stats } from '../types';
import { downloadFile, request } from './client';

export const listDeliveries = () => request<Delivery[]>('GET', '/deliveries');
export const createDelivery = () => request<Delivery>('POST', '/deliveries', {});
export const getDelivery = (id: string) => request<Delivery>('GET', `/deliveries/${id}`);
export const updateDelivery = (id: string, body: Record<string, unknown>) => request<Delivery>('PATCH', `/deliveries/${id}`, body);
export const deleteDelivery = (id: string) => request<void>('DELETE', `/deliveries/${id}`);
export const getStats = (id: string) => request<Stats>('GET', `/deliveries/${id}/stats`);
export const exportCsv = (id: string) => downloadFile(`/deliveries/${id}/export.csv`, 'Vertivo_Delivery_QC.csv');
export const downloadBackup = (id: string) => downloadFile(`/deliveries/${id}/backup.json`, 'Vertivo_QC_backup.json');
