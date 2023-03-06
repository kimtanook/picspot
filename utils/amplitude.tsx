import { init, track, setUserId, reset } from '@amplitude/analytics-browser';

const API_KEY = 'e579522099b0ce6296a946a184165cf3';

export const initAmplitude = () => {
  init(API_KEY);
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
