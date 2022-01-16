export interface NutritionalFollowup {
  structure?: number;
  site?: string;
  clinic_code?: string;
  registration_status?: number;
  registration_status_reason?: number;
  registration_status_status?: number;
  registration_remove_status?: number;
}

export interface NutritionalFollowupInfo {
  followup_info_id?: number;
  followup_id?: number;
  structure?: number;
  platform?: number;
  social_center_code?: string;
  old_household_code?: string;
  household_code?: string;
  region?: number;
  department?: number;
  sub_prefecture?: number;
  village?: number;
  neighborhood?: number;
  household_id?: number;
  beneficiary_id?: number;
  beneficiary_code?: string;
  visit_date_day: string;
  visit_date_month: string;
  visit_date_year: string;
  age?: string;
  category?: string;
  location?: string;
  status?: string;
  hiv_treatment?: string;
  weight?: string;
  height?: string;
  score?: string;
  bmi?: string;
  PB?: string;
  food?: string;
  edema?: string;
  nutritional_status?: string;
  action?: string;
  comment?: string;
  registration_status?: number;
  registration_status_reason?: number;
  registration_status_status?: number;
  registration_remove_status?: number;
  followup?: NutritionalFollowup;
}
