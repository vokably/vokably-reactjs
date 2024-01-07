import { useEffect, useContext, useState, useRef } from 'react';
import { LearningSessionContext, SetLearningSessionContext } from './contexts';

export function useStateWithLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const initialCall = useRef(true);
  const [value, setValue] = useState<T>(initialValue);


  useEffect(() => {
    const item = localStorage.getItem(key);

    if (item) {
      setValue(JSON.parse(item) as T);
    }
  }, [setValue, key]);


  useEffect(() => {

    if (initialCall.current) {
      initialCall.current = false;
      return;
    }
    
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}


export const useLearningSession = () => {
  const learningSession = useContext(LearningSessionContext);
  const setLearningSession = useContext(SetLearningSessionContext);

  return [learningSession, setLearningSession];
}
