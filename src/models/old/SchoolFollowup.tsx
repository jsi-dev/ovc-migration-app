export interface SchoolFollowup {
    id?: number;
    technical_partner?: string;
    platform?: number;
    social_center_code?: string;
    structure: number;
    household_code: string;
    beneficiary_code: string;
    status: number;
    status_reason: number;
    remove_status: number;
}

export interface SchoolFollowupInfo {
    id?: number;
    school_followup_id?: number;
    agent: number;
    beneficiary_code: string
    begin_year: number;
    end_year: number;
    age: string;
    school_class: number;
    school: string
    average_1: string;
    service_1: string;
    average_2: string;
    service_2: string;
    average_3: string;
    service_3: string;
    decision: string;
    comment: string;
    vide: string;

    followup: SchoolFollowup
}