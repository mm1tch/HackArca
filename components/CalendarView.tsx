import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MONTH_NAMES_ES } from "../constants";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons/MiscIcons";

// Props que el componente espera
interface CalendarViewProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedDay: number | null;
  onDayPress: (day: number) => void; // <-- AÑADE ESTA LÍNEA
}

const DAYS_OF_WEEK_IMG = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  selectedDay,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7; // 0 (Lunes) - 6 (Domingo)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDay === day;
      days.push(
        <TouchableOpacity key={day} style={styles.dayCell} activeOpacity={0.7}>
          <View
            style={[
              styles.dayContainer,
              isSelected && styles.selectedDayContainer,
            ]}
          >
            <Text
              style={[styles.dayText, isSelected && styles.selectedDayText]}
            >
              {day}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    return days;
  };

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevMonth} style={styles.arrowButton}>
          <ChevronLeftIcon width={24} height={24} fill="#E53E3E" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {MONTH_NAMES_ES[month]} {year}
        </Text>
        <TouchableOpacity onPress={onNextMonth} style={styles.arrowButton}>
          <ChevronRightIcon width={24} height={24} fill="#E53E3E" />
        </TouchableOpacity>
      </View>
      <View style={styles.weekDaysContainer}>
        {DAYS_OF_WEEK_IMG.map((day) => (
          <Text key={day} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.daysGrid}>{renderDays()}</View>
    </View>
  );
};

const BRAND_RED = "#E53E3E";

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  arrowButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  weekDayText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
    width: `${100 / 7}%`,
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`, // Simula un grid de 7 columnas
    aspectRatio: 1, // Hace que la celda sea un cuadrado
    justifyContent: "center",
    alignItems: "center",
  },
  dayContainer: {
    width: "80%",
    height: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999, // Círculo perfecto
  },
  selectedDayContainer: {
    backgroundColor: BRAND_RED,
  },
  dayText: {
    fontSize: 16,
    color: "#334155",
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
