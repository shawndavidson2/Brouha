export const isFutureGameTime = (date, time) => {
    if (!date || !time) {
        console.error('Invalid date or time:', row['Game-Date']);
        return false;
    }

    const gameDateTime = parseDateTime(date, time);
    const currentTime = new Date();

    return gameDateTime && gameDateTime > currentTime;

};

export const parseDateTime = (date, time) => {
    try {
        const [month, day, year] = date.trim().split('/');
        let [hour, minute] = time.trim().split(':');
        const period = time.trim().slice(-2); // AM or PM

        hour = parseInt(hour, 10);
        minute = parseInt(minute.slice(0, 2), 10);

        if (period === 'PM' && hour < 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        return new Date(year, month - 1, day, hour, minute);
    } catch (error) {
        console.error('Error parsing date and time:', date, time, error);
        return null;
    }
};