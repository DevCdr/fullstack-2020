import patientData from '../../data/patients';
import { Entry, Patient, NonSensitivePatientEntry, NewPatient, NewEntry } from '../types';

const patients: Array<Patient> = patientData;

const findById = (id: number): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const getNonSensitiveEntries = (): Array<NonSensitivePatientEntry> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({ 
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1,
    ...patient
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: NewEntry): Entry | null => {
  const patient = patients.find(p => p.id === Number(id));

  if (!patient) {
    return null;
  }

  const newEntry = {
    id: patient.entries.length > 0 ? Math.max(...patient.entries.map(e => e.id)) + 1 : 1,
    ...entry
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  findById,
  getNonSensitiveEntries,
  addPatient,
  addEntry
};