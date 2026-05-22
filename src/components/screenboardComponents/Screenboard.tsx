import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Screenboard: React.FC<any> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Screenboard is currently unsupported because native screen sharing is unavailable.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Screenboard;
