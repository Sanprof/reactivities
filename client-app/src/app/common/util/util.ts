export const combineDateAndTime = (date: Date, time: Date) => {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        0
    );
};
