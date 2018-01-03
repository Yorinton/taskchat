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
                <TouchableOpacity
                    onPress={this.props.onPress}
                >
                    <Text>Task</Text>
                </TouchableOpacity>
            </View>
        );
    }
}