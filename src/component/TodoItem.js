import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import Button from './Button';

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

const TodoItem = (props) => {//stateless functional component = パフォーマンスが良い
    const {
        text,
        onDelete,
        onDone,
        done,
        keyCode,
    } = props;//引数で受け取ったpropsからtextを抽出

    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <Button 
                    textStyle={styles.textStyle}
                    onPress={onDone}//onPressという名前でButtonにonDone関数を渡す
                >
                    {done ? "Undo" : "Done"}
                </Button>
                <Text style={[styles.text, done && styles.doneText]} >{text}/{keyCode}</Text>
            </View>
            <Button 
                style={styles.deleteButton}
                onPress={onDelete}
            >
                Delete
            </Button>
        </View>
    
    );

}

export default TodoItem;