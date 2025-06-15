import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
// 1. IMPORTAMOS LA NUEVA LIBRERÍA
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Appointment, AppointmentStatus } from "../types";

interface NewAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (newAppointment: Omit<Appointment, "id">) => void;
}

const services = [
  "Mantenimiento",
  "Revisión",
  "Desempeño",
  "Oportunidades de mejora",
  "Otros",
];

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [clientName, setClientName] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [motive, setMotive] = useState("");

  // 2. SIMPLIFICAMOS EL ESTADO. Solo necesitamos saber si el picker está visible.
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  // 3. LAS FUNCIONES HANDLER AHORA SON MÁS SIMPLES
  const handleConfirmDate = (selectedDate: Date) => {
    setDate(selectedDate);
    setDatePickerVisibility(false);
  };

  const handleConfirmTime = (selectedTime: Date) => {
    setTime(selectedTime);
    setTimePickerVisibility(false);
  };

  const handleSave = () => {
    if (!clientName || !motive) {
      // <-- CAMBIO 1
      alert("Por favor, completa el nombre y el motivo.");
      return;
    }

    // Combinamos la fecha y la hora en un solo objeto Date
    const finalDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );

    const newAppointmentData: Omit<Appointment, "id"> = {
      title: `Cita de ${clientName}`,
      description: motive,
      date: finalDateTime,
      status: AppointmentStatus.Future,
    };
    onSave(newAppointmentData);
    resetForm();
    onClose();
  };
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setClientName("");
    setMotive("");
    setDate(new Date());
    setTime(new Date());
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

          {/* Fecha de la Cita */}
          <Text style={styles.popupLabel}>Fecha</Text>
          <TouchableOpacity
            style={styles.popupInput}
            onPress={() => setDatePickerVisibility(true)}
          >
            <Text>
              {date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </TouchableOpacity>

          <Text style={styles.popupLabel}>Hora</Text>
          <TouchableOpacity
            style={styles.popupInput}
            onPress={() => setTimePickerVisibility(true)}
          >
            <Text>
              {time.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </TouchableOpacity>

          {/* Motivo de la visita */}
          <Text style={styles.popupLabel}>Motivo de la visita</Text>
          <TextInput
            style={styles.popupInput}
            placeholder="Ingrese motivo u objetivo principal de la visita"
            placeholderTextColor="#9CA3AF"
            value={motive}
            onChangeText={setMotive}
          />

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
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisibility(false)}
        date={date}
        display="spinner"
        textColor="black"
        modalStyleIOS={styles.pickerModal}
        // Textos de botones en español
        confirmTextIOS="Confirmar"
        cancelTextIOS="Cancelar"
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={() => setTimePickerVisibility(false)}
        date={time}
        display="spinner"
        textColor="black"
        modalStyleIOS={styles.pickerModal}
        // Textos de botones en español
        confirmTextIOS="Confirmar"
        cancelTextIOS="Cancelar"
      />
    </Modal>
  );
};

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
    maxHeight: "85%",
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
  pickerModal: {
    justifyContent: "center",
    alignItems: "center",
  },
  // Estilo para hacer el picker más alto y visible
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    minHeight: 150,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
});
