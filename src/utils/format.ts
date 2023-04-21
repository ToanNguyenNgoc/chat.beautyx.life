import dayjs from "dayjs";
import locale from "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";

export const dateFromNow = (date: string) => {
  dayjs.extend(relativeTime);
  return dayjs(date).locale(locale.name).fromNow();
};