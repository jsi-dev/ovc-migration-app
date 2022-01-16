export interface Obs {
    value?: any;
    concept: any;
    person: any;
    obsDatetime: Date;
    encounter?: any;
    groupMembers?: Obs[];
    status?: string;
    location?: any;
    uuid?: string;
}