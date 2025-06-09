import React from "react";

const WaterWeightTracking = ({
  waterWeightBefore,
  waterWeightAfter,
  setWaterWeightBefore,
  setWaterWeightAfter,
}) => {
  const evaporatedGrams =
    parseFloat(waterWeightBefore) - parseFloat(waterWeightAfter);

  return (
    <div className="section-box" data-cy="water-tracking-section">
      <h2 className="icon-label">💧 Water Phase Tracker</h2>
      <div className="water-tracking-grid" data-cy="water-tracking-inputs">
        <div className="water-tracking-column">
          <label className="label-dark" htmlFor="before-heating">
            Before Heating (g):
          </label>
          <input
            id="before-heating"
            type="number"
            value={waterWeightBefore}
            onChange={(e) => setWaterWeightBefore(e.target.value)}
            data-cy="before-heating-input"
          />
        </div>

        <div className="water-tracking-column">
          <label className="label-dark" htmlFor="after-heating">
            After Heating (g):
          </label>
          <input
            id="after-heating"
            type="number"
            value={waterWeightAfter}
            onChange={(e) => setWaterWeightAfter(e.target.value)}
            data-cy="after-heating-input"
          />
        </div>

        {evaporatedGrams > 0 && (
          <div className="water-tracking-column" style={{ alignSelf: "end" }}>
            <span
              style={{ color: "red", fontWeight: "bold" }}
              data-cy="evaporation-warning"
            >
              ➕ Add back: {evaporatedGrams.toFixed(2)} g
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterWeightTracking;
