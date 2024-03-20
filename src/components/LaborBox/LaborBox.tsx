import React from "react";
import styled from "styled-components";
import { INIT_TIME } from "../../hooks/use-timer";

interface LaborBoxProps {
    className?: string;
    elapsedTime: number;
    toggleTimer: () => void;
    startTime: Date
}

const LaborBox: React.FC<LaborBoxProps> = ({className, elapsedTime, toggleTimer, startTime}) => {
    return (
        <Wrapper className={className}>
            {startTime.getTime() == INIT_TIME.getTime() ?  <NotStarted toggleTimer={toggleTimer}/> : <Started elapsedTime={elapsedTime} startTime={startTime}/>}
        </Wrapper>
    );
}

const NotStarted = ({toggleTimer}:{toggleTimer: ()=>void}) => {
    return(<>
        <p>Labor has not yet begun...</p>
        <button onClick={toggleTimer}>BEGIN THING!</button>
    </>)
};

const Started = ({elapsedTime, startTime}:{elapsedTime: number, startTime: Date}) => {
    return(<>
        <p>{elapsedTime}</p>
        <p>{startTime.getTime()}</p>
    </>)
};

const Wrapper = styled.div`
    border: white solid 1px;
`;


export default LaborBox;