import React from "react";
import { Text, Button } from "react-native";

type ThingProps = {
    name: string,
    displayTime: string,
    thresholdColor: string,
    logAction: (tStamp: string, action: string) => void
}

const ThingTimer: React.FC<ThingProps> = (props) => {
    const {name, displayTime, thresholdColor, logAction} = props;

    return (<>
        <Text>Time since last {name}: {displayTime}</Text>
        <Button color={"#"+thresholdColor+"00a0"} title="+1" onPress={() => {logAction(Date(), name)}}></Button>
    </>);
}

export default ThingTimer;