/* eslint-disable prettier/prettier */
import React from 'react';
import {View, TouchableOpacity, Text, FlatList, StyleSheet, Alert, Dimensions} from 'react-native';
import {Colors} from '../Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { withNavigation } from 'react-navigation';

/*
  This file contains a component for the list overview of the users grades
  It is visible in Home Screen
*/

class GradesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: props.subjects,
      expanded: false,
      listNumerOfLines: 1,
    };
  }

  toggleExpand = () => {
    this.setState({expanded: !this.state.expanded});
    let currentNumberOfLines = this.state.listNumerOfLines;
    let numberOfLines = (currentNumberOfLines === 2) ? 1 : 2;
    this.setState({listNumerOfLines: numberOfLines})
  };

  render() {
    return (
      <View>
        <TouchableOpacity
          style={styles.row}
          onPress={() => {
            if (this.state.subjects.length === 0 && this.props.status != 'bestanden') {Alert.alert('Info','Ich benachrichtige dich, sobald die Note da ist!')}
            this.toggleExpand()
          }}>
          <Text numberOfLines={this.state.listNumerOfLines} style={[styles.title, {flex:10, marginRight: 10}]}>{this.props.module_name}</Text>
          <Text style={[styles.mark, {flex:2}]}>{this.props.module_mark}</Text>
          <Icon
            name={(() => {
              if (this.props.status === 'bestanden') return 'check-circle';
              if (this.props.status === 'nicht bestanden') return 'remove-circle';
              return 'pause-circle-filled';
            })()}
            size={20}
            style={{paddingRight: 10}}
            color={(() => {
              if (this.props.status === 'bestanden') return Colors.GREEN;
              if (this.props.status === 'nicht bestanden') return Colors.RED;
              return Colors.YELLOW;
            })()}
          />
          <Icon
            name={(()=> {
              if (this.state.subjects.length > 0) {
                return this.state.expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
              } else if (this.props.status != 'bestanden') {
                return 'access-alarms'
              } else { return 'remove'}
            } 
            )()}
            size={25}
            //style={{flex:1}}
            color={Colors.DARKGRAY}
          />
        </TouchableOpacity>
        <View style={styles.parentHr} />
        {this.state.expanded && (
          <View style={{}}>
            <FlatList
              data={this.state.subjects}
              numColumns={1}
              scrollEnabled={false}
              renderItem={({item, index}) => (
                <View>
                  <TouchableOpacity
                    style={[styles.childRow, styles.button]}
                    onPress={() => Alert.alert('Bleib gespannt!','Zukünftig kannst du hier Notenspiegel sehen.')}>
                    <Text numberOfLines={1} style={[styles.itemInActive, {flex: 10, marginRight: 10}]}>{item.name}</Text>
                    <Text style={[styles.marksmall, {flex: 1.4}]}>{item.mark}</Text>
                    <Icon
                      name={(() => {
                        if (item.status === 'bestanden') return 'check-circle';
                        if (item.status === 'nicht bestanden') return 'remove-circle';
                        return 'pause-circle-filled';
                        
                      })()}
                      size={17}
                      style={{flex:1}}
                      color={(() => {
                        if (item.status === 'bestanden') return Colors.GREEN;
                        if (item.status === 'nicht bestanden') return Colors.RED;
                        return Colors.YELLOW;
                      })()}
                    />
                    <Icon
                      name='keyboard-arrow-right'
                      size={20}
                      style={{flex:0, marginHorizontal: 5}}
                      color={Colors.DARKGRAY}
                    />
                  </TouchableOpacity>
                  <View style={styles.childHr} />
                </View>
              )}
            />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 45,
    alignItems: 'center',
    paddingLeft: 35,
    paddingRight: 10,
    fontSize: 12,
  },
  title: {
    fontSize: 16.5,
    fontWeight: '100',
    color: Colors.DARKGRAY,
  },
  mark: {
    fontSize: 15,
    color: Colors.OFFLINE_GRAY,
  },
  marksmall: {
    fontSize: 14,
    color: Colors.OFFLINE_GRAY,
  },
  itemActive: {
    fontSize: 12,
    color: Colors.GREEN,
  },
  itemInActive: {
    fontSize: 14,
    color: Colors.DARKGRAY,
  },
  btnActive: {
    borderColor: Colors.GREEN,
  },
  btnInActive: {
    borderColor: Colors.DARKGRAY,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems: 'center',
    backgroundColor: Colors.CGRAY,
  },
  childRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.GRAY,
  },
  parentHr: {
    height: 2,
    color: Colors.WHITE,
    width: '100%',
  },
  childHr: {
    height: 1,
    backgroundColor: Colors.LIGHTGRAY,
    width: '100%',
  },
  colorActive: {
    borderColor: Colors.GREEN,
  },
  colorInActive: {
    borderColor: Colors.DARKGRAY,
  },
});

export default withNavigation(GradesList);
