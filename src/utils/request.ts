import { sleep } from './shared';

export const repeatWhenFailed = <T extends unknown, Args extends unknown[]>(
  call: (...args: Args) => Promise<T>,
  timeout: number,
  fnName = 'Unknown async function call'
) => {
  return async (...args: Args) => {
    try {
      return await call(...args);
    } catch (err) {
      console.log(`${fnName} call failed! repeating in ${timeout} ms...`);
      console.error(err);
      await sleep(timeout);
      const repeater: (...args: Args) => Promise<T> = repeatWhenFailed(
        call,
        timeout,
        fnName
      );
      return await repeater(...args);
    }
  };
};
