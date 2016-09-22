import React, {Component} from "react";
import {View, Route, ListView} from "react-native";
import {Button, Icon, List, ListItem, Badge, Text as Text_} from "native-base";
import {BuhtaCoreScene, IBuhtaCoreSceneProps, IBuhtaCoreSceneState} from "./BuhtaCoreScene";

export type TaskAction ="подбор" | "размещение" | "приемка";

export interface IBuhtaTaskSceneProps extends IBuhtaCoreSceneProps {
    taskId: number;
    userId: number;
    action: TaskAction;
}

export class BuhtaTaskSceneState implements IBuhtaCoreSceneState {
    isMounted: boolean;
    scene: BuhtaTaskScene;
    props: IBuhtaTaskSceneProps;
    fromPlaceType: string | undefined;
    fromPlaceId: number  | undefined;
    intoPlaceType: string  | undefined;
    intoPlaceId: number  | undefined;
    steps: TaskStep[] = [];

    handleBarcodeScan(barcode: string) {

    }

    isStepsLoaded: boolean;

    loadIncompletedStepsFromSql(){

        let sql=`
SELECT 
   Счет,
   МестоТип,
   Место,
   ОбъектТип,
   Объект,
   ДоговорПриходаТип,
   ДоговорПрихода,
   ЗаданиеТип,
   Задание,
   СотрудникТип,
   Сотрудник,
   Количество,
   dbo.  ОбъектНазвание,
   
FROM Остаток
WHERE 
   ЗаданиеТип='Док' AND Задание=${this.props.taskId} AND
   ((СотрудникТип='Чел' AND Сотрудник=${this.props.userId}) OR (СотрудникТип='Нет') )  
        `;


    }
}

export class TaskStep {
    isCompleted: boolean;
    action: TaskAction;
    objectType: string;
    objectId: number;
    objectName: string;
    fromPlaceType: string;
    fromPlaceId: number;
    fromPlaceName: number;
    intoPlaceType: string;
    intoPlaceId: number;
    intoPlaceName: number;
}

export class BuhtaTaskScene extends Component<IBuhtaTaskSceneProps, BuhtaTaskSceneState> {

    constructor(props: IBuhtaTaskSceneProps, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
        this.state = new BuhtaTaskSceneState();
        this.state.props = this.props;
        this.state.scene = this;
    }

    componentDidMount = () => {
        this.state.isMounted = true;
    };


    renderIncompleteSteps():JSX.Element {

    }


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
            <BuhtaCoreScene navigator={this.props.navigator} title={"Задание "+this.props.taskId}>
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
