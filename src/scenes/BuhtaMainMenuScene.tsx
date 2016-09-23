import React, {Component} from "react";
import {View, Route, ListView} from "react-native";
import {Button, Icon, List, ListItem, Badge, Text as Text_} from "native-base";
import {BuhtaCoreScene, IBuhtaCoreSceneProps, BuhtaCoreSceneState} from "./BuhtaCoreScene";


export interface IBuhtaMainMenuSceneProps extends IBuhtaCoreSceneProps {

}

export class IBuhtaMainMenuSceneState extends BuhtaCoreSceneState<IBuhtaMainMenuSceneProps> {

}

export class BuhtaMainMenuScene extends BuhtaCoreScene<IBuhtaMainMenuSceneProps, IBuhtaMainMenuSceneState> {

    renderTest = (): JSX.Element[]=> {
        let Text = Text_ as any;
        let ret: JSX.Element[] = [];
        for (let i = 0; i < 150; i++) {
            ret.push(
                <ListItem key={i}>
                    <Text>Задания в работе {i} бля</Text>
                </ListItem>
            );
        }
        return ret;
    }

    render() {
        let Text = Text_ as any;
        console.log("render BuhtaScene");
        return (
            <BuhtaCoreScene navigator={this.props.navigator} title="Главное меню" backIcon="power-off">
                <List initialListSize={2}>
                    <ListItem iconLeft>
                        <Icon name='ios-chatboxes'/>
                        <Text>Задания в работе</Text>
                        <Badge>3</Badge>
                    </ListItem>
                    <ListItem iconLeft>
                        <Icon name='ios-alarm'/>
                        <Text>Задания ждут</Text>
                        <Badge>12</Badge>
                    </ListItem>
                    <ListItem iconLeft>
                        <Icon name='ios-notifications'/>
                        <Text>Печать этикетки</Text>
                        <Text note>не надо</Text>
                    </ListItem>
                    <ListItem iconLeft iconRight>
                        <Icon name='ios-mic'/>
                        <Text>Привязка штрих-кода</Text>
                        <Icon name='ios-mic-outline'/>
                    </ListItem>
                </List>
            </BuhtaCoreScene>);
    }
}
