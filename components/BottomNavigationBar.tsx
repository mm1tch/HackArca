import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link, usePathname } from "expo-router";
import { NavItem } from "../types";
import {
  HomeIcon,
  PlusIcon,
  ReportesIcon,
  AgendaNavIcon,
  MapIcon,
} from "./icons/NavIcons";

const navItemsList: NavItem[] = [
  { label: "Inicio", icon: HomeIcon, path: "/" },
  { label: "Reportes", icon: ReportesIcon, path: "/reportes" },
  { label: "Agregar", icon: PlusIcon, path: "/agregar", isCentral: true },
  { label: "Agenda", icon: AgendaNavIcon, path: "/agenda" },
  { label: "Mapa", icon: MapIcon, path: "/mapa" },
];

export const BottomNavigationBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <View style={styles.navContainer}>
      {navItemsList.map((item) => {
        const isActive = pathname === item.path;

        if (item.isCentral) {
          return (
            <Link key={item.path} href={item.path as any} asChild>
              <TouchableOpacity
                style={styles.centralButtonWrapper}
                activeOpacity={0.8}
              >
                <View style={styles.centralButton}>
                  <item.icon width={28} height={28} fill="#fff" />
                </View>
              </TouchableOpacity>
            </Link>
          );
        }

        return (
          <Link key={item.path} href={item.path as any} asChild>
            <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
              <item.icon
                width={24}
                height={24}
                stroke={isActive ? BRAND_RED : "#4A5568"}
              />
              <Text
                style={[styles.navLabel, isActive && styles.navLabelActive]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          </Link>
        );
      })}
    </View>
  );
};

const BRAND_RED = "#C31F39";

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    flex: 1,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  navLabel: {
    fontSize: 12,
    color: "#4A5568",
    marginTop: 2,
  },
  navLabelActive: {
    color: BRAND_RED,
  },
  centralButtonWrapper: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  centralButton: {
    backgroundColor: BRAND_RED,
    width: 56,
    height: 56,
    marginTop: 15,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
