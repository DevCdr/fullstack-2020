"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const express_1 = __importDefault(require("express"));
const patientService_1 = __importDefault(require("../services/patientService"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.get('/', (_req, res) => {
    res.send(patientService_1.default.getNonSensitiveEntries());
});
router.get('/:id', (req, res) => {
    const patient = patientService_1.default.findById(Number(req.params.id));
    patient ? res.send(patient) : res.sendStatus(404);
});
router.post('/', (req, res) => {
    try {
        const newPatient = utils_1.toNewPatient(req.body);
        const addedPatient = patientService_1.default.addPatient(newPatient);
        res.json(addedPatient);
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});
router.post('/:id/entries', (req, res) => {
    try {
        const newEntry = utils_1.toNewEntry(req.body);
        const addedEntry = patientService_1.default.addEntry(req.params.id, newEntry);
        addedEntry ? res.json(addedEntry) : res.sendStatus(404);
    }
    catch (e) {
        res.status(400).send(e.message);
    }
});
exports.default = router;
