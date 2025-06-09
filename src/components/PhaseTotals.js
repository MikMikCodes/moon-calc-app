import React from "react";
import { getPhaseColor } from "../utils/conversions";

const PhaseTotals = ({ ingredients, batchSizeOz }) => {
  const totals = ingredients.reduce(
    (acc, ing) => {
      const percent = parseFloat(ing.percent || 0);
      const oz = (percent / 100) * batchSizeOz;
      const grams = oz * 28.3495;

      if (ing.phase && acc[ing.phase]) {
        acc[ing.phase].oz += oz;
        acc[ing.phase].grams += grams;
      }
      return acc;
    },
    {
      phaseA: { oz: 0, grams: 0 },
      phaseB: { oz: 0, grams: 0 },
      phaseC: { oz: 0, grams: 0 },
    }
  );

  const getPhaseColor = (phase) => {
    switch (phase) {
      case "phaseA":
        return "var(--phase-a-color)";
      case "phaseB":
        return "var(--phase-b-color)";
      case "phaseC":
        return "var(--phase-c-color)";
      default:
        return "white";
    }
  };

  return (
    <div className="section-box" data-cy="phase-totals-section">
      <h2 className="icon-label">📊 Phase Totals</h2>
      <table data-cy="phase-totals-table" className="phase-totals-table">
        <thead>
          <tr>
            <th>Phase</th>
            <th>Amount (g)</th>
            <th>Amount (oz)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(totals).map(([phase, values]) => (
            <tr
              key={phase}
              style={{ backgroundColor: getPhaseColor(phase) }}
              data-cy={`phase-row-${phase}`}
            >
              <td>{phase.replace("phase", "Phase ")}</td>
              <td data-cy={`phase-total-${phase}-g`}>
                <span data-cy={`phase-total-${phase}-g-value`}>
                  {values.grams.toFixed(2)}
                </span>
                <span className="unit"> g</span>
              </td>

              <td data-cy={`phase-total-${phase}-oz`}>
  <span data-cy={`phase-total-${phase}-oz-value`}>
    {values.oz.toFixed(2)}
  </span>
  <span className="unit"> oz</span>
</td>

            </tr>
          ))}
          <tr className="total-row" data-cy="phase-total-row">
            <td>Total</td>
            <td data-cy="phase-total-grams">
              <span data-cy="phase-total-grams-value">
                {Object.values(totals)
                  .reduce((sum, val) => sum + val.grams, 0)
                  .toFixed(2)}
              </span>
              <span className="unit"> g</span>
            </td>

           <td data-cy="phase-total-oz">
              <span data-cy="phase-total-oz-value">
                {Object.values(totals)
                  .reduce((sum, val) => sum + val.oz, 0)
                  .toFixed(2)}
              </span>
              <span className="unit"> oz</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PhaseTotals;
