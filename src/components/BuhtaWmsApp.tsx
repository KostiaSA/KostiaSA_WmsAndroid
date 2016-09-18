import React, {Component} from "react";
import {View, Text, Navigator, Route, fetch as IFetch, NativeModules} from "react-native";
import {BuhtaMenu} from "./BuhtaMenu";
import {getDb} from "../core/getDb";
import {DataTable} from "../core/SqlDb";
import {Button, Icon} from "native-base";
//import BuhtaMenu from "./BuhtaMenu";
//import * as RN from "react-native";
// See src/declarations.d.ts
//import Button from "react-native-button";

//import SpeechAndroid from "react-native-android-voice";


var ttt: string = "Глав-меню";

export default class BuhtaWmsApp extends Component<any, any> {
    x: string = "эТо меню";

    render() {
        return (
            <Navigator
                sceneStyle={{padding: 10}}
                initialRoute={{ title: ttt, index: 0 }}
                renderScene={(route:Route, navigator:Navigator) => {
                    return (
                    <View >
                       <Text style={{ fontSize: 20 }}>
                          Hello2 {route.title}!
                       </Text>
                       <Button success onPress={()=>{testVoice(this)}} > Пока 123 <Icon name='ios-star' /> Привет</Button>
                       <BuhtaMenu items={
                          [
                            {title:this.x, onPress:()=>{console.log(this.x);this.x+="*";this.forceUpdate()}},
                            {title:"Пункт меню 4",onPress:()=>{testSql()}}
                          ]
                       }/>
                     </View>);
                  }}

            />
        );
    }
}


declare var fetch: IFetch;

function testVoice(comp: Component<any,any>) {
    //  alert("test-voice");

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


    //switch (error) {
    // case SpeechAndroid.E_VOICE_CANCELLED:
    //     ToastAndroid.show("Voice Recognizer cancelled" , ToastAndroid.LONG);
    //     break;
    // case SpeechAndroid.E_NO_MATCH:
    //     ToastAndroid.show("No match for what you said" , ToastAndroid.LONG);
    //     break;
    // case SpeechAndroid.E_SERVER_ERROR:
    //     ToastAndroid.show("Google Server Error" , ToastAndroid.LONG);
    //     break;
    // /*And more errors that will be documented on Docs upon release*/
    //}
}

function testSql() {
    // alert("testSql-X");

    // let a:any = [];
    // for (let i = 0; i < 10; i++)
    //     a.push("0123456789");
    //
    // fetch('http://192.168.10.143:3000', {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         firstParam: 'yourValue',
    //         secondParam: 'yourOtherValue',
    //         a
    //     })
    // })
    //     .then((response) => {
    //         return response.json();
    //         //console.log(response.text());
    //         //console.error(response.text());
    //     })
    //     .then((json) => {
    //         alert(json);
    //         console.log(json);
    //         //console.error(json);
    //     })
    //
    //     .catch((error) => {
    //         console.error(error);
    //     });

    let x = getDb().executeSQL(["select  top 100 Номер, Название from ТМЦ", "select  top 10 Номер, Название from ТМЦ"])
        .then((tables: DataTable[])=> {
            alert("select ok");

        })
        .catch((error: string)=> {
            alert(error);
        });


}