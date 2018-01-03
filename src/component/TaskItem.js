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
            expire
        } = this.props;

        const expireDate = new Date(expire);
        const expireText = `期限:${expireDate.getFullYear()}年${expireDate.getMonth() + 1}月${expireDate.getDate()}日${expireDate.getHours()}時${expireDate.getMinutes()}分`;

        return(
            <View style={styles.container}>
                <Text style={styles.text}>{text}/{expireText}</Text>
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