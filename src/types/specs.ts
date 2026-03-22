export interface ProductSpecs {
  // Power
  powerType?: "gas" | "electric" | "manual" | "robotic";
  engineCC?: number;          // Gas engine displacement (cc)
  voltage?: number;           // Electric voltage (V)
  batteryAh?: number;         // Battery capacity (Ah)
  horsepower?: number;        // HP (riding/ZTR)

  // Cutting
  deckWidth?: number;         // Deck width (inches)
  cuttingHeightMin?: number;  // Min cutting height (inches)
  cuttingHeightMax?: number;  // Max cutting height (inches)
  cuttingPositions?: number;  // Number of height positions

  // Drive
  driveType?: "push" | "fwd" | "rwd" | "awd" | "hydrostatic" | "zero-turn" | "robotic";
  speedMax?: number;          // Max speed (MPH)

  // Runtime / Coverage
  runtimeMinutes?: number;    // Battery runtime (minutes)
  chargeTimeMinutes?: number; // Charge time (minutes)
  acreageCoverage?: number;   // Max coverage (acres)

  // Physical
  weightLbs?: number;

  // Robot-specific
  slopeMax?: number;          // Max slope (degrees)
  installation?: "wire" | "wire-free";
  gpsType?: string;           // e.g. "RTK GPS", "EFLS"

  // Capabilities
  mulching?: boolean;
  bagging?: boolean;
  sideDischarge?: boolean;
  appControl?: boolean;
  selfPropelled?: boolean;

  // Warranty
  warrantyYears?: number;
}
