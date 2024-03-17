import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";

type TimerProps = {
    logAction: (tStamp: string, action: string) => void,
    isContracting: boolean
};


const ContractionTimer: React.FC<TimerProps> = (props) => {
    const {logAction, isContracting} = props;

    
    const onButtonClick = () => {
        const newTime = Date();

        // send time to parent for time between contractions calculation
        // Trigger prompts for food and water
        logAction(newTime, isContracting ? "End" : "Start");
    }

    const blueButton  = "#000080";
    const greenButton = "#008000";

    return (
        <Button title={(isContracting ? "End" : "Start" ) + " Contraction"} 
            color={isContracting ? blueButton : greenButton } 
            onPress={onButtonClick} />
    );
};

export default ContractionTimer;