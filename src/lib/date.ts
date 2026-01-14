/**
 * Convierte una fecha de string (YYYY-MM-DD HH:mm:ss) a tiempo relativo.
 * @param dateString - La fecha proveniente de la API.
 * @param t - Objeto de traducciones para date.
 * @returns Un string con el tiempo transcurrido.
 */
export function getRelativeTime(dateString: string, t: any): string {
  const now = new Date();
  const date = new Date(dateString.replace(' ', 'T'));
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const MINUTE = 60;
  const HOUR = 3600;
  const DAY = 86400;
  const WEEK = 604800;
  const MONTH = 2592000;
  const YEAR = 31536000;

  const prefix = t.prefix || "";
  const suffix = t.suffix || "";

  if (diffInSeconds < MINUTE) {
    return `${prefix}${t.seconds}${suffix}`;
  }

  if (diffInSeconds < HOUR) {
    const minutes = Math.floor(diffInSeconds / MINUTE);
    const unit = minutes > 1 ? t.minutes : t.minute;
    return `${prefix}${minutes} ${unit}${suffix}`;
  }

  if (diffInSeconds < DAY) {
    const hours = Math.floor(diffInSeconds / HOUR);
    const unit = hours > 1 ? t.hours : t.hour;
    return `${prefix}${hours} ${unit}${suffix}`;
  }

  if (diffInSeconds < WEEK) {
    const days = Math.floor(diffInSeconds / DAY);
    const unit = days > 1 ? t.days : t.day;
    return `${prefix}${days} ${unit}${suffix}`;
  }

  if (diffInSeconds < MONTH) {
    const weeks = Math.floor(diffInSeconds / WEEK);
    const unit = weeks > 1 ? t.weeks : t.week;
    return `${prefix}${weeks} ${unit}${suffix}`;
  }

  if (diffInSeconds < YEAR) {
    const months = Math.floor(diffInSeconds / MONTH);
    const unit = months > 1 ? t.months : t.month;
    return `${prefix}${months} ${unit}${suffix}`;
  }

  const years = Math.floor(diffInSeconds / YEAR);
  const unit = years > 1 ? t.years : t.year;
  return `${prefix}${years} ${unit}${suffix}`;
}
