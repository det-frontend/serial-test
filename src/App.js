import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import SerialPortAPI from 'react-native-serial-port-api';
import tw from 'twrnc';

const App = () => {
  const [inputValue, setInputValue] = useState();
  // console.log('====================================');
  // console.log(inputValue);
  // console.log('====================================');
  function hexToString(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      const charCode = parseInt(hex.substr(i, 2), 16);
      str += String.fromCharCode(charCode);
    }
    return str;
  }

  function convertToHex(str) {
    var hex = '';
    for (var i = 0; i < str.length; i++) {
      hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
  }

  const [chg, setChg] = useState({hex: '', text: ''});
  useEffect(() => {
    const setupSerialPort = async () => {
      try {
        console.log('start pro');
        const serialPort = await SerialPortAPI.open('/dev/ttyS8', {
          baudRate: 19200,
        });

        console.log(serialPort);
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
            console.log('port close');
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

  useEffect(() => {
    try {
      const sentFun = async () => {
        const serialPort = await SerialPortAPI.open('/dev/ttyS8', {
          baudRate: 19200,
        });
        if (chg.hex) {
          await serialPort.send('5245434549564544');
        }
      };
      sentFun();
    } catch (error) {
      console.log(error);
    }
  }, [chg]);

  const sentBtn = async () => {
    try {
      console.log('start clicked');
      const serialPort = await SerialPortAPI.open('/dev/ttyS8', {
        baudRate: 19200,
      });
      await serialPort.send('5245434549564544');
      console.log('wk');
    } catch (error) {
      console.log(error);
    }
  };

  const sentCustom = async () => {
    try {
      console.log('start clicked');
      const serialPort = await SerialPortAPI.open('/dev/ttyS8', {
        baudRate: 19200,
      });
      const hexData = convertToHex(inputValue);
      await serialPort.send(hexData);
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
      <View
        style={tw`flex w-[800px] gap-4 items-center justify-center flex-row`}>
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          style={tw`bg-gray-200 w-[250px] my-5  rounded-md pl-4 text-xl`}
        />
        <TouchableOpacity
          onPress={sentCustom}
          style={tw`py-4 px-6 rounded-md bg-green-400`}>
          <Text>Click me!</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={tw`text-[2rem]`}>hex: {chg.hex}</Text>
        <Text style={tw`text-[2rem]`}>text: {chg.text}</Text>
      </View>
    </View>
  );
};

export default App;
