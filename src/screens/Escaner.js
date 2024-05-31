import React, { useState, useEffect, useRoute } from "react";
import {View,TouchableOpacity,Text,Image,TextInput,StyleSheet,Modal, ActivityIndicator, Alert, ScrollView} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { API_BASE_ADD } from '@env';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";


const Escaner = ({ navigation, route }) => {
  //const {email} = route.params;
  const { user_id, email, name} = route.params;

  console.log(email);
  console.log(name);
  console.log(user_id);
  
  const url = `${API_BASE_ADD}`;

  const [showModal, setShowModal] = useState(false);
  const [apiResponse, setApiResponse] = useState();
  const [showModalResponse, setShowModalResponse] = useState(false);
  const [showModalValidation, setShowModalValidation] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { capturedImage: initialImage } = route.params || {};
  const [capturedImage, setCapturedImage] = useState(initialImage);
  const [loading, setLoading] = useState(false);

  const handleIniciarPress = () => {
    navigation.navigate("Resultados", {
       email: email,
       name: name,
       user_id: user_id
    });
  };

  useEffect(() => {
    if (initialImage) {
      setCapturedImage(initialImage);
    }
  }, [initialImage]);

  const takePictureAgain = () => {
    navigation.navigate("CameraScreen", {
      email: email,
      user_id: user_id,
      name: name
    });
    console.log(url);
  };

  const CargarImagen = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Se necesita permiso para acceder a la galería de imágenes.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al cargar la imagen desde la galería:", error);
    }
  };

  const handleScanPress = () => {
    setShowModal(true);
  };

  const handleViewInfo = () => {
    setShowModalInfo(true);
  };
  const handleCloseInfo = () => {
    setShowModalInfo(false);
  };

  const handleAcceptScan = () => {
    setShowModal(false);
    // Aquí puedes llamar a la función para enviar la imagen
    enviarImagen();
  };

  const handleCancelScan = () => {
    setShowModal(false);
    // Si se cancela, puedes regresar a la pantalla de escáner o tomar otras acciones
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const handleCloseModal = () => {
    setShowModalResponse(false);
    setShowModalValidation(false);
  };

  // Función para enviar la solicitud POST
  const enviarImagen = async () => {
    if (!capturedImage) {
      console.log('Faltan datos necesarios');
      alert("Debe agregar una radiografía")
      return;
    }

    setLoading(true); // Activar indicador de carga

    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('image', {
      uri: capturedImage,
      name: 'imagen_seleccionada.jpg',
      type: 'image/jpg',
    });

    const opciones = {
      method: 'POST',
      body: formData,
    };

    try {
      const response = await fetch(url, opciones);
      
      const data = await response.json();

      // Verificar si la respuesta indica éxito
      if (response.ok) { 
        setApiResponse(data);
        console.log(data);
        setShowModalResponse(true);
      } else {
        setShowModalValidation(true);
      }

      console.log('Respuesta del servidor:', data);
      
    } catch (error) {
     
      console.log('Error al enviar la imagen:', error);
      Alert.alert('Error al enviar la imagen. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false); // Desactivar indicador de carga
    }
  };

  return (
    <View style={styles.container}>
     <View>
      <TouchableOpacity style={styles.info} onPress={handleViewInfo}>
        <Text style={styles.buttonInfo}>?</Text>
      </TouchableOpacity>
  </View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {/* Sección de la ficha médica con la foto */}
      <View style={styles.medicalCard}>
        <View style={styles.imageContainer}>
          {capturedImage ? (
            <Image
              source={{ uri: capturedImage }}
              style={styles.patientImage}
              // Ajusta la imagen para que se ajuste al contenedor manteniendo su relación de aspecto
            />
          ) : (
            <Image
              source={require("../../assets/images/scan.png")}
              style={styles.placeholderImage}
              resizeMode="contain" // Ajusta la imagen de placeholder para que se ajuste al contenedor manteniendo su relación de aspecto
            />
          )}
        </View>

        {/* Sección para el botón de tomar foto */}
        <View style={styles.cameraButtonContainer}>
          {!capturedImage && (
            <TouchableOpacity
              style={styles.takePhotoButton}
              onPress={() =>
                navigation.navigate("CameraScreen", {
                  user_id: user_id,
                  email: email,
                  name: name,
                })
              }
            >
                <Icon name="camera-outline" color="white"  size={24} />

            
            </TouchableOpacity>
          )}
        </View>
        {/* Botón para tomar foto de nuevo */}
        {capturedImage && (
          <TouchableOpacity
            style={styles.takePhotoAgainButton}
            onPress={takePictureAgain}
          >
           <Icon name="camera-outline" color="white"  size={24} />
          </TouchableOpacity>
        )}
      </View>

      {/* Sección para elegir alguna accion */}
      <View style={styles.inputSection}>
        <TouchableOpacity style={styles.button} onPress={CargarImagen}>
        <Icon name="arrow-up-bold-box-outline" color="white"  size={24} />
          <Text style={styles.buttonText}>Cargar Imagen</Text>
          
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleScanPress}>
        <Icon name="line-scan" color="white"  size={24} />
          <Text style={styles.buttonText}>Escanear</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleIniciarPress}>
        <Icon name="archive" color="white"  size={24} />
          <Text style={styles.buttonText}>Resultados</Text>
        </TouchableOpacity>
      </View>

          {/* Modal confirmacion de envio de imagen */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¿Está seguro de escanear?</Text>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#0C9CB6" }]}
                onPress={handleAcceptScan}
              >
                <Text style={styles.modalButtonText}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#FF6666" }]}
                onPress={handleCancelScan}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
        {/* Modal INFO */}
      <Modal visible={showModalInfo} animationType="slide" transparent={true}>
       
        <View style={styles.modalContainerInfo}>
          <View style={styles.modalContentInfo}>
          <ScrollView contentContainerStyle={styles.containerInfo}>
      <Text style={styles.titleInfo}>Tuberculosis (TB)</Text>
      <Text style={styles.paragraph}>
        La tuberculosis es una enfermedad infecciosa causada por la bacteria{' '}
        <Text style={styles.italic}>Mycobacterium tuberculosis</Text>. Principalmente afecta los pulmones, 
        pero puede afectar otras partes del cuerpo. Se transmite a través del aire cuando una persona infectada 
        tose o estornuda.
      </Text>
      <Text style={styles.subTitle}>Síntomas:</Text>
      <Text style={styles.bulletPoint}>• Tos persistente</Text>
      <Text style={styles.bulletPoint}>• Dolor en el pecho</Text>
      <Text style={styles.bulletPoint}>• Fiebre y sudores nocturnos</Text>
      <Text style={styles.bulletPoint}>• Pérdida de peso y apetito</Text>
    </ScrollView>
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#0C9CB6" }]}
                onPress={handleCloseInfo}
              >
                <Text style={styles.modalButtonText}>Aceptar</Text>
              </TouchableOpacity>
              
            </View>
            </View>
        </View>
      </Modal>


          {/* Modal para mostrar los resultados */}
          <Modal
      visible={showModalResponse}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Resultados:</Text>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: capturedImage }}
              style={styles.patientImage}
            />
          </View>
          {apiResponse && (
            <View style={styles.highlightContainer}>
              <Text style={styles.highlightText}>Tuberculosis:</Text>
              <Text style={[styles.highlightText, apiResponse.result ? styles.textRed : styles.textGreen]}>
                {apiResponse.result ? 'Positivo' : 'Negativo'}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.modalButton,
              { backgroundColor: "#0C9CB6" },
            ]}
            onPress={handleCloseModal}
          >
            <Text style={styles.modalButtonText}>Aceptar</Text>
            
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.expandButton}
            onPress={toggleExpansion}
          >
            <Text style={styles.modalButtonText}>{expanded ? '-' : '+'}</Text>
          </TouchableOpacity>

          {expanded && (
            <View style={styles.expandedView}>
              <Text style={styles.expandedText}>Porcentaje de "SI" tener Tuberculosis: <Text style={styles.highlightTextExpanded}>{apiResponse.result_tb}%</Text></Text>
              <Text></Text>
              <Text style={styles.expandedText}>Porcentaje de "NO" tener Tuberculosis: <Text style={styles.highlightTextExpanded}>{apiResponse.result_no_tb}%</Text></Text>

            </View>
          )}
        </View>
      </View>
    </Modal>
  

      <Modal
        visible={showModalValidation}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainerResponse}>
          <View style={styles.modalContentResponse}>
            <Text style={styles.modalTitle}>Aviso:</Text>
            <View style={styles.imageContainerResponse}>
              <Image
                source={{ uri: capturedImage }}
                style={styles.patientImageResponse}
              />
            </View>

            <View>
              <Text style={styles.highlightText}>
                La imagen seleccionada no es una radiografía pulmonar.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: "#0C9CB6" },
              ]}
              onPress={handleCloseModal}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
    paddingTop: 50,
    
  },
  medicalCard: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
   
  },
  imageContainer: {
    width: "80%",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderImage: {
    width: "100%", // Ancho del contenedor
    height: "100%", // Altura del contenedor
  },
  patientImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 300,
    color: "#fff",
  },
  cameraButtonContainer: {
    marginBottom: 20,
  },
  takePhotoButton: {
    backgroundColor: "#0C9CB6",
    padding: 15,
    borderRadius: 10,
    alignSelf: "stretch",
    alignItems: "center",
    marginTop: 10,
  },
  takePhotoButtonText: {
    fontSize: 18,
    color: "white",
  },
  takePhotoAgainButton: {
    backgroundColor: "orange",
    padding: 15,
    borderRadius: 10,
    alignSelf: "stretch",
    alignItems: "center",
    marginTop: 10,
  },
  takePhotoAgainButtonText: {
    fontSize: 18,
    color: "white",
  },
  camera: {
    width: "100%",
    height: 200,
  },
  cameraButtonsContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  captureButton: {
    backgroundColor: "#0C9CB6",
    borderRadius: 5,
    padding: 15,
  },
  captureButtonText: {
    fontSize: 18,
    color: "white",
  },
  inputSection: {
    width: "100%",
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
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 8,
  },
  button: {
    backgroundColor: "#0C9CB6",
    padding: 15,
    borderRadius: 10,
    alignSelf: "stretch",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalContainerResponse: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentResponse: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageContainerResponse: {
    width: "100%",
    height: 200,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  patientImageResponse: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 70,
    color: "#555",
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
  },
 
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
  highlightContainer: {
    width: '100%', // Asegura que el contenedor ocupe todo el ancho disponible
    alignItems: 'center', // Alinea el contenido al centro horizontalmente
  },
  highlightText: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 5,
    marginVertical: 5,
    textAlign: 'center',
    fontSize: 20, // Alinea el texto al centro horizontalmente
  },
  textRed: {
    color: 'red',
  },
  textGreen: {
    color: 'green',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  expandButton: {
    backgroundColor: '#0C9CB6',
    width: 30, // Ajusta este valor según el tamaño que desees para el botón
    height: 30,
    borderRadius: 25, // La mitad del valor del width y height para que sea redondo
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  expandedView: {
    marginTop: 20,
    alignItems: 'center',
  },
  expandedText: {
    fontSize: 15,
    color: '#000',
  },
  highlightContainer: {
    width: '100%', // Asegura que el contenedor ocupe todo el ancho disponible
    alignItems: 'center', // Alinea el contenido al centro horizontalmente
  },
  highlightTextExpanded: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 5,
    marginVertical: 5,
    textAlign: 'center', // Alinea el texto al centro horizontalmente
  },
  info: {
    width: 50,
    height: 50,
    borderRadius: 25, // Hace que el botón sea circular
    backgroundColor: '#0C9CB6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    
    bottom: -1, // Ajustar según sea necesario para que el botón esté visible
  
    left: 115    
  },
  buttonInfo: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainerInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentInfo: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "95%",
    alignItems: "center",
  },
  containerInfo: {
    padding: 30,
    backgroundColor: '#f5f5f5',
  },
  titleInfo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 10,
  },
  italic: {
    fontStyle: 'italic',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#333',
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 5,
    marginLeft: 10,
  },
});

export default Escaner;
