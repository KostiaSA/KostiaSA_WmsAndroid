import React, {Component} from "react";

import {
    View, Text, Navigator, Route, ListView, TouchableHighlight,
    ViewStyle, TextStyle, StyleSheet
} from "react-native";


export interface IBuhtaMenuItemStyle {
    view: ViewStyle;
    title: TextStyle;
    description: TextStyle;
    separator: ViewStyle;
}


export interface IBuhtaMenuItemProps {
    title: React.ReactNode;
    description?: React.ReactNode;
    onPress?: () => void;
    style?: IBuhtaMenuItemStyle;
}

export const DefaultBuhtaMenuItemStyle: IBuhtaMenuItemStyle = {
    view: {
        backgroundColor: 'white',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    title: {
        fontSize: 17,
        fontWeight: '500',
    },
    description: {
        fontSize: 15,
        color: '#888888',
        lineHeight: 20,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#bbbbbb',
        marginLeft: 15,
    },

}

export class BuhtaMenuItem extends Component<IBuhtaMenuItemProps, any> {

    render() {
        let style = this.props.style || DefaultBuhtaMenuItemStyle;

        return (
            <View key={this.props.title.toString()}>
                <TouchableHighlight onPress={this.props.onPress}>
                    <View style={style.view}>
                        <Text style={style.title}>
                            {this.props.title}
                        </Text>
                        <Text style={style.description}>
                            {this.props.description}
                        </Text>
                    </View>
                </TouchableHighlight>
                <View style={style.separator}/>
            </View>
        );
    }
}


export interface IBuhtaMenuProps {
    title?: string;
    items: IBuhtaMenuItemProps [];
}

export class BuhtaMenu extends Component<IBuhtaMenuProps, any> {

    render() {

        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        ds = ds.cloneWithRows(this.props.items);

        return (
            <ListView
                dataSource={ds}
                renderRow={(rowData) => <BuhtaMenuItem {...rowData}/>}
            />
        );
    }
}
