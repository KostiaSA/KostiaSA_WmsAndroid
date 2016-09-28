import React, {Component} from "react";
import {View, Route, ListView} from "react-native";
import {Button, Icon, List, ListItem, Badge, Text as Text_} from "native-base";
import {BuhtaCoreScene, IBuhtaCoreSceneProps, BuhtaCoreSceneState} from "./BuhtaCoreScene";
import {BuhtaTaskSceneState} from "./BuhtaTaskScene";
import {ITaskSpecConfig} from "../config/Tasks";


export interface IBuhtaTaskContextMenuSceneProps extends IBuhtaCoreSceneProps {
    taskSceneState: BuhtaTaskSceneState;
}

export class IBuhtaTaskContextMenuSceneState extends BuhtaCoreSceneState<IBuhtaTaskContextMenuSceneProps> {

}

export class BuhtaTaskContextMenuScene extends BuhtaCoreScene<IBuhtaTaskContextMenuSceneProps, IBuhtaTaskContextMenuSceneState> {

    renderItems = (): JSX.Element[]=> {
        let Text = Text_ as any;
        let ret: JSX.Element[] = [];

        this.props.taskSceneState.props.taskConfig.specConfig.forEach((spec: ITaskSpecConfig, index: number)=> {
            if (spec.showInContextMenu===true) {
                ret.push(
                    <ListItem key={index} button onPress={()=>{alert("ok")}}>
                        <Text>{spec.taskSpecName}</Text>
                    </ListItem>
                );
            }
        }, this);

        // for (let i = 0; i < 10; i++) {
        //     ret.push(
        //         <ListItem key={i}>
        //             <Text>Задания в работе {i} бля</Text>
        //         </ListItem>
        //     );
        // }
        return ret;
    }

    render() {
        let Text = Text_ as any;

        return (
            <BuhtaCoreScene navigator={this.props.navigator} title="действия">
                <List>
                    {this.renderItems()}
                </List>
            </BuhtaCoreScene>);
    }
}