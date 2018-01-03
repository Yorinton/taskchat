import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';

export default class TaskButton extends Component {

    render() {
        return (
            <View>
                <TouchableOpacity>
                    <Text>Task</Text>
                </TouchableOpacity>
            </View>
        );
    }
}