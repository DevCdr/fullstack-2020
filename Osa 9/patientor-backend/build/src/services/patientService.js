"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const patients_1 = __importDefault(require("../../data/patients"));
const patients = patients_1.default;
const findById = (id) => {
    return patients.find(p => p.id === id);
};
const getNonSensitiveEntries = () => {
    return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
        id,
        name,
        dateOfBirth,
        gender,
        occupation
    }));
};
const addPatient = (patient) => {
    const newPatient = Object.assign({ id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1 }, patient);
    patients.push(newPatient);
    return newPatient;
};
const addEntry = (id, entry) => {
    const patient = patients.find(p => p.id === Number(id));
    if (!patient) {
        return null;
    }
    const newEntry = Object.assign({ id: patient.entries.length > 0 ? Math.max(...patient.entries.map(e => e.id)) + 1 : 1 }, entry);
    patient.entries.push(newEntry);
    return newEntry;
};
exports.default = {
    findById,
    getNonSensitiveEntries,
    addPatient,
    addEntry
};
