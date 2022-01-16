import {EncounterProvider} from "./EncounterProvider";
import {Obs} from "./Obs";

export interface Encounter {
    encounterDatetime: Date;
    encounterType: any;
    patient: any;
    obs: Obs[];
    encounterProviders: EncounterProvider[]
    location: any;
    uuid: string;
}