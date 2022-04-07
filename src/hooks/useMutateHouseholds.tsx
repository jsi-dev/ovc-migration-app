import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { Household } from '../models/new/Household';
import { HouseholdQuery } from '../services/new/householdQuery';

const useMutateHouseholds = (households: Household[], increment: number) => {
  const [countHousehold, setCountHousehold] = useState(0);
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const addHousehold = useMutation(HouseholdQuery.saveHousehold);

  useEffect(() => {
    if (households.length > 0 && isSaving) {
      households.forEach((h) => {
        addHousehold.mutate(h, {
          onSuccess: () => {
            const counter = count + 1;
            setCount(counter);
            setProgress(Math.floor((counter * 100) / households.length));
            if (countHousehold === 100) {
              setIsFinished(true);
              setIsSaving(false);
            }
          },
        });
      });
    }
  }, [isSaving, isFinished]);

  return {
    setIsSaving,
    isSaving,
    isFinished,
    progress,
  };
};

export default useMutateHouseholds;
