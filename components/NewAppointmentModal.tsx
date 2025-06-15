// components/NewAppointmentModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Appointment, AppointmentStatus } from "../types";
interface NewAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (newAppointment: Omit<Appointment, "id">) => void;
}

const services = ["Consulta", "Revisión", "Tratamiento", "Limpieza Dental"];

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  // 1. TODA LA LÓGICA DEL FORMULARIO VIVE AQUÍ
  const [clientName, setClientName] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [service, setService] = useState("");

  const handleSave = () => {
    if (!clientName || !service) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    // Creamos el objeto con los datos del formulario
    const newAppointmentData: Omit<Appointment, "id"> = {
      title: `Cita de ${clientName}`,
      description: service,
      date: date, // Aquí deberías combinar la fecha y la hora seleccionada
      status: AppointmentStatus.Future, // Las nuevas citas son siempre futuras
    };
    onSave(newAppointmentData); // Enviamos los datos al padre (agenda.tsx)
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setClientName("");
    setService("");
    setDate(new Date());
    setTime("");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.popupContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.popupTitle}>Nueva Cita</Text>
            <Pressable onPress={handleCancel}>
              <Text style={{ fontSize: 22, color: "#888" }}>×</Text>
            </Pressable>
          </View>
          <View style={styles.popupDivider} />

          {/* Nombre del Cliente */}
          <Text style={styles.popupLabel}>Nombre del Cliente</Text>
          <TextInput
            style={styles.popupInput}
            placeholder="Ingresa el nombre del cliente"
            value={clientName}
            onChangeText={setClientName}
          />

          {/* Fecha y Hora (simplificado por ahora) */}
          <Text style={styles.popupLabel}>Fecha</Text>
          <TouchableOpacity
            style={styles.popupInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <Text style={styles.popupLabel}>Hora</Text>
          <TouchableOpacity
            style={styles.popupInput}
            onPress={() => setShowTimePicker(true)}
          >
            <Text>{time || "--:-- --"}</Text>
          </TouchableOpacity>

          {/* Servicio */}
          <Text style={styles.popupLabel}>Servicio</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={service}
              onValueChange={(itemValue) => setService(itemValue)}
              style={styles.picker}
            >
              <Picker.Item
                label="Selecciona un servicio"
                value=""
                enabled={false}
              />
              {services.map((srv) => (
                <Picker.Item key={srv} label={srv} value={srv} />
              ))}
            </Picker>
          </View>

          {/* Botones */}
          <View style={styles.popupButtonRow}>
            <TouchableOpacity
              style={styles.popupCancelButton}
              onPress={handleCancel}
            >
              <Text style={{ color: "#64748B", fontWeight: "600" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.popupSaveButton}
              onPress={handleSave}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                Guardar Cita
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// 2. USA LOS ESTILOS QUE CREASTE
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "90%",
    alignItems: "stretch",
    elevation: 5,
  },
  popupTitle: { fontWeight: "bold", fontSize: 22, marginBottom: 8 },
  popupDivider: { height: 1, backgroundColor: "#eee", marginVertical: 12 },
  popupLabel: {
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
    color: "#222",
  },
  popupInput: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    height: 50,
    justifyContent: "center",
    marginBottom: 8,
  },
  picker: { height: 50, width: "100%" },
  popupButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  popupCancelButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  popupSaveButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
});
