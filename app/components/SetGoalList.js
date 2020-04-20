/* eslint-disable prettier/prettier */

import React from 'react';
import {View, Picker, Text, StyleSheet} from 'react-native';
import { withNavigation } from 'react-navigation';

//Component to display different enrolled subjects in setnewgoal.js

class SetGoalsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: props.item,
      itemValue: null,
    };
  }
  render() {
    return (
      <View key={this.state.item} 
            //style={{
            //  borderBottomColor: 'grey',
            //  borderBottomWidth: 1,
            //}}
            >
        <Text style={[styles.blueTextSmall]}>Mein Ziel für {this.state.item}</Text> 
        <Picker
          style={[
            {width: 220, alignItems: 'center', fontSize: 45},
          ]}
          selectedValue={this.state.itemValue}
          prompt={'Mein Ziel'}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({itemValue: itemValue})
            this.props.stateHandler(itemValue, this.state.item)
          }}>
          <Picker.Item label="Note wählen.." value="" />
          <Picker.Item label="1.0" value={1.0} />
          <Picker.Item label="1.2" value={1.2} />
          <Picker.Item label="1.4" value={1.4} />
          <Picker.Item label="1.6" value={1.6} />
          <Picker.Item label="1.8" value={1.8} />
          <Picker.Item label="2.0" value={2.0} />
          <Picker.Item label="2.2" value={2.2} />
          <Picker.Item label="2.4" value={2.4} />
          <Picker.Item label="2.6" value={2.6} />
          <Picker.Item label="2.8" value={2.8} />
          <Picker.Item label="3.0" value={3.0} />
          <Picker.Item label="3.2" value={3.2} />
          <Picker.Item label="3.4" value={3.4} />
          <Picker.Item label="3.6" value={3.6} />
          <Picker.Item label="3.8" value={3.8} />
          <Picker.Item label="4.0" value={4.0} />
          <Picker.Item label="5.0" value={5.0} />
        </Picker>
        <Text></Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  linkText: {
    lineHeight: 25,
    textDecorationLine: "underline",
    color: '#0000FF',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Roboto',
    textAlign: 'center',
    
  },
  orangeTextBold: {
    lineHeight: 100,
    textAlign: 'center',
    color: '#f06449',
    fontSize: 90,
    fontWeight: '400',
    fontFamily: 'Roboto',
  },
  greyTextSmall: {
    lineHeight: 25,
    color: '#888888',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Roboto',
    paddingLeft: 30,
  },
  orangeText: {
    lineHeight: 70,
    textAlign: 'center',
    color: '#f06449',
    fontSize: 40,
    fontWeight: '100',
    fontFamily: 'Roboto',
  },
  orangeTextSmall: {
    lineHeight: 35,
    textAlign: 'center',
    color: '#f06449',
    fontSize: 25,
    fontWeight: '100',
    fontFamily: 'Roboto',
  },
  blueTextSmall: {
    lineHeight: 25,
    color: '#4a96bf',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
})

export default withNavigation(SetGoalsList);
