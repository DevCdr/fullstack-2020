import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Table, Icon, Header, Button } from "semantic-ui-react";

import AddEntryModal from "../AddEntryModal";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { Diagnosis, EntryOption, HealthCheckRating, Entry, EntryFormValues, Patient } from "../types";
import { setPatientData } from "../state/reducer";
import { addEntry } from "../state/reducer";

interface EntryDetails {
  entry: Entry;
  diagnoses: { [id: string]: Diagnosis };
}

const HospitalEntry: React.FC<EntryDetails> = ({ entry, diagnoses }) => {
  if (entry.type === EntryOption.Hospital) {
    return (
      <Table celled>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Header as="h4">
                <Header.Content>{entry.date} <Icon name="hospital" size="big" /></Header.Content>
                <Header.Subheader style={{ fontSize: 12, marginTop: 6 }}><em>{entry.description}</em></Header.Subheader>
              </Header>
              {entry.diagnosisCodes ? <ul>
                {entry.diagnosisCodes?.map(d => {
                  const diagnosis = Object.values(diagnoses).find(D => D.code === d);
                  return (
                    <div key={d}>
                      <li>{d} {diagnosis ? diagnosis.name : null}</li>
                    </div>
                  );
                })}
              </ul> : null}
              <Header as="h5">
                <Header.Content>Discharge</Header.Content>
                <Header.Subheader style={{ fontSize: 12, marginTop: 6 }}>
                  <em>{entry.discharge.date}: {entry.discharge.criteria}</em>
                </Header.Subheader>
              </Header>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
  return null;
};

const OccupationalHealthcareEntry: React.FC<EntryDetails> = ({ entry, diagnoses }) => {
  if (entry.type === EntryOption.OccupationalHealthcare) {
    return (
      <Table celled>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Header as="h4">
                <Header.Content>{entry.date} <Icon name="stethoscope" size="big" /> {entry.employerName}</Header.Content>
                <Header.Subheader style={{ fontSize: 12, marginTop: 6 }}><em>{entry.description}</em></Header.Subheader>
              </Header>
              {entry.diagnosisCodes ? <ul>
                {entry.diagnosisCodes?.map(d => {
                  const diagnosis = Object.values(diagnoses).find(D => D.code === d);
                  return (
                    <div key={d}>
                      <li>{d} {diagnosis ? diagnosis.name : null}</li>
                    </div>
                  );
                })}
              </ul> : null}
              {entry.sickLeave && entry.sickLeave.startDate !== "" && entry.sickLeave.endDate !== "" ? <Header as="h5">
                <Header.Content>Sick Leave</Header.Content>
                <Header.Subheader style={{ fontSize: 12, marginTop: 6 }}>
                  <em>{entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}</em>
                </Header.Subheader>
              </Header> : null}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
  return null;
};

const HealthCheckEntry: React.FC<EntryDetails> = ({ entry, diagnoses }) => {
  if (entry.type === EntryOption.HealthCheck) {
    return (
      <Table celled>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <Header as="h4">
                <Header.Content>{entry.date} <Icon name="user md" size="big" /></Header.Content>
                <Header.Subheader style={{ fontSize: 12, marginTop: 6 }}><em>{entry.description}</em></Header.Subheader>
              </Header>
              {entry.diagnosisCodes ? <ul>
                {entry.diagnosisCodes?.map(d => {
                  const diagnosis = Object.values(diagnoses).find(D => D.code === d);
                  return (
                    <div key={d}>
                      <li>{d} {diagnosis ? diagnosis.name : null}</li>
                    </div>
                  );
                })}
              </ul> : null}
              {entry.healthCheckRating === HealthCheckRating.Healthy
                ? <Icon name="heart" color="green" />
                : entry.healthCheckRating === HealthCheckRating.LowRisk
                  ? <Icon name="heart" color="yellow" />
                  : entry.healthCheckRating === HealthCheckRating.HighRisk
                    ? <Icon name="heart" color="orange" />
                    : entry.healthCheckRating === HealthCheckRating.CriticalRisk
                      ? <Icon name="heart" color="red" />
                      : null}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
  return null;
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  const [{ diagnoses }] = useStateValue();

  if (!diagnoses) {
    return null;
  }

  switch (entry.type) {
    case EntryOption.Hospital:
      return <HospitalEntry entry={entry} diagnoses={diagnoses} />;
    case EntryOption.OccupationalHealthcare:
      return <OccupationalHealthcareEntry entry={entry} diagnoses={diagnoses} />;
    case EntryOption.HealthCheck:
      return <HealthCheckEntry entry={entry} diagnoses={diagnoses} />;
    default:
      return assertNever(entry);
  }
};

const PatientInfoPage: React.FC = () => {
  const [{ patientData }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        values
      );
      dispatch(addEntry(id, newEntry));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  const fetchPatient = async () => {
    try {
      const { data } = await axios.get<Patient>(
        `${apiBaseUrl}/patients/${id}`
      );
      dispatch(setPatientData(data));
    } catch (e) {
      console.error(e);
    }
  };

  const patient = Object.values(patientData).find(p => String(p.id) === id);

  if (!patient) {
    fetchPatient();
    return null;
  }

  return (
    <div className="App">
      <Container>
        <Header as="h2">{patient.name }
        {patient.gender === 'male'
          ? <Icon name='mars' />
          : patient.gender === 'female'
            ? <Icon name='venus' />
            : <Icon name='transgender' />
        }</Header>
        ssn: {patient.ssn}<br />
        occupation: {patient.occupation}
        <Header as="h3">entries</Header>
        <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
        />
        <Button onClick={() => openModal()}>Add New Entry</Button>
        {patient.entries ? patient.entries.map(e => (
          <EntryDetails key={e.id} entry={e} />
        )) : null}
      </Container>
    </div>
  );
};

export default PatientInfoPage;
