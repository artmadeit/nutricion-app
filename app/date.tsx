import { parse } from "date-fns";
import { format } from "date-fns/fp";

export const formatDateTime = format("dd/MM/yyyy HH:mm");

export const parseDate = (date: string) =>
  parse(date, "yyyy-MM-dd", new Date());

export const parseTime = (date: string) =>
  parse(date, "HH:mm:ss", new Date());