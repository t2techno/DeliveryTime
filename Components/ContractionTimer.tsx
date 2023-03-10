import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";
import { Text } from "react-native";
import styled from "styled-components";

type TimerProps = {
    logAction: (tStamp: string, action: string) => void,
    isContracting: boolean,
    contractionLengthText: string,
    interContractText: string
  };


const ContractionTimer: React.FC<TimerProps> = (props) => {
    const {logAction, isContracting, contractionLengthText, interContractText} = props;

    
    const onButtonClick = () => {
        const newTime = Date();

        // send time to parent for time between contractions calculation
        // Trigger prompts for food and water
        logAction(newTime, isContracting ? "End" : "Start");
    }

    const renderText = () => {
        if(contractionLengthText === ""){
            return (
                <Text>{interContractText}</Text>
            );
        }

        return (<>
            <Text>{contractionLengthText}</Text>
            <Text>{interContractText}</Text>
        </>);
    }

    const blueButton  = "#000080";
    const greenButton = "#008000";

    return (<>
        <Button title={(isContracting ? "End" : "Start" ) + " Contraction"} 
            color={isContracting ? blueButton : greenButton } 
            onPress={onButtonClick} />
        {renderText()}
    </>);
};

export default ContractionTimer;