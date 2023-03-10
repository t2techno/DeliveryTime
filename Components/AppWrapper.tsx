import React, { useEffect, useState } from 'react';
import { Button, Text } from 'react-native';
import ContractionTimer from './ContractionTimer';
import ThingTimer from './ThingTimer';
import AsyncStorage from '@react-native-async-storage/async-storage';


type LogAction = {
    tStamp: string,
    action: string
}

const AppWrapper = () => {
    const testDate   = new Date("01/18/1993");
    const storageKey = "log";

    const [begin, setBegin] = useState(false);

    const [currContractLengthText,setCurrContractLengthText] = useState("");
    const [prevContractLength, setPrevContractLength] = useState("");
    const [interContractText,setInterContractText] = useState("");

    const [isContracting, setIsContracting] = useState(false);
    const [contractStart, setContractStart] = useState(new Date());
    const [lastContractStart, setLastContractStart] = useState(new Date());

    const [lastWater, setLastWater] = useState(new Date());
    const [waterDisplay, setWaterDisplay] = useState("");
    const [waterThreshold, setWaterThreshold] = useState(1800);

    const [lastFood,  setLastFood]  = useState(new Date());
    const [foodDisplay, setFoodDisplay] = useState("");
    const [foodThreshold, setFoodThreshold] = useState(6400);

    const [lastPee,   setLastPee]   = useState(new Date());
    const [peeDisplay, setPeeDisplay] = useState("");
    const [peeThreshold, setPeeThreshold] = useState(3600);

    const [actionLog,setActionLog]  = useState<LogAction[]>([]);

    const parseLog = (logs: LogAction[]) => {
        let waterMark = false;
        let foodMark  = false;
        let peeMark   = false;
        let startMark = false;
        let lastMark  = false;

        if(logs.length > 0){
            const firstTime = new Date(logs[0].tStamp);
            setLastWater(firstTime);
            setLastFood(firstTime);
            setLastPee(firstTime);
            setContractStart(firstTime);
            setLastContractStart(firstTime);
        }
        

        console.log("parsing " + logs.length + " logs");

        for(let i=logs.length-1; i>=0; i--){
            console.log(logs[i]);
            const time = new Date(logs[i].tStamp);
            switch(logs[i].action){
                case "Start":
                    if(startMark && lastMark){
                        break;
                    }

                    if(startMark){
                        setLastContractStart(time);
                        lastMark = true;
                        break;
                    }

                    setContractStart(time);
                    startMark = true;
                    let contraction = true;
                    for(let j=i+1; j<logs.length; j++){
                        if(logs[j].action === "End"){
                            contraction = false;
                        }
                    }
                    setIsContracting(contraction);
                    break;

                case "Water":
                    setLastWater(time);
                    waterMark = true;
                    break;

                case "Food":
                    setLastFood(time);
                    foodMark = true;
                    break;

                case "Pee":
                    setLastPee(time);
                    peeMark = true;
                    break;


            }
            if(startMark && lastMark &&
                waterMark && foodMark && peeMark){
                // all data populated
                break;
            }
        }
        
    }

    // Load Data on app open
    useEffect(() => {
        const getData = async() => {
            console.log("loading data...");
            AsyncStorage.getItem(storageKey).then(val => {
                if (val != null){
                    console.log("data retrieved!");
                    console.log(val);
                    const newActionLog = [...JSON.parse(val),{tStamp:Date(), action:"Re-Open"}];
                    setActionLog(newActionLog);
                    parseLog(newActionLog);
                    setBegin(true);
                }
            }).catch(e => {
                console.log(e);
                console.log("nothing retrieved");
            });
        };
        
        getData();
    },[])

    // save action log
    useEffect(() => {
        console.log(actionLog[actionLog.length-1]);
        const storeData = (() => {
            try {
              console.log("storing data");
              const jsonValue = JSON.stringify(actionLog);
              AsyncStorage.setItem(storageKey, jsonValue);
            } catch (e) {
            }
        });
        if(actionLog.length == 0 || actionLog[actionLog.length-1]?.action == "Re-Open"){
            console.log("not double-recording open");
        } else {
            storeData();
        }
    },[actionLog]);

    // timer update
    useEffect(() => { 
        // update every .5 second
        const intervalId = setInterval(() => {
            if(!begin){
                return;
            }
            let newContractLengthText  = "";
            const now = new Date();
            if (isContracting){
                newContractLengthText = "Current Contraction: " + generateTimeString(now, contractStart);
            } else {
                newContractLengthText = "Time Since Last Contraction: " + generateTimeString(now, contractStart);
            }
            setCurrContractLengthText(newContractLengthText);

            setWaterDisplay(generateTimeString(now,lastWater));
            setFoodDisplay(generateTimeString(now, lastFood));
            setPeeDisplay(generateTimeString(now,  lastPee));
        }, 750);
        //Cleanup method
        return () => clearInterval(intervalId);
    });

    // Update inter-contraction time
    useEffect(() => {
        let newInterContractText = "Inter-Contraction Time: ";
        setInterContractText(newInterContractText + generateTimeString(contractStart,lastContractStart));
    }, [contractStart, lastContractStart])

    const generateTimeString = (now: Date, then: Date) => {
        if(then.getTime() === testDate.getTime()){
            return '00:00';
        }
        let time = now.getTime() - then.getTime();
        time = Math.floor(time/1000);
        
        let minComp  = Math.floor(time/60);
        let secComp  = time%60;
        let outString = minComp.toString().padStart(2,'0') + 
        ":" + secComp.toString().padStart(2,'0');
        return outString;
    }

    const init = () => {
        const now = new Date();
        setBegin(true);
        setIsContracting(true);
        setLastContractStart(testDate);
        setContractStart(now);
        setLastWater(now);
        setLastFood(now);
        setLastPee(now);
        setActionLog([{tStamp: now.toString(),
                       action: "Start"}]);
    }

    const handleAction = (tStamp: string, action: string) => {
        const actionTime = new Date(tStamp);
        switch(action) {
            case 'Start':
                setIsContracting(true);
                setLastContractStart(new Date(contractStart));
                setContractStart(actionTime);
                break;

            case 'End':
                setIsContracting(false);
                setPrevContractLength(generateTimeString(actionTime,contractStart));
                break;

            case 'Water':
                setLastWater(actionTime);
                break;

            case 'Food':
                setLastFood(actionTime);
                break;

            case 'Pee':
                setLastPee(actionTime);
                break;
        }
        setActionLog([...actionLog, {tStamp, action}]);
    }

    const deriveThingColor = (d: Date, threshold: number) => {
        const now = new Date();
        let compareTime = now.getTime() - d.getTime();
        compareTime = Math.floor(compareTime/1000);
        console.log("time: " + compareTime);
        const diff  = compareTime/threshold;
        const redAmount = Math.floor(Math.min(diff*255,255));
        return redAmount.toString(16).padStart(2,'0');
    }

    return (<>
        {!begin ? <Button title='Begin Labor' color={"#008000"} onPress={init}></Button> : <></>}
        <ContractionTimer logAction={handleAction} isContracting={isContracting}/>
        
        <Text>Previous contraction Length: {prevContractLength}</Text>
        <Text>{currContractLengthText}</Text>
        <Text>{interContractText}</Text>

        <ThingTimer name="Water" displayTime={waterDisplay} thresholdColor={deriveThingColor(lastWater,waterThreshold)} logAction={handleAction}/>
        <ThingTimer name="Food"  displayTime={foodDisplay}  thresholdColor={deriveThingColor(lastFood,foodThreshold)} logAction={handleAction}/>
        <ThingTimer name="Pee"   displayTime={peeDisplay}   thresholdColor={deriveThingColor(lastPee,peeThreshold)} logAction={handleAction}/>

        <Button title="Restart" onPress={init}></Button>
    </>);
};

export default AppWrapper;