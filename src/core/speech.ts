import {View, Text, Navigator, Route, fetch as IFetch, NativeModules, AppRegistry, Vibration, BackAndroid} from "react-native";

export function speech(text:string) {
     let SpeechAndroid = NativeModules.SpeechAndroid;

    NativeModules.SpeechAndroid.startSpeech("говори", SpeechAndroid.RUSSIAN)
        .then((text: string)=> {
            console.log(text);
            ttt=text;
            comp.forceUpdate();
        })
        .catch((error: any)=> {
            console.log(error);
            ttt=error.toString();
            comp.forceUpdate();
        });
    //
    //
    // //switch (error) {
    // // case SpeechAndroid.E_VOICE_CANCELLED:
    // //     ToastAndroid.show("Voice Recognizer cancelled" , ToastAndroid.LONG);
    // //     break;
    // // case SpeechAndroid.E_NO_MATCH:
    // //     ToastAndroid.show("No match for what you said" , ToastAndroid.LONG);
    // //     break;
    // // case SpeechAndroid.E_SERVER_ERROR:
    // //     ToastAndroid.show("Google Server Error" , ToastAndroid.LONG);
    // //     break;
    // // /*And more errors that will be documented on Docs upon release*/
    // //}
}
