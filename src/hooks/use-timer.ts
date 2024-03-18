import React from "react"

type TimerReturn = [number, ()=>void, Date]; 

export const INIT_TIME = new Date(0);

const useTimer = (startImmediately = false): TimerReturn => {
    const [time, setTime] = React.useState(0);
    const [isRunning, setIsRunning] = React.useState(startImmediately);
    const [startTime, setStartTime] = React.useState<Date>(INIT_TIME);

    React.useEffect(() => {
        if(!isRunning){
            return;
        }

        const timerId = window.setInterval(() => {
            setTime(state => state+1);
        }, 1000);

        return () => {
            window.clearInterval(timerId);
        }
    }, [isRunning]);

    const toggleTimer = React.useCallback(() => {
        setIsRunning(isRunning => !isRunning);

        // only set new start time on initial run
        setStartTime(state => {
            return state.getTime() == INIT_TIME.getTime() ?
                new Date() : state;
        })
    },[]);

    return [time, toggleTimer, startTime];
}

export default useTimer;