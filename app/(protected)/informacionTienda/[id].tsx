// app/informacionTienda/[id].tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Image,
  Modal,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";

// <<< PASO 1: Importar el modal y los tipos
import { NewAppointmentModal } from '../../../components/NewAppointmentModal'; // <-- Ajusta esta ruta si es necesario
import { Appointment } from "../../../types"; // <-- Ajusta esta ruta si es necesario

export default function InformacionTienda() {
  const { id: nombreEncoded } = useLocalSearchParams();
  const nombre = decodeURIComponent(nombreEncoded as string); // Añadido 'as string' para seguridad de tipos
  const [sucursal, setSucursal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comentarios, setComentarios] = useState([]);

  // Estados para nuevo comentario (sin cambios)
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [tituloComentario, setTituloComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState([]);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Estados para vista de imágenes (sin cambios)
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // <<< PASO 2: Crear el estado para el modal de agendamiento
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    cargarSucursal();
    cargarComentarios();
  }, [nombre]);

  // <<< PASO 3: Crear las funciones para el modal de agendamiento
  const handleSaveAppointment = (
    newAppointmentData: Omit<Appointment, "id">
  ) => {
    // Aquí recibes los datos del formulario del modal
    console.log(`Agendando cita para ${sucursal.nombre}:`, newAppointmentData);

    // Aquí podrías hacer una llamada a tu API para guardar la cita.
    // Por ahora, solo mostramos una alerta.
    Alert.alert(
      "Cita Agendada",
      `Se ha programado una visita para ${
        newAppointmentData.title
      } el ${newAppointmentData.date.toLocaleDateString()}`
    );

    setShowAppointmentModal(false); // Cierra el modal
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false); // Cierra el modal sin guardar
  };

  // ... (el resto de tus funciones: cargarSucursal, cargarComentarios, seleccionarImagen, etc. se quedan igual)
  const cargarSucursal = () => {
    fetch("http://10.22.204.147:5050/api/sucursales")
      .then((res) => res.json())
      .then((data) => {
        const encontrada = data.find((s) => s.nombre === nombre);
        setSucursal(encontrada);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error buscando sucursal por nombre:", err);
        setLoading(false);
      });
  };

  const cargarComentarios = () => {
    console.log("🪪 Nombre a buscar en comentarios:", nombre);

    fetch(
      `http://10.22.204.147:5050/api/comentarios?nombreSucursal=${encodeURIComponent(
        nombre
      )}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        console.log("✅ Comentarios recibidos:", json);
        setComentarios(json); // Usamos directamente el JSON como viene
      })
      .catch((err) => {
        console.error("❌ Error cargando comentarios:", err);
      });
  };

  const seleccionarImagen = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permisos requeridos",
          "Se necesitan permisos para acceder a las fotos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets[0]) {
        const nuevaImagen = {
          uri: result.assets[0].uri,
          id: Date.now().toString(),
        };
        setImagenesSeleccionadas([...imagenesSeleccionadas, nuevaImagen]);
      }
    } catch (error) {
      console.error("Error seleccionando imagen:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  };

  const tomarFoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permisos requeridos",
          "Se necesitan permisos para usar la cámara."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const nuevaImagen = {
          uri: result.assets[0].uri,
          id: Date.now().toString(),
        };
        setImagenesSeleccionadas([...imagenesSeleccionadas, nuevaImagen]);
      }
    } catch (error) {
      console.error("Error tomando foto:", error);
      Alert.alert("Error", "No se pudo tomar la foto.");
    }
  };

  const eliminarImagen = (imageId) => {
    setImagenesSeleccionadas(
      imagenesSeleccionadas.filter((img) => img.id !== imageId)
    );
  };

  const mostrarOpcionesImagen = () => {
    Alert.alert("Agregar Imagen", "¿Cómo quieres agregar la imagen?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Tomar Foto", onPress: tomarFoto },
      { text: "Elegir de Galería", onPress: seleccionarImagen },
    ]);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <TouchableOpacity key={i} onPress={() => setCalificacion(i + 1)}>
        <Text
          style={[
            styles.star,
            { color: i < calificacion ? "#FFD700" : "#ddd" },
          ]}
        >
          ⭐️
        </Text>
      </TouchableOpacity>
    ));
  };

  const enviarComentario = async () => {
    if (!tituloComentario.trim() || !nuevoComentario.trim()) {
      Alert.alert("Error", "Por favor completa el título y el comentario.");
      return;
    }

    setSubmittingComment(true);

    try {
      // Aquí harías la llamada a tu API para guardar el comentario
      // const response = await fetch('http://10.22.204.147:5050/api/comentarios', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     sucursalNombre: nombre,
      //     titulo: tituloComentario,
      //     texto: nuevoComentario,
      //     calificacion: calificacion,
      //     imagenes: imagenesSeleccionadas,
      //   })
      // });

      // Simulación: agregar comentario localmente
      const nuevoComentarioObj = {
        id: Date.now(),
        titulo: tituloComentario,
        texto: nuevoComentario,
        calificacion: calificacion,
        autor: "Usuario Actual", // En tu app real, obtendrías esto del usuario loggeado
        fecha: new Date().toISOString().split("T")[0],
        imagenes: imagenesSeleccionadas.map((img) => img.uri),
      };

      setComentarios([nuevoComentarioObj, ...comentarios]);

      // Limpiar formulario
      setTituloComentario("");
      setNuevoComentario("");
      setCalificacion(5);
      setImagenesSeleccionadas([]);
      setShowCommentModal(false);

      Alert.alert("Éxito", "Tu comentario ha sido agregado correctamente.");
    } catch (error) {
      console.error("Error enviando comentario:", error);
      Alert.alert(
        "Error",
        "No se pudo enviar el comentario. Intenta de nuevo."
      );
    } finally {
      setSubmittingComment(false);
    }
  };

  const renderComentario = (comentario, index) => (
    <View key={comentario.id || index} style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewTitleContainer}>
          {/* Como tu JSON no tiene título, usamos un título genérico */}
          <Text style={styles.reviewTitle}>
            {comentario.titulo || `Comentario ${index + 1}`}
          </Text>
          <View style={styles.starsContainer}>
            {Array.from({ length: comentario.calificacion }, (_, i) => (
              <Text key={i} style={styles.starDisplay}>
                ⭐️
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.reviewMeta}>
          {/* Tu JSON no tiene autor ni fecha, así que usamos valores por defecto */}
          <Text style={styles.reviewAuthor}>
            {comentario.autor || "Usuario Anónimo"}
          </Text>
          <Text style={styles.reviewDate}>
            {comentario.fecha || new Date().toISOString().split("T")[0]}
          </Text>
        </View>
      </View>

      <Text style={styles.reviewBody}>{comentario.texto}</Text>

      {/* Solo mostrar imágenes si existen */}
      {comentario.imagenes && comentario.imagenes.length > 0 && (
        <ScrollView
          horizontal
          style={styles.imageContainer}
          showsHorizontalScrollIndicator={false}
        >
          {comentario.imagenes.map((imagen, imgIndex) => (
            <TouchableOpacity
              key={imgIndex}
              onPress={() => {
                setSelectedImage(imagen);
                setShowImageModal(true);
              }}
            >
              <Image source={{ uri: imagen }} style={styles.commentImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  // ... (tus return de loading y error se quedan igual)
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#C72E2E" />
      </View>
    );
  }

  if (!sucursal) {
    return (
      <View style={styles.error}>
        <Text style={{ color: "#C72E2E" }}>No se encontró la sucursal.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{sucursal.nombre}</Text>
      </View>

      <View style={styles.imageBox}>
        {/* Aquí va la imagen, con la ruta correcta a la carpeta 'images' */}
        <Image
          source={require("../../../assets/images/imgInfoTiendas.jpg")}
          style={styles.imageBoxImage}
          resizeMode="cover"
        />
      </View>

      {/* <<< PASO 4: Conecta el onPress del botón */}
      <TouchableOpacity
        style={styles.buttonSol}
        onPress={() => setShowAppointmentModal(true)} // <-- ESTE ES EL CAMBIO
      >
        <Text style={styles.buttonText}>Agendar Visita a Sucursal</Text>
      </TouchableOpacity>

      {/* Sección de comentarios (sin cambios) */}
      <View style={styles.commentsSection}>
        <View style={styles.commentsSectionHeader}>
          <Text style={styles.sectionTitle}>Comentarios de la Sucursal</Text>
          <TouchableOpacity
            style={styles.addCommentButton}
            onPress={() => setShowCommentModal(true)}
          >
            <Text style={styles.addCommentButtonText}>+ Agregar</Text>
          </TouchableOpacity>
        </View>

        {comentarios.length > 0 ? (
          comentarios.map((comentario, index) =>
            renderComentario(comentario, index)
          )
        ) : (
          <Text style={styles.noCommentsText}>
            No hay comentarios aún. ¡Sé el primero en comentar!
          </Text>
        )}
      </View>

      {/* Modal para agregar comentario (sin cambios) */}
      <Modal
        visible={showCommentModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCommentModal(false)}
      >
        {/* ... contenido del modal de comentarios ... */}
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCommentModal(false)}>
              <Text style={styles.modalCancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nuevo Comentario</Text>
            <TouchableOpacity
              onPress={enviarComentario}
              disabled={submittingComment}
            >
              <Text
                style={[
                  styles.modalSaveButton,
                  submittingComment && styles.disabledButton,
                ]}
              >
                {submittingComment ? "Enviando..." : "Enviar"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Título */}
            <Text style={styles.inputLabel}>Título del comentario</Text>
            <TextInput
              style={styles.textInput}
              value={tituloComentario}
              onChangeText={setTituloComentario}
              placeholder="Ej: Excelente atención al cliente"
              maxLength={100}
            />
            {/* Calificación */}
            <Text style={styles.inputLabel}>Calificación</Text>
            <View style={styles.numberSelectorContainer}>
              {[1, 2, 3, 4, 5].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.numberButton,
                    calificacion === num && styles.numberButtonSelected,
                  ]}
                  onPress={() => setCalificacion(num)}
                >
                  <Text
                    style={[
                      styles.numberText,
                      calificacion === num && styles.numberTextSelected,
                    ]}
                  >
                    {num}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.starsPreview}>
              {Array.from({ length: calificacion }, (_, i) => (
                <Text key={i} style={styles.starPreview}>
                  ⭐️
                </Text>
              ))}
            </View>

            {/* Comentario */}
            <Text style={styles.inputLabel}>Comentario</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={nuevoComentario}
              onChangeText={setNuevoComentario}
              placeholder="Describe tu experiencia en esta sucursal..."
              multiline
              numberOfLines={4}
              maxLength={500}
            />

            {/* Imágenes */}
            <Text style={styles.inputLabel}>Imágenes (opcional)</Text>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={mostrarOpcionesImagen}
            >
              <Text style={styles.imagePickerButtonText}>
                📷 Agregar Imagen
              </Text>
            </TouchableOpacity>

            {/* Preview de imágenes seleccionadas */}
            {imagenesSeleccionadas.length > 0 && (
              <ScrollView
                horizontal
                style={styles.selectedImagesContainer}
                showsHorizontalScrollIndicator={false}
              >
                {imagenesSeleccionadas.map((imagen) => (
                  <View key={imagen.id} style={styles.selectedImageContainer}>
                    <Image
                      source={{ uri: imagen.uri }}
                      style={styles.selectedImage}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => eliminarImagen(imagen.id)}
                    >
                      <Text style={styles.removeImageButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Modal para ver imagen completa (sin cambios) */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        {/* ... contenido del modal de imagen ... */}
        <View style={styles.imageModalContainer}>
          <TouchableOpacity
            style={styles.imageModalOverlay}
            onPress={() => setShowImageModal(false)}
          >
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeImageButton}
            onPress={() => setShowImageModal(false)}
          >
            <Text style={styles.closeImageButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* <<< PASO 5: Añade el componente del modal de agendamiento al final */}
      <NewAppointmentModal
        visible={showAppointmentModal}
        onClose={handleCloseAppointmentModal}
        onSave={handleSaveAppointment}
      />
    </ScrollView>
  );
}

// ... tus estilos se quedan exactamente igual
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5EFEC",
    flex: 1,
    padding: 20,
  },
  imageBoxImage: {
    width: "100%",
    height: "100%",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#C72E2E",
    paddingVertical: 20,
    alignItems: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
  },
  imageBox: {
    backgroundColor: "#ccc",
    height: 150,
    borderRadius: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#C72E2E",
    marginVertical: 20,
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonSol: {
    backgroundColor: "#8B5CF6",
    marginVertical: 20,
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // Sección de comentarios
  commentsSection: {
    marginTop: 10,
  },
  commentsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  addCommentButton: {
    backgroundColor: "#C72E2E",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addCommentButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  reviewHeader: {
    marginBottom: 10,
  },
  reviewTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  reviewTitle: {
    fontWeight: "bold",
    fontSize: 16,
    flex: 1,
  },
  starsContainer: {
    flexDirection: "row",
  },
  starDisplay: {
    fontSize: 14,
    marginLeft: 2,
  },
  reviewMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reviewAuthor: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
  },
  reviewBody: {
    color: "#333",
    lineHeight: 20,
    marginBottom: 10,
  },
  imageContainer: {
    marginTop: 10,
  },
  commentImage: {
    width: 100,
    height: 75,
    borderRadius: 8,
    marginRight: 10,
  },
  noCommentsText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    marginTop: 20,
  },

  // Modal estilos
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCancelButton: {
    color: "#666",
    fontSize: 16,
  },
  modalSaveButton: {
    color: "#C72E2E",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    color: "#ccc",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 15,
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  star: {
    fontSize: 30,
    marginRight: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePickerButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  imagePickerButtonText: {
    color: "#333",
    fontSize: 16,
  },
  selectedImagesContainer: {
    marginTop: 10,
  },
  selectedImageContainer: {
    position: "relative",
    marginRight: 10,
  },
  selectedImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#ff4444",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Modal de imagen completa
  imageModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalOverlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "70%",
  },
  closeImageButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeImageButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  numberSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },

  numberButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  numberButtonSelected: {
    backgroundColor: "#C72E2E",
    borderColor: "#C72E2E",
  },

  numberText: {
    fontSize: 16,
    color: "#333",
  },

  numberTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },

  starsPreview: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 6,
  },

  starPreview: {
    fontSize: 20,
    marginHorizontal: 2,
  },
});
