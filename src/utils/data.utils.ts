import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const applyDataEmissaoMatcherRules = (text: string): string => {
  if (text.length === 16) {
    text = text.concat(':00');
  }
  if (text.length != 19) {
    return null;
  }
  return text;
};
