/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Gender, Diagnosis, Discharge, SickLeave, HealthCheckRating, NewPatient, NewEntry } from './types';
import diagnoseData from '../data/diagnoses';

const diagnoses: Array<Diagnosis> = diagnoseData;

export const toNewPatient = (object: any): NewPatient => {
  return {
    name: parseString('name', object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseString('SSN', object.ssn),
    gender: parseGender(object.gender),
    occupation: parseString('occupation', object.occupation),
    entries: []
  };
};

export const toNewEntry = (object: any): NewEntry => {
  switch (object.type) {
    case "Hospital":
      return {
        date: parseDate(object.date),
        type: object.type,
        specialist: parseString('specialist', object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
        description: parseString('description', object.description),
        discharge: parseDischarge(object.discharge)
      };
    case "OccupationalHealthcare":
      return {
        date: parseDate(object.date),
        type: object.type,
        specialist: parseString('specialist', object.specialist),
        employerName: parseString('employer name', object.employerName),
        diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
        description: parseString('description', object.description),
        sickLeave: parseSickLeave(object.sickLeave)
      };
    case "HealthCheck":
      return {
        date: parseDate(object.date),
        type: object.type,
        specialist: parseString('specialist', object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
        description: parseString('description', object.description),
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
      };
    default:
      throw new Error(`Incorrect or missing type: ${object.type}`);
  }
};

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (label: string, text: any): string => {
  if (!text || !isString(text)) {
    throw new Error(`Incorrect or missing ${label}: ${text}`);
  }
  return text;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error(`Incorrect or missing date: ${date}`);
  }
  return date;
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error(`Incorrect or missing gender: ${gender}`);
  }
  return gender;
};

const isDiagnosisCode = (codes: any): codes is Array<Diagnosis['code']> => {
  return codes.every((c: string) => diagnoses.map(d => d.code).includes(c));
};

const parseDiagnosisCodes = (codes: any): Array<Diagnosis['code']> | undefined => {
  if (!codes) {
    return undefined;
  }
  if (!isDiagnosisCode(codes)) {
    throw new Error(`Incorrect diagnosis code(s): ${codes}`);
  } 
  return codes;
};

const parseDischarge = (discharge: any): Discharge => {
  if (!discharge || !discharge.date || !discharge.criteria ||
    !isString(discharge.date) || !isDate(discharge.date) || !isString(discharge.criteria)) {
    throw new Error(`Incorrect or missing discharge`);
  }
  return discharge;
};

const parseSickLeave = (sickLeave: any): SickLeave | undefined => {
  if (!sickLeave) {
    return undefined;
  }
  if (!isString(sickLeave.startDate) || !isDate(sickLeave.startDate) && sickLeave.startDate !== "" ||
    !isString(sickLeave.endDate) || !isDate(sickLeave.endDate) && sickLeave.endDate !== "") {
    throw new Error(`Incorrect sick leave`);
  }
  return sickLeave;
};

const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (healthCheckRating: any): HealthCheckRating => {
  if (!healthCheckRating && healthCheckRating !== 0 || !isHealthCheckRating(healthCheckRating)) {
    throw new Error(`Incorrect or missing health check rating: ${healthCheckRating}`);
  }
  return healthCheckRating;
};