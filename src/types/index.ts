export const INSPECTION_STATUSES = ['Accepted', 'Issue found', 'Missing', 'Damaged', 'Not applicable'] as const;
export type InspectionStatus = (typeof INSPECTION_STATUSES)[number];
export const OVERALL_STATUSES = ['Pending inspection', 'Accepted', 'Accepted with issues', 'Rejected / hold'] as const;
export type OverallStatus = (typeof OVERALL_STATUSES)[number];
export const ISSUE_STATUSES: readonly string[] = ['Issue found', 'Missing', 'Damaged'];

export type Role = 'inspector' | 'admin';
export interface User { id: string; email: string; name: string; role: Role }

export interface Delivery {
  id: string; customer: string; location: string; model: string; colour: string;
  height_mm: number | null; width_mm: number | null; depth_mm: number | null;
  inspector: string; site_signoff: string; vertivo_signoff: string;
  inspection_date: string | null; overall_status: OverallStatus | null;
  version: number; created_at: string; updated_at: string;
}

export interface ChecklistItem { id: number; sno: string; name: string; size: string; material: string; required_qty: number | null }
export interface ChecklistSection { id: number; name: string; items: ChecklistItem[] }

export interface InspectionRecord {
  item_id: number; qty_sent: number | null; actual_condition: string;
  inspection: InspectionStatus | null; remarks: string; version: number; photo_url: string | null;
}

export interface Stats { total: number; checked: number; issues: number; by_section: { section_id: number; total: number; checked: number }[] }

/** Editable form state for the delivery record (numbers kept as strings while typing). */
export interface DeliveryForm {
  customer: string; location: string; model: string; colour: string;
  height_mm: string; width_mm: string; depth_mm: string; inspector: string;
  site_signoff: string; vertivo_signoff: string; inspection_date: string; overall_status: string;
}
