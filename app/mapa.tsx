// app/mapa.tsx 
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';

export default function App() {
  const router = useRouter();
  const [sucursales, setSucursales] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filtroComentarios, setFiltroComentarios] = useState(false);
  const [filtroNPS, setFiltroNPS] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState(null);

  useEffect(() => {
    fetch('http://10.22.204.147:5050/api/sucursales')
      .then((res) => res.json())
      .then((data) => {
        const sucursalesConId = data.map((sucursal, index) => ({
          ...sucursal,
          id: index.toString(),
        }));
        console.log("✅ Sucursales con ID:", sucursalesConId);
        setSucursales(sucursalesConId);
      })
      .catch((err) => console.error('❌ Error cargando sucursales:', err));
  }, []);

  const sucursalesFiltradas = sucursales
    .filter((sucursal) =>
      sucursal.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((sucursal) => {
      const comentariosMatch = !filtroComentarios || sucursal.comentarios_nuevos > 0;
      const npsMatch = !filtroNPS || parseFloat(sucursal.nps) > 30;
      return comentariosMatch && npsMatch;
    });

  const handleVerDetalles = (sucursal) => {
    try {
      const nombreEncoded = encodeURIComponent(sucursal.nombre);
      const rutaDestino = `/informacionTienda/${nombreEncoded}`;
      
      console.log('✅ Navegando a:', rutaDestino);
      console.log('✅ Sucursal seleccionada:', sucursal.nombre);
      
      router.push(rutaDestino);
    } catch (error) {
      console.error('❌ Error en navegación:', error);
    }
  };

  const handleCalloutPress = (sucursal) => {
    // Mostrar opciones cuando se presiona el callout
    Alert.alert(
      sucursal.nombre,
      "¿Qué deseas hacer?",
      [
        {
          text: "Ver Detalles",
          onPress: () => handleVerDetalles(sucursal)
        },
        {
          text: "Programar Visita",
          onPress: () => console.log("Programar visita para:", sucursal.nombre)
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.searchText}
            placeholder="Buscar sucursal..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        {showFilters && (
          <View style={styles.filterBox}>
            <TouchableOpacity onPress={() => setFiltroComentarios((prev) => !prev)}>
              <Text style={filtroComentarios ? styles.filterActive : styles.filterButton}>
                Solo con comentarios nuevos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFiltroNPS((prev) => !prev)}>
              <Text style={filtroNPS ? styles.filterActive : styles.filterButton}>
                NPS &gt; 30
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {searchQuery.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {sucursales
            .filter((s) =>
              s.nombre.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 5)
            .map((s, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setSearchQuery(s.nombre);
                  setSelectedSucursal(s);
                }}
              >
                <Text style={styles.suggestionItem}>{s.nombre}</Text>
              </TouchableOpacity>
            ))}
        </View>
      )}
          
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={
          selectedSucursal
            ? {
                latitude: parseFloat(selectedSucursal.lat),
                longitude: parseFloat(selectedSucursal.lng),
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }
            : {
                latitude: 25.66,
                longitude: -100.3,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }
        }
      >
        {sucursalesFiltradas.map((sucursal, idx) => {
          const lat = parseFloat(sucursal.lat);
          const lng = parseFloat(sucursal.lng);
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker
              key={idx}
              coordinate={{ latitude: lat, longitude: lng }}
              title={sucursal.nombre}
            >
              {/* SOLUCIÓN 1: Callout con onPress - MÁS CONFIABLE */}
              <Callout onPress={() => handleCalloutPress(sucursal)}>
                <View style={styles.callout}>
                  <Text style={styles.name}>
                    {sucursal.nombre || 'Nombre Sucursal'}
                  </Text>
                  <Text style={styles.subtext}>
                    Av. Municipal s/n, Col. Tecnológico
                  </Text>

                  <View style={styles.infoRow}>
                    <View>
                      <Text style={styles.label}>ÚLTIMA VISITA:</Text>
                      <Text style={styles.value}>14 Jun 2025</Text>
                    </View>
                    <View>
                      <Text style={styles.label}>PRÓXIMA VISITA:</Text>
                      <Text style={styles.value}>16 Jul 2025</Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <View>
                      <Text style={styles.label}>SATISFACCIÓN:</Text>
                      <Text style={styles.value}>{sucursal.nps || '25.5'}</Text>
                    </View>
                    <View>
                      <Text style={styles.label}>COMENTARIOS:</Text>
                      <Text style={styles.value}>1 Nuevo</Text>
                    </View>
                  </View>

                  {/* Instrucción visual para el usuario */}
                  <View style={styles.instructionContainer}>
                    <Text style={styles.instructionText}>
                      👆 Presiona aquí para ver opciones
                    </Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  callout: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: 280,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  subtext: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    color: '#888',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
  },
  instructionContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  searchText: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginLeft: 12,
  },
  filterBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
    width: '90%',
    alignSelf: 'center',
    elevation: 4,
  },
  filterButton: {
    paddingVertical: 6,
    fontSize: 14,
    color: '#333',
  },
  filterActive: {
    paddingVertical: 6,
    fontSize: 14,
    color: '#C72E2E',
    fontWeight: 'bold',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 90,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 12,
    paddingVertical: 4,
    elevation: 5,
    zIndex: 20,
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    fontSize: 15,
  },
});
