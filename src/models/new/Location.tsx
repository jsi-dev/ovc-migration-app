export interface LocationAttributeType {
    name: string;
    description: string;
    datatypeClassname: string;
    minOccurs: number;
    maxOccurs: number;
    datatypeConfig: string;
    uuid: string;
}

export interface LocationAttribute {
    attributeType: LocationAttributeType;
    value: string;
    uuid: string;
}

export interface LocationTag {
    name: string;
    description: string;
    uuid: string;
}

export interface Location {
    name: string;
    description: string;
    parentLocation: any;
    tags: any;
    address1: string; // tel
    address2: string; // email
    address3: string; // responsible
    address4: string; // Position
    address5: string; // Fax
    address6: string; // Street
    address7: string; // Postal Address
    address8: string;
    postalCode: string; // Ets code
    uuid: string;
}