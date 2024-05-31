import React, { useState, useEffect } from "react";
import {View,Text,FlatList,StyleSheet,TouchableOpacity,Alert,Modal,} from "react-native";
import { ListItem } from "react-native-elements";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { API_BASE_RESULTADOS, API_BASE_REPORTE  } from '@env';


const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  // Obtener el offset de la zona horaria local en minutos
  const offset = date.getTimezoneOffset();
  // Ajustar la fecha sumando el offset en minutos
  const adjustedDate = new Date(date.getTime() + (offset * 60000));
  return `${adjustedDate.getFullYear()}-${String(adjustedDate.getMonth() + 1).padStart(2, "0")}-${String(adjustedDate.getDate()).padStart(2, "0")}`;
};

const Resultados = ({ route }) => {
  const { email, name,user_id} = route.params;

  console.log(email);
  console.log(name);
  console.log(user_id);
  const [patientResult, setPatientResult] = useState([]);
  const [selectedResults, setSelectedResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const urlResultados = `${API_BASE_RESULTADOS}${user_id}`;
  const urlReporte = `${API_BASE_REPORTE}`;

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(urlResultados);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Obtenemos los datos en formato JSON
        const registrosInvertidos = data.reverse();
    // Utilizar los registros invertidos
    setPatientResult(registrosInvertidos); // Actualizamos el estado con los datos
       // console.log(data);
        //console.log(patientResult);
        
      } catch (error) {
        console.error("Error fetching Results:", error);
      }
    };
   
    fetchResult();
    console.log(urlResultados);

  }, []);


  const handleSendPress = async () => {
    try {
      // Construir el objeto JSON con los datos del paciente y los resultados seleccionados
      const pacienteData = {
        nombre: name,
        email: email,
      };

      const resultadosData = selectedResults.map((item) => ({
        tuberculosis: item.tuberculosis,
        porcentaje_tuberculosis: item.prct_tuberculosis,
        porcentaje_no_tuberculosis: item.prct_no_tuberculosis,
        fecha: formatDate(item.date),
      }));

      const dataToSend = {
        paciente: pacienteData,
        resultados: resultadosData,
      };

      // Convertir los datos a formato JSON
      const jsonData = JSON.stringify(dataToSend);

      console.log(dataToSend);

      // Enviar los datos al backend
      const response = await fetch(urlReporte,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonData,
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Limpiar los resultados seleccionados después del envío exitoso
      setSelectedResults([]);

      // Mostrar mensaje de éxito
      Alert.alert("Resultados enviados con éxito a", email);
    } catch (error) {
      console.error("Error al enviar los resultados:", error);
      Alert.alert(
        "Error al enviar los resultados. Inténtalo de nuevo más tarde."
      );
    }
  };

  const SelectResult = (item) => {
    const selectedIndex = selectedResults.findIndex(
      (result) => result.id === item.id
    );
    if (selectedIndex > -1) {
      // Si el resultado ya está seleccionado, quitarlo de la lista de seleccionados
      const updatedResults = [...selectedResults];
      updatedResults.splice(selectedIndex, 1);
      setSelectedResults(updatedResults);
    } else {
      // Si el resultado no está seleccionado, agregarlo a la lista de seleccionados
      setSelectedResults([...selectedResults, item]);
    }
  };

  const handleSendConfirmation = () => {
    setShowModal(true);
  };

  const handleAcceptScan = () => {
    setShowModal(false);
    // Aquí puedes llamar a la función para enviar la imagen
    handleSendPress();
  };

  const handleCancelScan = () => {
    setShowModal(false);
    // Si se cancela, puedes regresar a la pantalla de escáner o tomar otras acciones
  };

  const handleCloseModal = () => {
    setShowModalResponse(false);
  };

  const renderResultItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItemContainer}
      onPress={() => SelectResult(item)}
      onLongPress={() => SelectResult(item)}
    >
      <ListItem containerStyle={styles.listItem} bottomDivider>
        <ListItem.Content style={styles.listItemContent}>
          <Text style={styles.resultTitle}>
            📊 Fecha exámen:{formatDate(item.date)}{" "}
          </Text>
          <Text style={styles.resultItem}> </Text>
          <View style={styles.highlightContainer}>
  <Text style={styles.resultItem}>Tuberculosis:</Text>
  <Text style={[styles.highlightText, item.tuberculosis ? styles.textRed : styles.textGreen]}>
    {item.tuberculosis ? 'Positivo' : 'Negativo'}
  </Text>
</View>  
<Text></Text>  
<View style={styles.highlightContainer}>
  <Text style={styles.resultItem}>Tuberculosis: <Text style={styles.highlightText}>{item.prct_tuberculosis}%</Text> </Text>
  <Text></Text>
</View>
  <View style={styles.highlightContainer}>
  <Text style={styles.resultItem}>Normal: <Text style={styles.highlightText}>{item.prct_no_tuberculosis}%</Text></Text>
    
  </View>
        </ListItem.Content>
        {/* Mostrar un icono de marca si el resultado está seleccionado */}
        {selectedResults.some(
          (result) => result.id === item.id
        ) && <Icon name="check-circle" size={24} color="green" />}
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <Text style={styles.resultTitle}>📊 Resultados</Text>
        <TouchableOpacity style={styles.sendButton} onPress={handleSendConfirmation}>
          <Icon name="email-send-outline"  size={30} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={patientResult}
        keyExtractor={(item) => item.id.toString()} // Utilizamos id_registro como identificador único
        renderItem={renderResultItem}
      />

       {/* Modal para confirmacion de envio de datos */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              ¿Está seguro de enviar los datos a {email}?
            </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  barContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: "transparent",
  },
  listItemContainer: {
    marginBottom: 10,
  },
  listItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    flexDirection: "row", // Añadir dirección de fila para mostrar el icono de marca al lado del contenido
    alignItems: "center", // Centrar verticalmente el contenido
    justifyContent: "space-between", // Espaciar los elementos a lo largo del eje principal
  },
  listItemContent: {
    flex: 1, // Hacer que el contenido ocupe todo el espacio disponible
    paddingVertical: 15,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  resultItem: {
    fontSize: 16,
    marginBottom: 3,
    color: "#666",
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
    width: "100%",
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
    textAlign: 'center', // Alinea el texto al centro horizontalmente
  },
  textRed: {
    color: 'red',
  },
  textGreen: {
    color: 'green',
  },
});

export default Resultados;
