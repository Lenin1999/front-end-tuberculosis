import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, TextInput, StyleSheet, Modal, KeyboardAvoidingView,  ScrollView, Alert  } from 'react-native';
import { API_BASE_ADD_USER } from '@env';


const CrearPaciente = ({ navigation, route }) => {

  
  
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [contraseñaRepetida, setContraseñaRepetida] = useState('');
  const [error, setError] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mostrarContraseñaR, setMostrarContraseñaR] = useState(false);
  const textoBoton = mostrarContraseña ? '👁️‍🗨️' : '👁️‍🗨️';
  const textoBotonR = mostrarContraseñaR ? '👁️‍🗨️' : '👁️‍🗨️';
  
  const url = `${API_BASE_ADD_USER}`;

  

  useEffect(() => {
    console.log(url);
  }, []);
  






const confirmar = async () => {
  Alert.alert('Confirmar creación de cuenta', '¿Estás seguro de que deseas crear esta cuenta?', [
    { text: 'Aceptar', onPress: () => enviarDatos() },
    { text: 'Cancelar', onPress: () => console.log('Cancelar presionado'), style: 'cancel' }
  ]);
}

 


const enviarDatos = async () => {
 
   
  if (
    nombreCompleto.trim() === '' ||
    telefono.trim() === '' ||
    email.trim() === '' ||
    contraseña.trim() === '' ||
    contraseñaRepetida.trim() === '' 
  ) {
    Alert.alert('Error', 'Por favor complete todos los campos.');
    return;
  }

  if (
    
    contraseñaRepetida.trim() != contraseña.trim()
  ) {
    Alert.alert('Error', 'Las contraseñas ingresadas no coinciden.');
    return;
  }

    const data = {
      name: nombreCompleto,
      email: email,
      password: contraseña,
      phone: telefono
    }

    // Enviar datos al backend
    const jsonData = JSON.stringify(data);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      }
      );
     
      Alert.alert('Mensaje', "Cuenta creada exitosamente, inicie sesión para continuar.");
      navigation.navigate('Login');
  } catch (error) {
    console.error('Error al crear usuario:', error);
    Alert.alert('Error', 'Ocurrió un error al crear la cuenta. Inténtalo de nuevo más tarde.');
  }
};


const validarContraseñas = (contraseña, contraseñaRepetida) => {
  if (contraseña !== contraseñaRepetida) {
    setError('Las contraseñas no coinciden');
  } else {
    setError('');
  }
};


 

  

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
         


        <Image
        source={require('../../assets/images/Logotipo_TBGuardIAn.png')}
        style={styles.imagen}
      />
          

          {/* Sección para ingresar datos del paciente */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre Completo</Text>
              <TextInput
                style={styles.input}
                placeholder='Ingrese el nombre completo'
                value={nombreCompleto}
                onChangeText={setNombreCompleto}
                autoFocus={true}
                selectionColor='#20b2aa'
              />
            </View>


            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder='Ingrese el correo'
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
          
           
            <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Contraseña</Text>
         
          <TextInput
          style={styles.input}
            placeholder='Ingrese la contraseña'
            value={contraseña}
            onChangeText={(text) => {
              setContraseña(text);
              validarContraseñas(text, contraseñaRepetida);
            }}
            secureTextEntry={!mostrarContraseña}
          />
          <TouchableOpacity
            style={styles.eyeIconContainer}
            onPress={() => setMostrarContraseña(!mostrarContraseña)}
          >
            <Text style={styles.eyeIcon}>{textoBoton}</Text>
          </TouchableOpacity>
       
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Repita la contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder='Repita la contraseña'
          value={contraseñaRepetida}
          onChangeText={(text) => {
            setContraseñaRepetida(text);
            validarContraseñas(contraseña, text);
          }}
          secureTextEntry={!mostrarContraseñaR}
        />
         <TouchableOpacity
            style={styles.eyeIconContainer}
            onPress={() => setMostrarContraseñaR(!mostrarContraseñaR)}
          >
            <Text style={styles.eyeIcon}>{textoBotonR}</Text>
          </TouchableOpacity>
      </View>

      {error !== '' && <Text style={styles.errorText}>{error}</Text>}
    

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={styles.input}
                placeholder='Ingrese el teléfono'
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
              />
            </View>

           

            {/* Botón de guardar */}
            <TouchableOpacity style={styles.button} onPress={confirmar}>
              <Text style={styles.buttonText}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
    paddingTop: 50,
  },
  imagen: {
    width: 90,
    height: 100,
    marginBottom: 40,
    marginTop: -50,
  },
  inputSection: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: '#0C9CB6',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    marginLeft: 10,
    color: 'blue', // Puedes cambiar el color según tus preferencias
  },
 eyeIconContainer: {
    position: 'absolute',
    right: 20,
    bottom: 10, // Cambia este valor para ajustar la posición vertical del botón
},
  eyeIcon: {
    color: 'blue', // Puedes cambiar el color según tus preferencias
  },
});

export default CrearPaciente;
