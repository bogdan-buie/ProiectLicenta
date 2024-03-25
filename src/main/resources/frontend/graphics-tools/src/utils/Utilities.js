export const millisToDateTime = (millis) => {
    const date = new Date(millis);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/Bucharest' // Setează fusul orar la România
    };
    return date.toLocaleDateString('ro-RO', options);
};
