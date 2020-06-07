import { State } from "./state";
import { Diagnosis, Entry, Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "SET_PATIENT_DATA";
      payload: Patient;
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "SET_DIAGNOSIS_LIST";
      payload: Diagnosis[];
    }
  | {
      type: "ADD_ENTRY";
      id: string;
      payload: Entry;
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "SET_PATIENT_DATA":
      return {
        ...state,
        patientData: {
          ...state.patientData,
          [action.payload.id]: action.payload
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses
        }
      };
    case "ADD_ENTRY":
      return {
        ...state,
        patientData: {
          ...state.patientData,
          [action.id]: { ...state.patientData[action.id], entries: [action.payload, ...state.patientData[action.id].entries] }
        }
      };
    default:
      return state;
  }
};

export const setPatientList = (payload: Patient[]): Action => ({
  type: "SET_PATIENT_LIST",
  payload
});

export const setPatientData = (payload: Patient): Action => ({
  type: "SET_PATIENT_DATA",
  payload
});

export const addPatient = (payload: Patient): Action => ({
  type: "ADD_PATIENT",
  payload
});

export const setDiagnosisList = (payload: Diagnosis[]): Action => ({
  type: "SET_DIAGNOSIS_LIST",
  payload
});

export const addEntry = (id: string, payload: Entry): Action => ({
  type: "ADD_ENTRY",
  id,
  payload
});