export enum AppointmentStatus {
  Future = "Futura", // As in image "Visita ... FUTURA"
  Past = "Pasada",
  Cancelled = "Cancelada",
}

export interface Appointment {
  id: string;
  title: string;
  date: Date;
  description: string;
  status: AppointmentStatus;
}

export interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string; // Path for routing, or identifier
  isCentral?: boolean;
  isActive?: boolean; // To explicitly set active state from App if needed
}
