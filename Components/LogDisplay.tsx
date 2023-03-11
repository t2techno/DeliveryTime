import React,{ useState } from 'react'
import { Text, Button } from "react-native";

// import this when I have more time
type LogAction = {
    tStamp: string,
    action: string
}

type LogDisplayProps = {
    logs: LogAction[]
}

const LogDisplay: React.FC<LogDisplayProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const renderLogs = () => {
        return props.logs.map( (val: LogAction, i: number) => {
            const actionTime   = new Date(val.tStamp);
            const actionString = (val.action === "Start" || val.action === "End") ? 
                val.action + " Contraction" : val.action;  
            return (
                <Text key={val.action+"_"+i}>{actionString + " - " + actionTime.toLocaleTimeString()}</Text>
            )
        });
    }

    return (<>
        <Button title={isOpen ? "Close Logs" : "Open Logs"} onPress={() => {setIsOpen(!isOpen)}}></Button>
        {isOpen ? renderLogs() : <></>}
    </>);
}

export default LogDisplay;