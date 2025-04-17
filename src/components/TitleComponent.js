import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TitleComponent = ({ title, onPress, headerStyle, backButtonStyle, titleStyle, iconName='arrow-back', iconColor = '#333',showIcon=true }) => {
  const navigation = useNavigation();
  
  return (
    <View style={[styles.headerContainer, headerStyle]}>
       { showIcon &&       <TouchableOpacity 
        onPress={onPress || (() => navigation.goBack())}
        style={[styles.backButton, backButtonStyle]}
      >
       <Ionicons name={iconName} size={24} color={iconColor} />
      </TouchableOpacity> }

      <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
});

export default TitleComponent;