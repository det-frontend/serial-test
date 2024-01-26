import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import SerialPortAPI from 'react-native-serial-port-api';
import tw from 'twrnc';

const App = () => {
  function hexToString(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      const charCode = parseInt(hex.substr(i, 2), 16);
      str += String.fromCharCode(charCode);
    }
    return str;
  }

  const [chg, setChg] = useState({hex: '', text: ''});
  useEffect(() => {
    const setupSerialPort = async () => {
      try {
        const serialPort = await SerialPortAPI.open('/dev/ttyS8', {
          baudRate: 19200,
        });

        // Check if the serial port is open
        if (serialPort) {
          console.log('Serial port is open');
          // Subscribe to received data
          const subscription = serialPort.onReceived(buff => {
            console.log('====================================');
            console.log(buff);
            console.log('====================================');
            console.log('to hex', buff.toString('hex').toUpperCase());
            console.log(
              ' to text',
              hexToString(buff.toString('hex').toUpperCase()),
            );
            setChg({
              hex: buff.toString('hex').toUpperCase(),
              text: hexToString(buff.toString('hex').toUpperCase()),
            });
            // Handle the received data as neede
          });

          // Remember to close the port and unsubscribe when the component unmounts
          return () => {
            subscription.remove();
            serialPort.close();
          };
        } else {
          console.log('Failed to open the serial port');
        }
      } catch (error) {
        console.log('Error opening the serial port:', error);
      }
    };

    // Call the setup function
    setupSerialPort();
  }, []); // The empty dependency array ensures that this effect runs only once on mount

  const sentBtn = async () => {
    try {
      console.log('start clicked');
      const serialPort = await SerialPortAPI.open('/dev/ttyS8', {
        baudRate: 19200,
      });
      await serialPort.send('68656C6C6F');
      console.log('wk');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <TouchableOpacity onPress={sentBtn} style={tw`p-5 mb-5 bg-red-400`}>
        <Text>Click me!</Text>
      </TouchableOpacity>
      <View>
        <Text style={tw`text-[2rem]`}>hex: {chg.hex}</Text>
        <Text style={tw`text-[2rem]`}>text: {chg.text}</Text>
      </View>
    </View>
  );
};

export default App;
