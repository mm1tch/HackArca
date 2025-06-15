// app/agenda.tsx

import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { CalendarView } from "../components/CalendarView";
import { AppointmentCard } from "../components/AppointmentCard";
import { Appointment, AppointmentStatus } from "../types";
import { CalendarPlusIcon } from "../components/icons/MiscIcons";
import { NewAppointmentModal } from "../components/NewAppointmentModal";

type FilterType = "Todas" | AppointmentStatus;

const StatCard: React.FC<{ count: number; label: string; color: string }> = ({
  count,
  label,
  color,
}) => (
  <View style={styles.statCard}>
    <Text style={[styles.statCount, { color }]}>{count}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function AgendaScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(
    new Date().getDate()
  );
  const [activeFilter, setActiveFilter] = useState<FilterType>("Todas");
  const [isModalVisible, setModalVisible] = useState(false);

  // Funciones de la página
  const handlePrevMonth = useCallback(() => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
    setSelectedDay(null);
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
    setSelectedDay(null);
  }, []);

  const handleDayPress = useCallback((day: number) => {
    setSelectedDay(day);
  }, []);

  const handleSaveAppointment = useCallback(
    (newAppointmentData: Omit<Appointment, "id">) => {
      const newAppointment: Appointment = {
        ...newAppointmentData,
        id: Math.random().toString(36).substring(2, 9),
      };
      setAppointments((prev) =>
        [...prev, newAppointment].sort(
          (a, b) => a.date.getTime() - b.date.getTime()
        )
      );
      setModalVisible(false);
    },
    []
  );

  const { counts, filteredAppointments } = useMemo(() => {
    const calculatedCounts: { [key in AppointmentStatus]: number } & {
      Todas: number;
    } = {
      [AppointmentStatus.Future]: 0,
      [AppointmentStatus.Past]: 0,
      [AppointmentStatus.Cancelled]: 0,
      Todas: 0,
    };

    let filteredList = appointments;

    appointments.forEach((app) => {
      if (app.status in calculatedCounts) {
        calculatedCounts[app.status]++;
      }
    });
    calculatedCounts.Todas =
      appointments.length - calculatedCounts[AppointmentStatus.Cancelled];

    if (selectedDay) {
      filteredList = appointments.filter((app) => {
        const appDate = new Date(app.date);
        return (
          appDate.getDate() === selectedDay &&
          appDate.getMonth() === currentDate.getMonth() &&
          appDate.getFullYear() === currentDate.getFullYear()
        );
      });
    } else if (activeFilter !== "Todas") {
      filteredList = appointments.filter((app) => app.status === activeFilter);
    }

    return { counts: calculatedCounts, filteredAppointments: filteredList };
  }, [appointments, currentDate, selectedDay, activeFilter]);

  const filterButtons: { label: string; type: FilterType }[] = [
    { label: "Todas", type: "Todas" },
    { label: "Futuras", type: AppointmentStatus.Future },
    { label: "Pasadas", type: AppointmentStatus.Past },
    { label: "Canceladas", type: AppointmentStatus.Cancelled },
  ];

  return (
    <>
      <ScrollView contentContainerStyle={styles.mainContainer}>
        <CalendarView
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onDayPress={handleDayPress}
          selectedDay={selectedDay}
        />

        <View style={styles.statsRow}>
          <StatCard
            count={counts[AppointmentStatus.Future]}
            label="Futuras"
            color="#22C55E"
          />
          <StatCard
            count={counts[AppointmentStatus.Past]}
            label="Pasadas"
            color="#64748B"
          />
          <StatCard
            count={counts[AppointmentStatus.Cancelled]}
            label="Canceladas"
            color="#EF4444"
          />
        </View>

        <View>
          <Text style={styles.filterTitle}>Filtrar por</Text>
          <View style={styles.filterContainer}>
            {filterButtons.map((filter) => (
              <TouchableOpacity
                key={filter.label}
                onPress={() => {
                  setSelectedDay(null);
                  setActiveFilter(filter.type);
                }}
                style={[
                  styles.filterButton,
                  activeFilter === filter.type && styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === filter.type &&
                      styles.filterButtonTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.appointmentsList}>
          {filteredAppointments.length > 0 ? (
            <>
              {filteredAppointments.map((app: Appointment) => (
                <AppointmentCard key={app.id} appointment={app} />
              ))}
            </>
          ) : (
            <View style={styles.noAppointmentsContainer}>
              <Text style={styles.noAppointmentsText}>
                No hay citas en esta categoría.
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.newAppointmentButton}
          onPress={() => setModalVisible(true)}
        >
          <CalendarPlusIcon width={20} height={20} fill="#fff" />
          <Text style={styles.newAppointmentButtonText}>
            Agendar nueva cita
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <NewAppointmentModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveAppointment}
      />
    </>
  );
}

// Estilos (sin cambios)
const styles = StyleSheet.create({
  mainContainer: { padding: 16, paddingBottom: 50 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 24,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
  },
  statCount: { fontSize: 24, fontWeight: "bold" },
  statLabel: { fontSize: 12, color: "#64748B", marginTop: 4 },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 4,
    elevation: 2,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#CB2B34",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    elevation: 3,
  },
  filterButtonText: { fontSize: 14, fontWeight: "500", color: "#475569" },
  filterButtonTextActive: { color: "#fff" },
  appointmentsList: { marginTop: 24 },
  noAppointmentsContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  noAppointmentsText: { color: "#64748B" },
  newAppointmentButton: {
    backgroundColor: "#8B5CF6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 24,
    elevation: 3,
  },
  newAppointmentButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
