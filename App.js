/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';
import TodoInput from './src/component/TodoInput';
import TodoItem from './src/component/TodoItem';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {

  constructor(props){
    super(props);

    this.state = {
      list:[],//listという名前で配列を初期化
    };//オブジェクトリテラル
  }


  _delete = (index) => () => {
    const list = [].concat(this.state.list);
    list.splice(index,1);//keyがindexの要素を１つ削除する

    console.log(index);
    this.setState({
      list,
    });
  }

  _done = (index) => () => {
    const list = [].concat(this.state.list);
    list[index].done = !list[index].done;//keyがindexの要素のdoneの値(true/false)を反転させる

    this.setState({
      list,
    });
  }

  _onPress = (text) => {

    const list = [].concat(this.state.list);//this.state.listを[]に連結させる

    list.push({
      key: Date.now(),//ここはkeyという名前でないとダメ
      text: text,
      done: false
    });//listに新しい要素を追加

    this.setState({//stateを変更して再度renderメソッドを走らせる
      list,
    });

  }

  //onPress2という名前でthis.displayという関数を子コンポーネントに送っている
  render() {

    const {
      list,
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <TodoInput onPressProp={this._onPress}/>
          <View style={styles.todoListContainer}>
            <FlatList
              style={styles.todoList}
              data={list}//レンダリングしたい配列
              renderItem={({item,index}) => <TodoItem
                //item = list,index = listに振られたkey(0,1,2,3...)
                onDelete={this._delete(index)}
                onDone={this._done(index)}
                keyCode={item.key}
                {...item}//itemは複数になる可能性があるので可変長引数
               />
              }//TodoItemコンポーネントの引数にitemを指定
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
    paddingTop: 40,
    alignItems: 'center',
  },
  main: {
    flex: 1,
    maxWidth: 400,
    alignItems: 'center',
  },
  todoListContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  todoList: {
    paddingLeft: 10,
    paddingRight: 10,
  }
});
