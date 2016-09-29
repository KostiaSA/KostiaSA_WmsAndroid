import {IMessage} from "../interfaces/IMessage";
import {IMessageParams} from "../interfaces/IMessageParams";
import {pushSpeak} from "./speak";
var Sound = require('react-native-sound') as any;
import {ToastAndroid} from "react-native";


export let lastMessage: IMessage | undefined;
export let lastParams: IMessageParams | undefined;

export function runLastMessage() {
    if (lastMessage !== undefined)
        runMessage(lastMessage, lastParams);
}

export function runMessage(message: IMessage, params?: IMessageParams) {
    lastMessage = message;
    lastParams = params;
    
    if (params !== undefined) {
        if (params.p1 !== undefined) {
            if (message.sound !== undefined)
                message.sound = message.sound.replace("%1", params.p1);
            if (message.voice !== undefined)
                message.voice = message.voice.replace("%1", params.p1);
            if (message.toast !== undefined)
                message.toast = message.toast.replace("%1", params.p1);
        }
        if (params.p2 !== undefined) {
            if (message.sound !== undefined)
                message.sound = message.sound.replace("%2", params.p2);
            if (message.voice !== undefined)
                message.voice = message.voice.replace("%2", params.p2);
            if (message.toast !== undefined)
                message.toast = message.toast.replace("%2", params.p2);
        }
        if (params.p3 !== undefined) {
            if (message.sound !== undefined)
                message.sound = message.sound.replace("%3", params.p3);
            if (message.voice !== undefined)
                message.voice = message.voice.replace("%3", params.p3);
            if (message.toast !== undefined)
                message.toast = message.toast.replace("%3", params.p3);
        }
    }

    if (message.toast !== undefined) {
        ToastAndroid.show(message.toast, ToastAndroid.LONG);
    }

    if (message.sound !== undefined && message.voice !== undefined) {
        var sound = new Sound(message.sound, Sound.MAIN_BUNDLE, (error: any) => {
            if (error) {
                console.log('failed to load the sound', error);
            } else { // loaded successfully
                sound.play();
                setTimeout(()=> {
                    pushSpeak(message.voice!);
                }, 800);
                //console.log('duration in seconds: ' + whoosh.getDuration() +
                //  'number of channels: ' + whoosh.getNumberOfChannels());
            }
        });
    }
    else if (message.sound !== undefined) {
        var sound = new Sound(message.sound, Sound.MAIN_BUNDLE, (error: any) => {
            if (error) {
                console.log('failed to load the sound', error);
            } else { // loaded successfully
                sound.play();
            }
        });
    }
    else if (message.sound !== undefined) {
        pushSpeak(message.voice!);
    }
}
