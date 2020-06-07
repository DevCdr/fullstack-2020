interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseArguments = (args: Array<string>): Array<number> => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const inputs = args.slice(2);

  if (inputs.every(argv => !isNaN(Number(argv)))) {
    return inputs.map(argv => Number(argv));
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateExercises = (target: number, exerciseHours: Array<number>): Result => {
  const average = exerciseHours.reduce((a, b) => a + b) / exerciseHours.length;
  const rating = average < 0.5 * target ? 1 : average < target ? 2 : 3;

  return {
    periodLength: exerciseHours.length,
    trainingDays: exerciseHours.filter(dayilyHours => dayilyHours !== 0).length,
    success: average >= target,
    rating,
    ratingDescription: rating === 1 ? 'too lazy' : rating === 2 ? 'not too bad but could be better' : 'excellent job!',
    target,
    average
  };
};

try {
  const [target, ...hours] = parseArguments(process.argv);
  console.log(calculateExercises(target, hours));
} catch (e) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log('Error, something bad happened, message: ', e.message);
}