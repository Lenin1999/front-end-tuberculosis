import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { SocialIcon } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_LOGIN } from '@env';

//import { Icon } from 'react-native-elements';



const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //useEffect(() => {
    // Comprobar si el usuario está autenticado al cargar la aplicación
    //checkIfLoggedIn();
  //}, []);

  const url = `${API_BASE_LOGIN}`;



  // Función para comprobar si el usuario está autenticado
  const checkIfLoggedIn = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        // Si hay un token de usuario en AsyncStorage, el usuario está autenticado
        navigation.navigate('Escaner');
        setIsLoggedIn(true);
      
      } else {
        // Si no hay token de usuario, el usuario no está autenticado
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error al comprobar la autenticación:', error);
    }
  };


  const handleIniciarPress = () => {
    // Navegar a la pantalla "Principal"
   
    navigation.navigate('Escaner');
    
  };

  const handleValidar = async () => {
   
 const data = {
  username: username,
  password: password,
};
const jsonData = JSON.stringify(data);

 try {
  console.log("http://192.168.244.205:8000/api/v1/users/login/")  
  const response = await fetch(url, {
  
  method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  }
  );

  



  // Verificar si la solicitud fue exitosa
  if (response.ok) {
    const data = await response.json();

    await AsyncStorage.setItem('userToken', 'userTokenValue');
    setIsLoggedIn(true);

    console.log('Datos recibidos:', data);
    
    navigation.navigate('Escaner', {user_id: data.user_id, email: username, name: data.name});
    // Aquí puedes manejar la respuesta de la API según tus necesidades
  } else {
    // Si la solicitud no fue exitosa, manejar el error
    
    Alert.alert('Error', 'Usuario no registrado.');

    

  }
} catch (error) {
  // Manejar errores de red u otros errores
  console.error('Error de red:', error);
}
      
  }

  const handleRegistro = () => {
     
    navigation.navigate('Registro');

  }

  const handleOlvidasteContraseñaPress = () => {
    // Agrega lógica para manejar el "Olvidaste tu contraseña"
    console.log('¿Olvidaste tu contraseña?');
  };

  return (
    <View style={styles.container}>
      
      
      
      <Image
        source={require('../../assets/images/Logotipo_TBGuardIAn.png')}
        style={styles.imagen}
      />

      <Text style={styles.title}>Iniciar Sesión</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Correo electrónico</Text>
        <View style={styles.subInputContainer}>
          
          <TextInput
            style={styles.input}
            placeholder="✉️ Ingrese su correo electrónico"
            onChangeText={text => setUsername(text)}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Contraseña</Text>
        <View style={styles.subInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="🔒 Ingrese su contraseña"
            secureTextEntry
            onChangeText={text => setPassword(text)}
          />
        </View>
        <TouchableOpacity onPress={handleOlvidasteContraseñaPress}>
          <Text style={styles.olvidasteContraseña}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleValidar}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
        
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleRegistro}>
        <Text style={styles.buttonText}>Registrarse</Text>
        
      </TouchableOpacity>



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 50,
    marginBottom: 20,
  },
  imagen: {
    width: 90,
    height: 100,
    marginBottom: 40,
    marginTop: -50,
  },
  inputContainer: {
    marginBottom: 10,
    width: '100%',
    backgroundColor: 'rgba(188, 206, 206)'
  },
  subInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    
  },
  iconContainer: {
    marginRight: 1,
   
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
   
    
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
  },
  olvidasteContraseña: {
    color: '#0C9CB6',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0C9CB6',
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LoginScreen;
