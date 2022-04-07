import { useEffect, useState } from 'react';

const useProgressBarValue = (total: number) => {
  const [value, setValue] = useState<number>(0);
  const [progressValue, setProgressValue] = useState<number>(0);

  const handleSetValue = (v: number) => {
    setValue(v);
  };

  useEffect(() => {
    setProgressValue((value / total) * 100);
    console.log(
      'progressValue :',
      progressValue,
      'total : ',
      total,
      'value :',
      value
    );
  }, [progressValue, total, value]);

  //   console.log(value);

  return { value, handleSetValue, progressValue };
};

export default useProgressBarValue;
