//
//  survey.tsx
//
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

export default function Survey() {
  const [evaluaciones, setEvaluaciones] = useState({
    entrega: 0,
    disponibilidad: 0,
    promocional: 0,
    atencion: 0,
    respuesta: 0,
  });

  const [comentarios, setComentarios] = useState({
    entrega: '',
    disponibilidad: '',
    promocional: '',
    atencion: '',
    respuesta: '',
    adicionales: '',
  });

  const handleCalificacion = (campo, valor) => {
    setEvaluaciones({ ...evaluaciones, [campo]: valor });
  };

  const handleComentario = (campo, texto) => {
    setComentarios({ ...comentarios, [campo]: texto });
  };

  const renderSelectorNumerico = (campo) => (
    <View style={styles.numberSelectorContainer}>
      {[1, 2, 3, 4, 5].map((valor) => (
        <TouchableOpacity
          key={valor}
          style={[
            styles.numberButton,
            evaluaciones[campo] === valor && styles.numberButtonSelected,
          ]}
          onPress={() => handleCalificacion(campo, valor)}
        >
          <Text
            style={[
              styles.numberText,
              evaluaciones[campo] === valor && styles.numberTextSelected,
            ]}
          >
            {valor}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStarsPreview = (campo) => (
    <View style={styles.starsPreview}>
      {Array.from({ length: evaluaciones[campo] }, (_, i) => (
        <Text key={i} style={styles.starPreview}>⭐️</Text>
      ))}
    </View>
  );

  const enviarSurvey = () => {
    const camposVacios = Object.values(evaluaciones).filter((v) => v === 0);
    if (camposVacios.length > 0) {
      Alert.alert('Completa todas las evaluaciones con una calificación.');
      return;
    }

    const datos = {
      ...evaluaciones,
      comentarios,
      fecha: new Date().toISOString(),
    };

    console.log('📦 Datos enviados:', datos);
    Alert.alert('¡Survey enviado exitosamente!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.encabezadoVisita}>
        <Text style={styles.visitaLabel}>Visita relacionada:</Text>
        <Text style={styles.visitaValor}>Sucursal OXXO Reforma #234 (dummy)</Text>
      </View>

      <Text style={styles.title}>Feedback de Servicios ARCA</Text>

      {/* Secciones de evaluación */}
      {[
        { campo: 'entrega', titulo: 'Calidad de Entrega' },
        { campo: 'disponibilidad', titulo: 'Disponibilidad de Productos' },
        { campo: 'promocional', titulo: 'Ejecución de Material Promocional' },
        { campo: 'atencion', titulo: 'Atención del Personal' },
        { campo: 'respuesta', titulo: 'Tiempo de Respuesta a Incidencias' },
      ].map(({ campo, titulo }) => (
        <View key={campo} style={styles.section}>
          <Text style={styles.label}>{titulo}</Text>
          {renderSelectorNumerico(campo)}
          {renderStarsPreview(campo)}
          <TextInput
            placeholder="Comentario adicional (opcional)"
            style={styles.input}
            value={comentarios[campo]}
            onChangeText={(text) => handleComentario(campo, text)}
            multiline
          />
        </View>
      ))}

      {/* Comentarios adicionales */}
      <View style={styles.section}>
        <Text style={styles.label}>Comentarios Adicionales</Text>
        <TextInput
          placeholder="Observaciones generales, sugerencias, etc."
          style={styles.input}
          value={comentarios.adicionales}
          onChangeText={(text) => handleComentario('adicionales', text)}
          multiline
        />
      </View>

      {/* Botón de enviar */}
      <TouchableOpacity style={styles.button} onPress={enviarSurvey}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  encabezadoVisita: {
    backgroundColor: '#E2E8F0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  visitaLabel: {
    fontSize: 14,
    color: '#555',
  },
  visitaValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#C72E2E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  numberSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  numberButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  numberButtonSelected: {
    backgroundColor: '#C72E2E',
    borderColor: '#C72E2E',
  },
  numberText: {
    fontSize: 16,
    color: '#333',
  },
  numberTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  starsPreview: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 6,
  },
  starPreview: {
    fontSize: 20,
    marginHorizontal: 2,
  },
});
