import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import ContractionTimer from './ContractionTimer';
import ThingTimer from './ThingTimer';
import LogDisplay from './LogDisplay';
import AsyncStorage from '@react-native-async-storage/async-storage';


type LogAction = {
    tStamp: string,
    action: string
}


// Gradually highlight Time since last contraction as it approaches last inter-contraction time
const AppWrapper = () => {
    const testDate   = new Date("01/18/1993");
    const logKey = "log_key";
    const prevContractKey  = "prevContract_key";
    const interContractKey = "interContract_key";
    const numContractKey   = "numContract_key";
    const lastWaterContractKey = "waterContract_key";

    const [begin, setBegin] = useState(false);

    const [currContractLength,setCurrContractLength] = useState("");
    const [prevContractLength, setPrevContractLength] = useState("");
    const [interContractLength,setInterContractLength] = useState("");
    const [numContractions, setNumContractions] = useState(0);

    const [isContracting, setIsContracting] = useState(false);
    const [contractStart, setContractStart] = useState(new Date());
    const [lastContractStart, setLastContractStart] = useState(new Date());

    const [lastWater, setLastWater] = useState(new Date());
    const [lastWaterContract, setLastWaterContract] = useState(0);
    const [waterDisplay, setWaterDisplay] = useState("");
    const [waterThreshold, setWaterThreshold] = useState(1800);

    const [lastFood,  setLastFood]  = useState(new Date());
    const [foodDisplay, setFoodDisplay] = useState("");
    const [foodThreshold, setFoodThreshold] = useState(5400);

    const [lastPee,   setLastPee]   = useState(new Date());
    const [peeDisplay, setPeeDisplay] = useState("");
    const [peeThreshold, setPeeThreshold] = useState(3600);

    const [actionLog,setActionLog]  = useState<LogAction[]>([]);

    const parseLog = (logs: LogAction[]) => {
        let waterMark = false;
        let foodMark  = false;
        let peeMark   = false;
        let startMark = false;
        let endMark   = false;
        let endTime   = new Date();
        let lastMark  = false;

        if(logs.length > 0){
            const firstTime = new Date(logs[0].tStamp);
            setLastWater(firstTime);
            setLastFood(firstTime);
            setLastPee(firstTime);
            setContractStart(firstTime);
            setLastContractStart(firstTime);
        }

        for(let i=logs.length-1; i>=0; i--){
            const time = new Date(logs[i].tStamp);
            switch(logs[i].action){
                case "End":
                    if(endMark){
                        break;
                    }

                    endMark = true;
                    endTime = time;
                    break;

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
                    setIsContracting(!endMark);
                    break;

                case "Water":
                    if(waterMark){
                        break;
                    }
                    setLastWater(time);
                    waterMark = true;
                    break;

                case "Food":
                    if(foodMark){
                        break;
                    }

                    setLastFood(time);
                    foodMark = true;
                    break;

                case "Pee":
                    if(peeMark){
                        break;
                    }
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
            console.log("loading logs...");
            AsyncStorage.getItem(logKey).then(val => {
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

            AsyncStorage.getItem(prevContractKey).then(res => {
                if(res != null){
                    setPrevContractLength(res);
                }
            }).catch(e =>{console.log("No previous contraction length")});
            AsyncStorage.getItem(interContractKey).then(res => {
                if(res != null){
                    setInterContractLength(res);
                }
            }).catch(e =>{console.log("No inter-contraction length")});
            AsyncStorage.getItem(numContractKey).then(res => {
                if(res != null){
                    setNumContractions(Number.parseInt(res));
                }
            }).catch(e =>{console.log("No num contractions")});
            AsyncStorage.getItem(lastWaterContractKey).then(res => {
                if(res != null){
                    setLastWaterContract(Number.parseInt(res));
                }
            }).catch(e =>{console.log("No num contractions since water")});
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
              AsyncStorage.setItem(logKey, jsonValue);
              AsyncStorage.setItem(prevContractKey, prevContractLength);
              AsyncStorage.setItem(interContractKey, interContractLength);
              AsyncStorage.setItem(numContractKey, numContractions.toString());
              AsyncStorage.setItem(lastWaterContractKey, lastWaterContract.toString());
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
            setCurrContractLength(generateTimeString(now, contractStart));

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
        setInterContractLength(generateTimeString(contractStart,lastContractStart));
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
        setNumContractions(1);
        setPrevContractLength("");
        setCurrContractLength("");
        setInterContractLength("");
        setLastContractStart(testDate);
        setContractStart(now);
        setLastWater(now);
        setLastFood(now);
        setLastPee(now);
        setLastWaterContract(0);
        setActionLog([{tStamp: now.toString(),
                       action: "Start"}]);
    }

    const handleAction = (tStamp: string, action: string) => {
        const actionTime = new Date(tStamp);
        switch(action) {
            case 'Start':
                setIsContracting(true);
                setNumContractions(numContractions+1);
                setLastContractStart(new Date(contractStart));
                setContractStart(actionTime);
                setLastWaterContract(lastWaterContract+1);
                break;

            case 'End':
                setIsContracting(false);
                setPrevContractLength(generateTimeString(actionTime,contractStart));
                break;

            case 'Water':
                setLastWater(actionTime);
                setLastWaterContract(0);
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
        const diff  = compareTime/threshold;
        const redAmount = Math.floor(Math.min(diff*255,255));
        return redAmount.toString(16).padStart(2,'0');
    }

    const deriveWaterColor = (d: Date, threshold: number) => {
        const now = new Date();
        let compareTime = now.getTime() - d.getTime();
        compareTime = Math.floor(compareTime/1000);
        const diff  = compareTime/threshold;

        //have to compare to contractions
        let redAmount = Math.floor(Math.min(diff*255,255));
        let redContract = Math.floor((lastWaterContract/4)*255);
        redAmount = Math.max(redAmount,redContract);
        return redAmount.toString(16).padStart(2,'0');
    }

    return (<View style={[styles.container]}>
        {!begin ? <Button title='Begin Labor' color={"#008000"} onPress={init}></Button> : <></>}
        <View style={[styles.container]}>
            <View style={{flex: 2}}><ContractionTimer logAction={handleAction} isContracting={isContracting}/></View>
            <Text style={{flex: 1}}>Previous Contraction Length: {prevContractLength}</Text>
            <Text style={{flex: 1}}>{(isContracting ? "Current Contraction: ":"Time Since Last Contraction: ") 
                + currContractLength}</Text>
            <Text style={{flex: 1}}>Inter-Contraction Time: {interContractLength}</Text>
            <Text style={{flex: 1}}>Number of Contractions: {numContractions}</Text>
        </View>
        <View style={[styles.container]}>
            <Text>{lastWaterContract} Contraction{lastWaterContract == 1 ? "":"s"} since last Water</Text>
            <ThingTimer name="Water" displayTime={waterDisplay} thresholdColor={deriveWaterColor(lastWater,waterThreshold)} logAction={handleAction}/>
        </View>
        <View style={[styles.container]}>
            <ThingTimer name="Food"  displayTime={foodDisplay}  thresholdColor={deriveThingColor(lastFood,foodThreshold)} logAction={handleAction}/>
        </View>
        <View style={[styles.container]}>
            <ThingTimer name="Pee"   displayTime={peeDisplay}   thresholdColor={deriveThingColor(lastPee,peeThreshold)} logAction={handleAction}/>
        </View>
        <View style={[styles.container]}>
            <LogDisplay logs={actionLog}/>
        </View>
        <Text></Text><Text></Text><Text></Text><Text></Text><Text></Text><Text></Text>
        <View style={{alignSelf: "flex-end"}}><Button title="Restart" onPress={init}></Button></View>
    </View>);
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      flexDirection: 'column'
    }
});

export default AppWrapper;