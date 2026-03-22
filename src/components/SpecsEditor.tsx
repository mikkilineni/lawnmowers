"use client";

import { useState } from "react";
import type { ProductSpecs } from "@/types/specs";

interface Props {
  productId: number;
  productName: string;
  initialSpecs: ProductSpecs;
  onClose: () => void;
  onSaved: () => void;
}

const input: React.CSSProperties = {
  border: "1px solid #ddd", borderRadius: 6, padding: "6px 10px",
  fontSize: "0.83rem", fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%", boxSizing: "border-box",
};

const select: React.CSSProperties = { ...input, background: "white", cursor: "pointer" };

const label: React.CSSProperties = {
  display: "block", fontSize: "0.7rem", fontWeight: 600,
  color: "var(--muted)", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em",
};

const group: React.CSSProperties = {
  background: "var(--cream)", borderRadius: 8, padding: "0.9rem 1rem", marginBottom: "0.75rem",
};

const grid: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.6rem",
};

const checkLabel: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  fontSize: "0.82rem", color: "var(--dark)", cursor: "pointer",
};

function Num({ label: l, value, onChange, unit }: { label: string; value: number | undefined; onChange: (v: number | undefined) => void; unit?: string }) {
  return (
    <div>
      <span style={label}>{l}{unit ? ` (${unit})` : ""}</span>
      <input
        type="number" step="any"
        value={value ?? ""}
        onChange={e => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
        style={input}
      />
    </div>
  );
}

function Check({ label: l, value, onChange }: { label: string; value: boolean | undefined; onChange: (v: boolean | undefined) => void }) {
  return (
    <label style={checkLabel}>
      <input
        type="checkbox"
        checked={value ?? false}
        onChange={e => onChange(e.target.checked ? true : undefined)}
      />
      {l}
    </label>
  );
}

export function SpecsEditor({ productId, productName, initialSpecs, onClose, onSaved }: Props) {
  const [s, setS] = useState<ProductSpecs>({ ...initialSpecs });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof ProductSpecs>(key: K, val: ProductSpecs[K]) =>
    setS(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true); setError(""); setSaved(false);
    // Remove undefined keys
    const clean = Object.fromEntries(Object.entries(s).filter(([, v]) => v !== undefined && v !== ""));
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specsJson: clean }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaved(true); setSaving(false);
      onSaved();
    } catch (e) {
      setError((e as Error).message); setSaving(false);
    }
  };

  return (
    <div style={{ background: "white", borderRadius: 10, padding: "1.25rem", border: "1px solid #e5e1db" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div style={{ fontWeight: 700, color: "var(--dark)", fontSize: "0.9rem" }}>
          Specs Editor — {productName}
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--muted)" }}>×</button>
      </div>

      {/* Power */}
      <div style={group}>
        <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--green)", marginBottom: "0.6rem", letterSpacing: "0.08em" }}>POWER</div>
        <div style={grid}>
          <div>
            <span style={label}>Power Type</span>
            <select value={s.powerType ?? ""} onChange={e => set("powerType", (e.target.value as ProductSpecs["powerType"]) || undefined)} style={select}>
              <option value="">—</option>
              <option value="gas">Gas</option>
              <option value="electric">Electric</option>
              <option value="manual">Manual</option>
              <option value="robotic">Robotic</option>
            </select>
          </div>
          <Num label="Engine CC" value={s.engineCC} onChange={v => set("engineCC", v)} unit="cc" />
          <Num label="Voltage" value={s.voltage} onChange={v => set("voltage", v)} unit="V" />
          <Num label="Battery" value={s.batteryAh} onChange={v => set("batteryAh", v)} unit="Ah" />
          <Num label="Horsepower" value={s.horsepower} onChange={v => set("horsepower", v)} unit="HP" />
        </div>
      </div>

      {/* Cutting */}
      <div style={group}>
        <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--green)", marginBottom: "0.6rem", letterSpacing: "0.08em" }}>CUTTING</div>
        <div style={grid}>
          <Num label="Deck Width" value={s.deckWidth} onChange={v => set("deckWidth", v)} unit="in" />
          <Num label="Cut Height Min" value={s.cuttingHeightMin} onChange={v => set("cuttingHeightMin", v)} unit="in" />
          <Num label="Cut Height Max" value={s.cuttingHeightMax} onChange={v => set("cuttingHeightMax", v)} unit="in" />
          <Num label="Height Positions" value={s.cuttingPositions} onChange={v => set("cuttingPositions", v)} />
        </div>
      </div>

      {/* Drive */}
      <div style={group}>
        <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--green)", marginBottom: "0.6rem", letterSpacing: "0.08em" }}>DRIVE</div>
        <div style={grid}>
          <div>
            <span style={label}>Drive Type</span>
            <select value={s.driveType ?? ""} onChange={e => set("driveType", (e.target.value as ProductSpecs["driveType"]) || undefined)} style={select}>
              <option value="">—</option>
              <option value="push">Push</option>
              <option value="fwd">FWD</option>
              <option value="rwd">RWD</option>
              <option value="awd">AWD</option>
              <option value="hydrostatic">Hydrostatic</option>
              <option value="zero-turn">Zero-Turn</option>
              <option value="robotic">Robotic</option>
            </select>
          </div>
          <Num label="Max Speed" value={s.speedMax} onChange={v => set("speedMax", v)} unit="MPH" />
        </div>
      </div>

      {/* Runtime / Coverage */}
      <div style={group}>
        <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--green)", marginBottom: "0.6rem", letterSpacing: "0.08em" }}>RUNTIME / COVERAGE</div>
        <div style={grid}>
          <Num label="Runtime" value={s.runtimeMinutes} onChange={v => set("runtimeMinutes", v)} unit="min" />
          <Num label="Charge Time" value={s.chargeTimeMinutes} onChange={v => set("chargeTimeMinutes", v)} unit="min" />
          <Num label="Coverage" value={s.acreageCoverage} onChange={v => set("acreageCoverage", v)} unit="acres" />
        </div>
      </div>

      {/* Physical */}
      <div style={group}>
        <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--green)", marginBottom: "0.6rem", letterSpacing: "0.08em" }}>PHYSICAL</div>
        <div style={grid}>
          <Num label="Weight" value={s.weightLbs} onChange={v => set("weightLbs", v)} unit="lbs" />
        </div>
      </div>

      {/* Robot-specific */}
      <div style={group}>
        <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--green)", marginBottom: "0.6rem", letterSpacing: "0.08em" }}>ROBOT / RIDING</div>
        <div style={grid}>
          <Num label="Max Slope" value={s.slopeMax} onChange={v => set("slopeMax", v)} unit="°" />
          <div>
            <span style={label}>Installation</span>
            <select value={s.installation ?? ""} onChange={e => set("installation", (e.target.value as ProductSpecs["installation"]) || undefined)} style={select}>
              <option value="">—</option>
              <option value="wire">Wire</option>
              <option value="wire-free">Wire-Free</option>
            </select>
          </div>
          <div>
            <span style={label}>GPS Type</span>
            <input value={s.gpsType ?? ""} onChange={e => set("gpsType", e.target.value || undefined)} style={input} placeholder="e.g. RTK GPS" />
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div style={group}>
        <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--green)", marginBottom: "0.6rem", letterSpacing: "0.08em" }}>CAPABILITIES</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <Check label="Mulching" value={s.mulching} onChange={v => set("mulching", v)} />
          <Check label="Bagging" value={s.bagging} onChange={v => set("bagging", v)} />
          <Check label="Side Discharge" value={s.sideDischarge} onChange={v => set("sideDischarge", v)} />
          <Check label="App Control" value={s.appControl} onChange={v => set("appControl", v)} />
          <Check label="Self-Propelled" value={s.selfPropelled} onChange={v => set("selfPropelled", v)} />
        </div>
      </div>

      {/* Warranty */}
      <div style={group}>
        <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--green)", marginBottom: "0.6rem", letterSpacing: "0.08em" }}>WARRANTY</div>
        <div style={grid}>
          <Num label="Warranty" value={s.warrantyYears} onChange={v => set("warrantyYears", v)} unit="yrs" />
        </div>
      </div>

      {error && (
        <div style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "0.75rem" }}>{error}</div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: "var(--green)", color: "white", border: "none",
            borderRadius: 6, padding: "8px 20px", fontWeight: 600,
            fontSize: "0.85rem", cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Saving…" : "Save Specs"}
        </button>
        {saved && <span style={{ color: "var(--green)", fontSize: "0.82rem", fontWeight: 600 }}>✓ Saved!</span>}
      </div>
    </div>
  );
}
