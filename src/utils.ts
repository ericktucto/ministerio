import { format as dateFnsFormat } from 'date-fns/format'
import { differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'

type ConfigDifferent = {
  longFormat: string;
  shortFormat: string;
}
export class InvalidArgument extends Error { }
export function showHuman(
  dateToShow: Date,
  config: ConfigDifferent = {
    longFormat: "iiii dd 'de' MMMM 'del' yyyy h:mm a",
    shortFormat: "iiii 'a las' h:mm a",
  }
): string {
  const now = new Date();
  const diff = differenceInDays(
    new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    new Date(dateToShow.getFullYear(), dateToShow.getMonth(), dateToShow.getDate()),
  );
  if (diff < 7) {
    if (0 === diff) {
      return dateFnsFormat(
        dateToShow,
        "'hoy a las' h:mm a",
      );
    }
    if (1 === diff) {
      return dateFnsFormat(
        dateToShow,
        "'ayer a las' h:mm a",
      );
    }
    return dateFnsFormat(
      dateToShow,
      config.shortFormat,
      { locale: es }
    );
  }
  return dateFnsFormat(
    dateToShow,
    config.longFormat,
    { locale: es }
  );
}
