// libs
import { useState, useEffect } from 'react';

const convertDateDifference = (date1, date2) => {
    const differenceInMilliseconds = date2 - date1;

    const millisecondsInSecond = 1000;
    const millisecondsInMinute = millisecondsInSecond * 60;
    const millisecondsInHour = millisecondsInMinute * 60;
    const millisecondsInDay = millisecondsInHour * 24;
    const millisecondsInWeek = millisecondsInDay * 7;
    const millisecondsInMonth = millisecondsInDay * 30; // Approximate month

    if (differenceInMilliseconds >= millisecondsInMonth) {
        const months = Math.floor(differenceInMilliseconds / millisecondsInMonth);
        return `More than ${months} month(s)`;
    } else if (differenceInMilliseconds >= millisecondsInWeek) {
        const weeks = Math.floor(differenceInMilliseconds / millisecondsInWeek);
        return `More than ${weeks} week(s)`;
    } else {
        const days = Math.floor(differenceInMilliseconds / millisecondsInDay);
        const hours = Math.floor((differenceInMilliseconds % millisecondsInDay) / millisecondsInHour);
        const minutes = Math.floor((differenceInMilliseconds % millisecondsInHour) / millisecondsInMinute);
        const seconds = Math.floor((differenceInMilliseconds % millisecondsInMinute) / millisecondsInSecond);

        let result = '';
        if (Math.abs(days) > 0) result += `${days} d(s) `;
        if (Math.abs(hours) > 0) result += `${hours} h(s) `;
        if (Math.abs(minutes) > 0) result += `${minutes} min(s) `;
        result += `${seconds} sec(s)`;

        return result;
    }
};

const TimerComponent = ({ targetTime }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const targetTimeInMs = new Date(targetTime).getTime();

        const updateTimer = () => {
            const nowInMs = new Date().getTime();
            setTimeLeft(convertDateDifference(nowInMs, targetTimeInMs));
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, [targetTime]);

    return <span>{timeLeft}</span>;
};

export default TimerComponent;