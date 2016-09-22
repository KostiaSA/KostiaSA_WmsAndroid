import {
    View,
    Text,
    Navigator,
    Route,
    fetch as IFetch,
    NativeModules,
    AppRegistry,
    Vibration,
    BackAndroid
} from "react-native";

import * as tts_ from "react-native-android-speech"
let tts = tts_ as any;

function speak(text: string) {
    console.log(tts);
    tts.speak({
        text: text, // Mandatory
        pitch: 1.2, // Optional Parameter to set the pitch of Speech,
        forceStop: false, //  Optional Parameter if true , it will stop TTS if it is already in process
        language: "ru" // Optional Paramenter Default is en you can provide any supported lang by TTS
    }).then((isSpeaking: boolean)=> {
        //Success Callback
        console.log(isSpeaking);
    }).catch((error: any)=> {
        //Errror Callback
        console.log(error)
    });

}

let speaks: string[] = [];

tts.isSpeaking().then((x: any)=> {
    console.log("tts.isSpeaking()");
    console.log(x);
});

export function pushSpeak(text: string) {
    // todo setOnUtteranceProgressListener - сделать перехват конца речи
    speak(text);
    //speaks.push(text);
}

// setInterval(() => {
//     console.log("tts.isSpeaking()");
//     console.log(tts.isSpeaking());
//     if (speaks.length > 0 && tts.isSpeaking() !== true) {
//         let text = speaks[0];
//         speaks = speaks.slice(1);
//         speak(text);
//     }
// }, 500);
