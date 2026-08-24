import { formatDistanceToNowStrict } from "date-fns";

export const timeAgo = (date) => {
  if (!date) return "";
  try {
    return formatDistanceToNowStrict(new Date(date), { addSuffix: true });
  } catch {
    return "";
  }
};
