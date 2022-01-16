export interface Reference {
  id?: number;
  platform?: number;
  cs_code?: string;
  structure?: number;
  date_reference: string;
  code_household?: string;
  beneficiary_code?: string;
  beneficiary_contact?: string;
  vulnerability?: string;
  region?: number;
  department?: number;
  sub_prefecture?: number;
  commune?: number;
  district?: number;
  domicile?: string;
  profession?: string;
  number?: string;
  parent_contact?: string;
  hosting_structure?: number;
  hosting_service?: string;
  service_type?: string;
  motif?: string;
  counter_reference?: CounterReference; 
}

export interface CounterReference {
  id?: number;
  platform?: number;
  cs_code?: string;
  structure?: number;
  date_contr_reference: string;
  reference?: Reference;
  reference_service?: string;
  other_service?: string;
  service_offered?: string;
  observation?: string;
  date_created?: string;
}
