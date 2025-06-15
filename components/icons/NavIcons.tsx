// components/icons/NavIcons.tsx

import React from "react";
import Svg, { Path } from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
}

export const HomeIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  stroke = "currentColor",
}) => (
  <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
    {/* La prop 'stroke' se pasa directamente al Path */}
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      stroke={stroke}
    />
  </Svg>
);

export const ReportesIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  stroke = "currentColor",
}) => (
  <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      stroke={stroke}
    />
  </Svg>
);

export const AgendaNavIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  stroke = "currentColor",
}) => (
  <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      stroke={stroke}
    />
  </Svg>
);

export const MapIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  stroke = "currentColor",
}) => (
  <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      stroke={stroke}
    />
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      stroke={stroke}
    />
  </Svg>
);

export const PlusIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  stroke = "#fff",
  fill = "none",
}) => (
  <Svg width={width} height={height} fill={fill} viewBox="0 0 24 24">
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
      stroke={stroke}
    />
  </Svg>
);
