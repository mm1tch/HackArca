// components/icons/MiscIcons.tsx
import React from "react";
import Svg, { Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  // En React Native, 'fill' se usa para el color de relleno y 'stroke' para el color del borde
  fill?: string;
  stroke?: string;
}

export const ChevronLeftIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  stroke = "currentColor",
}) => (
  // Usamos <Svg> y <Path> con mayúsculas
  <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
    {/* La prop 'd' es la misma, pero 'stroke' se pasa como prop al Path */}
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
      stroke={stroke}
    />
  </Svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  stroke = "currentColor",
}) => (
  <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
      stroke={stroke}
    />
  </Svg>
);

export const SettingsIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  stroke = "currentColor",
}) => (
  <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      stroke={stroke}
    />
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      stroke={stroke}
    />
  </Svg>
);

export const CalendarPlusIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  fill = "none",
  stroke = "currentColor",
}) => (
  <Svg width={width} height={height} fill={fill} viewBox="0 0 24 24">
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm7-7v4m0 0H8m4 0h4m-4-8v4"
      stroke={stroke}
    />
  </Svg>
);

// Icono de reporte para el botón
export const ReportGenIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  fill = "#fff",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Path
      fill={fill}
      d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13.5,16V19H10.5V16H13.5M13.5,10V14H10.5V10H13.5M18,17H15V19H18V17M18,13H15V16H18V13M18,9H15V12H18V9Z"
    />
  </Svg>
);
