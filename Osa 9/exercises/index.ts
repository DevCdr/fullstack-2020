import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const weight = Number(req.query.weight);
  const height = Number(req.query.height);

  if (!isNaN(weight) && !isNaN(height)) {
    res.json({
      weight,
      height,
      bmi: calculateBmi(height, weight)
    });
  } else {
    res.status(400).send({error: 'malformatted parameters'});
  }
});

app.post('/exercises', (req, res) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  const body: any = req.body;

  if (body.daily_exercises !== undefined && body.target !== undefined) {
     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const daily_exercises: Array<number> = body.daily_exercises.map((d: string) => Number(d));
    const target = Number(body.target);

    if (daily_exercises.length > 0 && daily_exercises.every((d: number) => !isNaN(d)) && !isNaN(target)) {
      res.json(calculateExercises(target, daily_exercises));
    } else {
    res.status(400).send({error: 'malformatted parameters'});
    }
  } else {
    res.status(400).send({error: 'parameters missing'});
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});