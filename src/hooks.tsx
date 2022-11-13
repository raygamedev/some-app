import { useEffect, useState } from 'react';
import { apiHealthCheck } from './api';
export const useServer = () => {
  const [serverIsAlive, setServerIsAlive] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  useEffect(() => {
    const validateServerIsAlive = async () => setServerIsAlive(await apiHealthCheck());
    setIntervalId(setInterval(validateServerIsAlive, 1000));
  }, []);
  useEffect(
    () => (serverIsAlive ? clearInterval(intervalId) : undefined),
    [serverIsAlive, intervalId]
  );
  return serverIsAlive;
};
