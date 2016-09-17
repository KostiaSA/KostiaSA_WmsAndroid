import React, {Component} from "react";
import {View, Text, Navigator, Route, ListView} from "react-native";

export default class BuhtaMainMenu extends Component<any, any> {

    render() {

        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        ds = ds.cloneWithRows(["Разгрузка", "Подбор", "Погрузка"]);

        return (
            <ListView
                dataSource={ds}
                renderRow={(rowData) => <Text>{rowData}</Text>}
            />
        );
    }
}
