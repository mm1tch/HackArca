import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import VisitCarousel from "../../components/FutureVisitsCarousel";
import { useAuth } from "../../context/AuthContext";

export default function home() {
  const { signOut, isAdmin } = useAuth();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Página de Inicio</Text>
      <Text style={styles.subtitle}>Bienvenido a ArcaApp.</Text>

      <Image
        source={{ uri: "https://mexicoindustry.com/admin/images/notas/2022/06/arca-continental-reforesta-los-parques-para-ayudar-al-medio-ambiente-de-monterrey-13584.jpg" }}
        style={styles.image}
      />

      {isAdmin && (
        <View>
          <VisitCarousel />
        </View>
      )}

      <Link href="/agenda" style={styles.linkButton}>
        <Text style={styles.linkText}>Ir a la Agenda</Text>
      </Link>

      <Pressable
        onPress={signOut}
        style={[styles.linkButton, { backgroundColor: "#EF4444", marginTop: 20 }]}
      >
        <Text style={styles.linkText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 450, // espacio extra abajo para scroll
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    marginTop: 26,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 22,
  },
  linkButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  linkText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 40,
  },
});
