import React, {Component} from 'react';

import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from 'react-native';


export default class TaskItem extends Component {

    render(){

        const {
            text,
        } = this.props;

        return(
            <View style={styles.container}>
                <Text style={styles.text}>{text}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 10,
        minHeight: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      text: {
        color: '#333',
      },
      doneText: {
          textDecorationLine: 'line-through'
      },
      deleteButton: {
        backgroundColor: '#800000',
      },
      left: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      textStyle: {
        fontWeight:'bold',
      }
});