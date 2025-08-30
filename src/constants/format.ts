import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function formatNumber(number: number, removeCoin?: boolean) {
    if (removeCoin)
        return new Intl.NumberFormat('pt-Br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
    return new Intl.NumberFormat('pt-Br', { style: 'currency', currency: 'BRL' }).format(number)
}

export function formatCurrToNumber(curr: string): number {
    return Number(curr.replaceAll('.', '').replace(',', '.').replace('R$ ', '').replace('R$', ''));
}

export function getDateCurrentString(): string {
    return dayjs().tz(dayjs.tz.guess()).format();
}

export function removeSpecialChars(value: string) {
    return value.replace(/[^a-zA-Z0-9\s]/g, '');
}

export function formatDate(date: string) {
    const newDate = date.split('/')
    return `${newDate[2]}-${newDate[1]}-${newDate[0]}`
}