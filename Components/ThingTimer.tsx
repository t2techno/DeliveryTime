import React from "react";
import { Text, Button } from "react-native";

type ThingProps = {
    name: string,
    displayTime: string,
    isBold: boolean,
    logAction: (tStamp: string, action: string) => void
}

const ThingTimer: React.FC<ThingProps> = (props) => {
    const {name, displayTime, isBold, logAction} = props;

    const notBold="#0000a0";
    const bold="#770080";

    return (<>
        <Text>Time since last {name}: {displayTime}</Text>
        <Button color={isBold ? bold: notBold} title="+1" onPress={() => {logAction(Date(), name)}}></Button>
    </>);
}

export default ThingTimer;