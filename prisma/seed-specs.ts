/**
 * Run once to populate specsJson on existing products.
 * Usage: npx tsx prisma/seed-specs.ts
 */
import prisma from "../src/lib/prisma";
import type { ProductSpecs } from "../src/types/specs";

const SPECS: Record<string, ProductSpecs> = {
  // ── CUB CADET ──────────────────────────────────────────────────────────
  "SC300B 21\" Self-Propelled Gas Mower": {
    powerType: "gas", engineCC: 163, deckWidth: 21,
    cuttingHeightMin: 1.25, cuttingHeightMax: 3.75, cuttingPositions: 6,
    driveType: "fwd", selfPropelled: true,
    mulching: true, bagging: true, sideDischarge: true, warrantyYears: 3,
  },
  "XT1 LT42 IntelliPOWER Riding Mower": {
    powerType: "gas", engineCC: 547, deckWidth: 42,
    cuttingPositions: 12, driveType: "hydrostatic",
    acreageCoverage: 1.5, warrantyYears: 3,
  },

  // ── GREENWORKS ─────────────────────────────────────────────────────────
  "80V 21\" Brushless Push Mower": {
    powerType: "electric", voltage: 80, batteryAh: 4.0,
    runtimeMinutes: 40, chargeTimeMinutes: 60, deckWidth: 21,
    cuttingPositions: 7, driveType: "push", selfPropelled: false,
    mulching: true, bagging: true, sideDischarge: true, warrantyYears: 4,
  },
  "60V 21\" Self-Propelled Cordless Mower": {
    powerType: "electric", voltage: 60, runtimeMinutes: 60, deckWidth: 21,
    cuttingHeightMin: 1.38, cuttingHeightMax: 4, driveType: "fwd",
    selfPropelled: true, mulching: true, bagging: true, sideDischarge: true, warrantyYears: 4,
  },
  "CrossoverZ 42\" 80V Zero-Turn Rider": {
    powerType: "electric", voltage: 80, deckWidth: 42, driveType: "zero-turn",
    acreageCoverage: 2, cuttingHeightMin: 1.5, cuttingHeightMax: 4,
    cuttingPositions: 15, warrantyYears: 4,
  },
  "CrossoverT 42\" 80V Riding Lawn Tractor": {
    powerType: "electric", voltage: 80, deckWidth: 42, driveType: "hydrostatic",
    acreageCoverage: 1.5, cuttingHeightMin: 1.5, cuttingHeightMax: 4,
    cuttingPositions: 7, warrantyYears: 4,
  },

  // ── HONDA ──────────────────────────────────────────────────────────────
  "HRN216VKA 21\" Smart Drive Self-Propelled": {
    powerType: "gas", engineCC: 163, deckWidth: 21,
    speedMax: 4, driveType: "fwd", selfPropelled: true,
    mulching: true, bagging: true, sideDischarge: true, warrantyYears: 3,
  },
  "HRX217VKA 21\" Select Drive Self-Propelled": {
    powerType: "gas", engineCC: 200, deckWidth: 21,
    driveType: "rwd", selfPropelled: true,
    mulching: true, bagging: true, sideDischarge: true, warrantyYears: 5,
  },

  // ── HUSQVARNA ──────────────────────────────────────────────────────────
  "LC221RH 21\" Rear-Wheel Drive Self-Propelled": {
    powerType: "gas", engineCC: 160, deckWidth: 21,
    cuttingHeightMin: 1, cuttingHeightMax: 3.75, cuttingPositions: 9,
    driveType: "rwd", selfPropelled: true,
    mulching: true, bagging: true, sideDischarge: true, warrantyYears: 2,
  },
  "YTH18542 42\" Riding Lawn Mower": {
    powerType: "gas", horsepower: 18.5, deckWidth: 42,
    driveType: "hydrostatic", acreageCoverage: 1.5, warrantyYears: 2,
  },
  "Z254F 54\" Zero-Turn Riding Mower": {
    powerType: "gas", horsepower: 26, deckWidth: 54,
    driveType: "zero-turn", speedMax: 7, cuttingPositions: 15,
    cuttingHeightMin: 1.5, cuttingHeightMax: 4, warrantyYears: 3,
  },
  "Automower 450X Robotic Mower": {
    powerType: "robotic", driveType: "awd", acreageCoverage: 1.25,
    slopeMax: 45, installation: "wire-free", gpsType: "GPS",
    appControl: true, cuttingHeightMin: 0.8, cuttingHeightMax: 2.4, warrantyYears: 2,
  },
  "Automower 310 Mark II Robotic Mower": {
    powerType: "robotic", acreageCoverage: 0.75,
    slopeMax: 40, installation: "wire", appControl: true,
    cuttingHeightMin: 0.8, cuttingHeightMax: 2.4, warrantyYears: 2,
  },

  // ── JOHN DEERE ─────────────────────────────────────────────────────────
  "S130 42\" Lawn Tractor": {
    powerType: "gas", horsepower: 22, deckWidth: 42,
    driveType: "hydrostatic", acreageCoverage: 1.5, warrantyYears: 2,
  },
  "X350 48\" Select Series Lawn Tractor": {
    powerType: "gas", horsepower: 21.5, deckWidth: 48,
    driveType: "hydrostatic", acreageCoverage: 2, warrantyYears: 4,
  },
  "Z335E 42\" EZtrak Zero-Turn Mower": {
    powerType: "gas", horsepower: 20, deckWidth: 42,
    driveType: "zero-turn", speedMax: 6.5,
    cuttingHeightMin: 1, cuttingHeightMax: 4, cuttingPositions: 15, warrantyYears: 2,
  },

  // ── EGO ────────────────────────────────────────────────────────────────
  "POWER+ LM2135SP 21\" Select Cut Self-Propelled": {
    powerType: "electric", voltage: 56, batteryAh: 7.5,
    runtimeMinutes: 60, deckWidth: 21, driveType: "fwd",
    selfPropelled: true, speedMax: 3.1,
    mulching: true, bagging: true, sideDischarge: true, warrantyYears: 5,
  },
  "POWER+ LM2101 21\" Push Cordless Mower": {
    powerType: "electric", voltage: 56, batteryAh: 5.0,
    runtimeMinutes: 45, deckWidth: 21, driveType: "push",
    selfPropelled: false, mulching: true, bagging: true, sideDischarge: true, warrantyYears: 5,
  },
  "POWER+ Z6 ZT4214L 42\" Zero-Turn Rider": {
    powerType: "electric", voltage: 56, driveType: "zero-turn",
    deckWidth: 42, speedMax: 8, chargeTimeMinutes: 90,
    acreageCoverage: 2, warrantyYears: 5,
  },

  // ── RYOBI ──────────────────────────────────────────────────────────────
  "40V HP Brushless 20\" Push Lawn Mower": {
    powerType: "electric", voltage: 40, batteryAh: 6.0,
    runtimeMinutes: 45, deckWidth: 20, driveType: "push",
    selfPropelled: false, mulching: true, bagging: true, sideDischarge: true, warrantyYears: 5,
  },
  "40V HP Brushless 20\" Self-Propelled Mower": {
    powerType: "electric", voltage: 40, batteryAh: 6.0,
    runtimeMinutes: 45, deckWidth: 20, driveType: "rwd",
    selfPropelled: true, mulching: true, bagging: true, sideDischarge: true, warrantyYears: 5,
  },

  // ── TORO ───────────────────────────────────────────────────────────────
  "Recycler 22\" Personal Pace SmartStow": {
    powerType: "gas", engineCC: 150, deckWidth: 22,
    driveType: "fwd", selfPropelled: true,
    mulching: true, bagging: true, sideDischarge: true, warrantyYears: 3,
  },
  "TimeMaster 30\" Personal Pace Gas Mower": {
    powerType: "gas", engineCC: 223, deckWidth: 30,
    driveType: "fwd", selfPropelled: true,
    mulching: true, bagging: true, sideDischarge: true, warrantyYears: 3,
  },

  // ── CRAFTSMAN ──────────────────────────────────────────────────────────
  "M275 21\" FWD Self-Propelled Gas Mower": {
    powerType: "gas", engineCC: 163, deckWidth: 21,
    cuttingHeightMin: 1.25, cuttingHeightMax: 3.75, cuttingPositions: 6,
    driveType: "fwd", selfPropelled: true,
    mulching: true, bagging: true, sideDischarge: true, warrantyYears: 2,
  },
  "T150 46\" Hydrostatic Riding Mower": {
    powerType: "gas", horsepower: 23, deckWidth: 46,
    driveType: "hydrostatic", acreageCoverage: 1.5,
    cuttingPositions: 6, warrantyYears: 2,
  },

  // ── TROY-BILT ──────────────────────────────────────────────────────────
  "TB330 21\" Variable-Speed Self-Propelled": {
    powerType: "gas", engineCC: 163, deckWidth: 21,
    cuttingHeightMin: 1.25, cuttingHeightMax: 3.75, cuttingPositions: 6,
    driveType: "fwd", selfPropelled: true, speedMax: 3.7,
    mulching: true, bagging: true, sideDischarge: true, warrantyYears: 2,
  },
  "Mustang 54\" Zero-Turn Riding Mower": {
    powerType: "gas", horsepower: 25, deckWidth: 54,
    driveType: "zero-turn", speedMax: 7,
    cuttingHeightMin: 1.5, cuttingHeightMax: 4.5, cuttingPositions: 15, warrantyYears: 2,
  },

  // ── BAD BOY ────────────────────────────────────────────────────────────
  "ZT Elite 48\" Zero-Turn Mower": {
    powerType: "gas", horsepower: 22, deckWidth: 48,
    driveType: "zero-turn", speedMax: 7,
    cuttingPositions: 9, warrantyYears: 2,
  },
  "ZT Elite 60\" Zero-Turn Mower": {
    powerType: "gas", horsepower: 24, deckWidth: 60,
    driveType: "zero-turn", speedMax: 7,
    cuttingPositions: 9, warrantyYears: 2,
  },

  // ── ARIENS ─────────────────────────────────────────────────────────────
  "IKON XD 52\" Zero-Turn Mower": {
    powerType: "gas", horsepower: 23, deckWidth: 52,
    driveType: "zero-turn",
    cuttingHeightMin: 1.5, cuttingHeightMax: 4.5, cuttingPositions: 13, warrantyYears: 2,
  },

  // ── SCAG ───────────────────────────────────────────────────────────────
  "Freedom Z 48\" Zero-Turn Mower": {
    powerType: "gas", horsepower: 22, deckWidth: 48,
    driveType: "zero-turn", warrantyYears: 2,
  },

  // ── FERRIS ─────────────────────────────────────────────────────────────
  "IS 600Z 48\" Full Suspension Zero-Turn": {
    powerType: "gas", horsepower: 22, deckWidth: 48,
    driveType: "zero-turn", cuttingPositions: 9, warrantyYears: 2,
  },

  // ── MAMMOTION ──────────────────────────────────────────────────────────
  "LUBA 2 AWD 5000 Robotic Mower": {
    powerType: "robotic", driveType: "awd", acreageCoverage: 1.25,
    slopeMax: 75, installation: "wire-free", gpsType: "RTK GPS",
    appControl: true, cuttingHeightMin: 1.2, cuttingHeightMax: 2.8, warrantyYears: 2,
  },
  "LUBA Mini 2 AWD Robotic Mower": {
    powerType: "robotic", driveType: "awd", acreageCoverage: 0.5,
    slopeMax: 45, installation: "wire-free", gpsType: "RTK GPS",
    appControl: true, warrantyYears: 2,
  },
  "YUKA Robotic Mower": {
    powerType: "robotic", acreageCoverage: 0.5,
    installation: "wire-free", gpsType: "GPS",
    appControl: true, warrantyYears: 1,
  },

  // ── SEGWAY ─────────────────────────────────────────────────────────────
  "Navimow i108E Robotic Mower": {
    powerType: "robotic", acreageCoverage: 0.2,
    slopeMax: 35, installation: "wire-free", gpsType: "EFLS",
    appControl: true, warrantyYears: 2,
  },
  "Navimow i2 AWD Robotic Mower": {
    powerType: "robotic", driveType: "awd", acreageCoverage: 0.5,
    slopeMax: 45, installation: "wire-free", gpsType: "EFLS",
    appControl: true, warrantyYears: 2,
  },

  // ── STIHL ──────────────────────────────────────────────────────────────
  "RMA 460 V 19\" Battery Self-Propelled Mower": {
    powerType: "electric", deckWidth: 19,
    cuttingHeightMin: 0.98, cuttingHeightMax: 3.15, cuttingPositions: 7,
    driveType: "fwd", selfPropelled: true, warrantyYears: 2,
  },
  "RM 655 VS 22\" Variable-Speed Self-Propelled": {
    powerType: "gas", engineCC: 163, deckWidth: 22,
    cuttingHeightMin: 1.2, cuttingHeightMax: 3.7, cuttingPositions: 7,
    driveType: "rwd", selfPropelled: true,
    mulching: true, bagging: true, sideDischarge: true, warrantyYears: 2,
  },

  // ── DEWALT ─────────────────────────────────────────────────────────────
  "DCMW290X2 21\" FLEXVOLT Self-Propelled Mower": {
    powerType: "electric", voltage: 60, batteryAh: 3.0,
    runtimeMinutes: 70, deckWidth: 21,
    cuttingHeightMin: 1.5, cuttingHeightMax: 3.75, cuttingPositions: 6,
    driveType: "rwd", selfPropelled: true,
    mulching: true, bagging: true, sideDischarge: true, warrantyYears: 3,
  },

  // ── MAKITA ─────────────────────────────────────────────────────────────
  "XML06PT1 21\" LXT Brushless Self-Propelled": {
    powerType: "electric", voltage: 36, deckWidth: 21,
    cuttingHeightMin: 1.25, cuttingHeightMax: 4, cuttingPositions: 7,
    runtimeMinutes: 40, driveType: "fwd", selfPropelled: true,
    mulching: true, bagging: true, sideDischarge: true, warrantyYears: 3,
  },

  // ── FISKARS ────────────────────────────────────────────────────────────
  "StaySharp Max 18\" Reel Push Mower": {
    powerType: "manual", deckWidth: 18,
    cuttingHeightMin: 1, cuttingHeightMax: 4,
    driveType: "push", selfPropelled: false,
    mulching: false, bagging: false, warrantyYears: 3,
  },
};

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  let updated = 0;

  for (const p of products) {
    const specs = SPECS[p.name];
    if (specs) {
      await prisma.product.update({
        where: { id: p.id },
        data: { specsJson: JSON.stringify(specs) },
      });
      updated++;
      console.log(`✓ ${p.name}`);
    } else {
      console.log(`⚠ No specs for: ${p.name}`);
    }
  }

  console.log(`\nDone: ${updated}/${products.length} products updated.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
