// libs
import { useState, useEffect } from 'react'

const convertDateDifference = (date1, date2) => {
    const differenceInMilliseconds = date2 - date1
    const isNegative = differenceInMilliseconds < 0
    // Use absolute value for calculations
    const absDifference = Math.abs(differenceInMilliseconds)

    const millisecondsInSecond = 1000
    const millisecondsInMinute = millisecondsInSecond * 60
    const millisecondsInHour = millisecondsInMinute * 60
    const millisecondsInDay = millisecondsInHour * 24
    const millisecondsInWeek = millisecondsInDay * 7
    const millisecondsInMonth = millisecondsInDay * 30 // Approximate month

    if (absDifference >= millisecondsInMonth) {
        const months = Math.floor(absDifference / millisecondsInMonth)
        return `${isNegative ? '-' : ''}${months} month(s)`
    } else if (absDifference >= millisecondsInWeek) {
        const weeks = Math.floor(absDifference / millisecondsInWeek)
        return `${isNegative ? '-' : ''}${weeks} week(s)`
    } else {
        const days = Math.floor(absDifference / millisecondsInDay)
        const hours = Math.floor(
            (absDifference % millisecondsInDay) / millisecondsInHour
        )
        const minutes = Math.floor(
            (absDifference % millisecondsInHour) / millisecondsInMinute
        )
        const seconds = Math.floor(
            (absDifference % millisecondsInMinute) / millisecondsInSecond
        )

        let result = isNegative ? '-' : ''
        if (days > 0) result += `${days}d `
        if (hours > 0) result += `${hours}h `
        if (days < 1) {
            if (minutes > 0) result += `${minutes}m `
            result += `${seconds}s`
        }

        return result.trim()
    }
}

const TimerComponent = ({ targetTime }) => {
    const [timeLeft, setTimeLeft] = useState('')
    const [isNegative, setIsNegative] = useState(false)

    useEffect(() => {
        const targetTimeInMs = new Date(targetTime).getTime()

        const updateTimer = () => {
            const nowInMs = new Date().getTime()
            const diff = targetTimeInMs - nowInMs
            setIsNegative(diff < 0)
            setTimeLeft(convertDateDifference(nowInMs, targetTimeInMs))
        }

        updateTimer()
        const timer = setInterval(updateTimer, 1000)

        return () => clearInterval(timer)
    }, [targetTime])

    return (
        <span className={isNegative ? 'text-danger' : 'text-success'}>
            {timeLeft}
        </span>
    )
}

export default TimerComponent
