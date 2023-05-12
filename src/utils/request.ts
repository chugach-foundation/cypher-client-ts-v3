import { sleep } from './shared';

export const repeatWhenFailed = <T extends unknown, Y extends unknown>(
  call: (x: Y) => Promise<T>,
  timeout: number,
  fnName = 'Unknown asycn function call'
) => {
  return async (x: Y) => {
    try {
      return await call(x);
    } catch (err) {
      console.log(`${fnName} failed! repeating in ${timeout} ms...`);
      console.error(err);
      await sleep(timeout);
      const repeater: (x: Y) => Promise<T> = repeatWhenFailed(
        call,
        timeout,
        fnName
      );
      return await repeater(x);
    }
  };
};
