import dayjs from "dayjs";

export function getDateCurrent(isFormatted?: boolean) {
    const date = new Date();
    const month = String(date.getMonth()+1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = String(date.getFullYear())
    
    return isFormatted ? `${year}-${month}-${day}` : `${day}/${month}/${year}`
}

export function getTimeCurrent() {
    return dayjs().format('HH:mm');
}