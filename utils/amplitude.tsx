import { init, track, setUserId, reset } from '@amplitude/analytics-browser';

export const initAmplitude = () => {
  init(`${process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY}`);
};

export const logEvent = (eventName: any, eventProperties: any) => {
  track(eventName, eventProperties);
};

export const setAmplitudeUserId = (userId: any) => {
  setUserId(userId);
};

export const resetAmplitude = () => {
  reset();
};
