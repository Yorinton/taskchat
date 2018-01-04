import React, {Component} from 'react';

import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from 'react-native';
import Button from './Button';

export default class TaskItem extends Component {

    render(){

        const {
            text,
            expire,
            responsible,
            onDone,
            onDelete,
            done
        } = this.props;

        const expireDate = new Date(expire);
        const expireText = `期限:${expireDate.getFullYear()}年${expireDate.getMonth() + 1}月${expireDate.getDate()}日${expireDate.getHours()}時${expireDate.getMinutes()}分`;
        const responsibleText = `担当:${responsible}`;

        return(
            <View style={styles.container}>
                <Text style={styles.text}>{text}{"\n"}{expireText}{"\n"}{responsibleText}</Text>
                <Button 
                    textStyle={styles.textStyle}
                    onPress={onDone}//onPressという名前でButtonにonDone関数を渡す
                    //doneの値もstateで管理している
                >
                    {done ? "Undo" : "Done"}
                </Button>
                <Button 
                    style={styles.deleteButton}
                    onPress={onDelete}
                >
                    Delete
                </Button>
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