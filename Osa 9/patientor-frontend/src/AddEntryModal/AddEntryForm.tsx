import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { useStateValue } from "../state";
import { EntryTypes, SelectField, TextField, NumberField, DiagnosisSelection } from "./FormField";
import { EntryOption, EntryFormValues } from "../types";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const entryOptions: EntryTypes[] = [
  { value: EntryOption.Empty, label: "Choose type" },
  { value: EntryOption.Hospital, label: "Hospital" },
  { value: EntryOption.OccupationalHealthcare, label: "Occupational healthcare" },
  { value: EntryOption.HealthCheck, label: "Health check" }
];

interface InitialValueTypes {
  empty: EntryFormValues;
  hospital: EntryFormValues;
  occupationalHealthcare: EntryFormValues;
  healthCheck: EntryFormValues;
}

const initialValueOptions: InitialValueTypes = {
  empty: {
    type: EntryOption.Empty,
    date: "",
    specialist: "",
    description: "",
    diagnosisCodes: []
  },
  hospital: {
    type: EntryOption.Hospital,
    date: "",
    specialist: "",
    description: "",
    diagnosisCodes: [],
    discharge: {
      date: "",
      criteria: ""
    }
  },
  occupationalHealthcare: {
    type: EntryOption.OccupationalHealthcare,
    date: "",
    specialist: "",
    description: "",
    diagnosisCodes: [],
    employerName: "",
    sickLeave: {
      startDate: "",
      endDate: ""
    }
  },
  healthCheck: {
    type: EntryOption.HealthCheck,
    date: "",
    specialist: "",
    description: "",
    diagnosisCodes: [],
    healthCheckRating: ""
  }
};

const errorValidation = (values: EntryFormValues) => {
  const requiredError = "Field is required";
  const invalidError = "Field is invalid";
  const errors: { [field: string]: string | { date: string } | { criteria: string } | { startDate: string } | { endDate: string } } = {};
  if (!values.date) {
    errors.date = requiredError;
  } else if (!Date.parse(values.date)) {
    errors.date = invalidError;
  }
  if (!values.specialist) {
    errors.specialist = requiredError;
  }
  if (!values.description) {
    errors.description = requiredError;
  }
  if (values.type === EntryOption.Hospital) {
    if (values.discharge) {
      if (!values.discharge.date) {
        errors.discharge = {
          date: requiredError
        };
      } else if (!Date.parse(values.discharge.date)) {
        errors.discharge = {
          date: invalidError
        };
      }
      if (!values.discharge.criteria) {
        errors.discharge = {
          criteria: requiredError
        };
      }
      if (!values.discharge.date && !values.discharge.criteria) {
        errors.discharge = {
          date: requiredError,
          criteria: requiredError
        };
      } else if (!Date.parse(values.discharge.date) && !values.discharge.criteria) {
        errors.discharge = {
          date: invalidError,
          criteria: requiredError
        };
      }
    }
  }
  if (values.type === EntryOption.OccupationalHealthcare) {
    if (!values.employerName) {
      errors.employerName = requiredError;
    }
    if (values.sickLeave) {
      if (!Date.parse(values.sickLeave.startDate) && values.sickLeave.startDate !== "") {
        errors.sickLeave = {
          startDate: invalidError
        };
      }
      if (!Date.parse(values.sickLeave.endDate) && values.sickLeave.endDate !== "") {
        errors.sickLeave = {
          endDate: invalidError
        };
      }
      if (!Date.parse(values.sickLeave.startDate) && values.sickLeave.startDate !== "" &&
        !Date.parse(values.sickLeave.endDate) && values.sickLeave.endDate !== "") {
        errors.sickLeave = {
          startDate: invalidError,
          endDate: invalidError
        };
      }
    }
  }
  if (values.type === EntryOption.HealthCheck) {
    if (!values.healthCheckRating && values.healthCheckRating !== 0) {
      errors.healthCheckRating = requiredError;
    } else if (values.healthCheckRating < 0 || values.healthCheckRating > 3) {
      errors.healthCheckRating = invalidError;
    }
  }
  return errors;
};

export const AddEntryForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <Formik
      initialValues={initialValueOptions.empty}
      onSubmit={onSubmit}
      validate={values => errorValidation(values)}
    >
      {({ initialValues, values, isValid, dirty, setFieldValue, setFieldTouched, resetForm }) => {
        if (values.type === EntryOption.Hospital && values.type !== initialValues.type) {
          resetForm({ values: initialValueOptions.hospital });
        } else if (values.type === EntryOption.OccupationalHealthcare && values.type !== initialValues.type) {
          resetForm({ values: initialValueOptions.occupationalHealthcare });
        } else if (values.type === EntryOption.HealthCheck && values.type !== initialValues.type) {
          resetForm({ values: initialValueOptions.healthCheck });
        }

        return (
          <Form className="form ui">
            <SelectField
              label="Entry type"
              name="type"
              options={entryOptions}
            />
            {values.type !== EntryOption.Empty ? <Field
              label="Date"
              placeholder="Date"
              name="date"
              component={TextField}
            /> : null}
            {values.type !== EntryOption.Empty ? <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            /> : null}
            {values.type !== EntryOption.Empty ? <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            /> : null}
            {values.type !== EntryOption.Empty ? <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            /> : null}
            {values.type === EntryOption.Hospital ? <h4>Discharge</h4> : null}
            {values.type === EntryOption.Hospital ? <Field
              label="Date"
              placeholder="Date"
              name="discharge.date"
              component={TextField}
            /> : null}
            {values.type === EntryOption.Hospital ? <Field
              label="Criteria"
              placeholder="Criteria"
              name="discharge.criteria"
              component={TextField}
            /> : null}
            {values.type === EntryOption.OccupationalHealthcare ? <Field
              label="Employer name"
              placeholder="Employer name"
              name="employerName"
              component={TextField}
            /> : null}
            {values.type === EntryOption.OccupationalHealthcare ? <h4>Sick leave</h4> : null}
            {values.type === EntryOption.OccupationalHealthcare ? <Field
              label="Start date"
              placeholder="Start date"
              name="sickLeave.startDate"
              component={TextField}
            /> : null}
            {values.type === EntryOption.OccupationalHealthcare ? <Field
              label="End date"
              placeholder="End date"
              name="sickLeave.endDate"
              component={TextField}
            /> : null}
            {values.type === EntryOption.HealthCheck ? <Field
              label="Health check rating"
              name="healthCheckRating"
              component={NumberField}
              min={0}
              max={3}
            /> : null}
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
