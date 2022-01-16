export interface Person {
  gender: string;
  names: any;
  birthdate: Date;
  addresses?: any;
  uuid: string;
}

export interface PersonAddress {
  preferred?: boolean;
  cityVillage?: string;
  stateProvince?: string;
  country?: string;
  countryDistrict?: string;
  postalCode?: string;
  startSate?: Date;
  endSate?: Date;
  address1?: string;
  address2?: string;
  address3?: string;
  uuid: string;
}

export interface PersonName {
  givenName: string;
  familyName: string;
  preferred: boolean;
  prefix: string;
  uuid: string;
}
