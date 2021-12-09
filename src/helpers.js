import moment from "moment";
moment.locale('es');

export const timeago = (timestamp) => {
  return moment(timestamp).startOf("minute").fromNow();
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};
