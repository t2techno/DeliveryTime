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

    const generateTimeString = (now: Date, then: Date) => {
        let time = now.getTime() - then.getTime();
        time = Math.floor(time/1000);
        
        let minComp  = Math.floor(time/60);
        let secComp  = time%60;
        let outString = minComp.toString().padStart(2,'0') + 
        " minutes, " + secComp.toString().padStart(2,'0') + " seconds";
        return outString;
    }

    const renderLogs = () => {
        let logStrings: string[] = [];
        let numContractions = 1;
        for(let i=0; i<props.logs.length; i++){
            let actionTime = new Date(props.logs[i].tStamp);
            let actionString = props.logs[i].action;
            if(props.logs[i].action == "Start"){
                logStrings.push("Start Contraction " + numContractions + " - " + actionTime.toLocaleTimeString());
                // find end for contraction length
                let j = i+1;
                while(j < props.logs.length && props.logs[j].action != "End"){
                    j+=1
                }

                if(j < props.logs.length && props.logs[j].action === "End"){
                    let endTime = new Date(props.logs[j].tStamp);
                    logStrings.push("\t\t"+generateTimeString(endTime, actionTime));
                }
                continue;
            } else if(props.logs[i].action == "End"){
                actionString = "End Contraction " + numContractions;
                numContractions+=1;

            }

            logStrings.push(actionString + " - " + actionTime.toLocaleTimeString())
        }
        return logStrings.map( (val: string, i: number) => {
            return (
                <Text key={"log_"+i}>{val}</Text>
            )
        });
    }

    return (<>
        <Button title={isOpen ? "Close Logs" : "Open Logs"} onPress={() => {setIsOpen(!isOpen)}}></Button>
        {isOpen ? renderLogs() : <></>}
    </>);
}

export default LogDisplay;