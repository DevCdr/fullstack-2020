"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewEntry = exports.toNewPatient = void 0;
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
const types_1 = require("./types");
const diagnoses_1 = __importDefault(require("../data/diagnoses"));
const diagnoses = diagnoses_1.default;
exports.toNewPatient = (object) => {
    return {
        name: parseString('name', object.name),
        dateOfBirth: parseDate(object.dateOfBirth),
        ssn: parseString('SSN', object.ssn),
        gender: parseGender(object.gender),
        occupation: parseString('occupation', object.occupation),
        entries: []
    };
};
exports.toNewEntry = (object) => {
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
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const parseString = (label, text) => {
    if (!text || !isString(text)) {
        throw new Error(`Incorrect or missing ${label}: ${text}`);
    }
    return text;
};
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const parseDate = (date) => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error(`Incorrect or missing date: ${date}`);
    }
    return date;
};
const isGender = (param) => {
    return Object.values(types_1.Gender).includes(param);
};
const parseGender = (gender) => {
    if (!gender || !isGender(gender)) {
        throw new Error(`Incorrect or missing gender: ${gender}`);
    }
    return gender;
};
const isDiagnosisCode = (codes) => {
    return codes.every((c) => diagnoses.map(d => d.code).includes(c));
};
const parseDiagnosisCodes = (codes) => {
    if (!codes) {
        return undefined;
    }
    if (!isDiagnosisCode(codes)) {
        throw new Error(`Incorrect diagnosis code(s): ${codes}`);
    }
    return codes;
};
const parseDischarge = (discharge) => {
    if (!discharge || !discharge.date || !discharge.criteria ||
        !isString(discharge.date) || !isDate(discharge.date) || !isString(discharge.criteria)) {
        throw new Error(`Incorrect or missing discharge`);
    }
    return discharge;
};
const parseSickLeave = (sickLeave) => {
    if (!sickLeave) {
        return undefined;
    }
    if (!isString(sickLeave.startDate) || !isDate(sickLeave.startDate) && sickLeave.startDate !== "" ||
        !isString(sickLeave.endDate) || !isDate(sickLeave.endDate) && sickLeave.endDate !== "") {
        throw new Error(`Incorrect sick leave`);
    }
    return sickLeave;
};
const isHealthCheckRating = (param) => {
    return Object.values(types_1.HealthCheckRating).includes(param);
};
const parseHealthCheckRating = (healthCheckRating) => {
    if (!healthCheckRating && healthCheckRating !== 0 || !isHealthCheckRating(healthCheckRating)) {
        throw new Error(`Incorrect or missing health check rating: ${healthCheckRating}`);
    }
    return healthCheckRating;
};
