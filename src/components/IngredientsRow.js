import React from "react";

const IngredientsRow = ({
  ing,
  index,
  handleIngredientChange,
  handleFragranceSplitChange,
  fragranceSplits,
  batchSizeOz,
  removeIngredient,
  getPhaseColor,
  ingredients,
  provided,
}) => {
  const percent = parseFloat(ing.percent || 0);
  const oz = ((percent / 100) * batchSizeOz).toFixed(2);
  const grams = (oz * 28.3495).toFixed(2);
  const fragrance = ing.name.toLowerCase().includes("fragrance");
  const split = fragranceSplits[index];
  const isSplit = fragrance && split?.count >= 2;

  const renderSplitAmount = (type) => {
    const count = split?.count;
    if (count < 2) return null;

    const parts = [];
    const get = (scent) => parseFloat(split?.[`scent${scent}`] || 0);
    const percentBase = parseFloat(ing.percent || 0);

    const totalSplit = [1, 2, 3]
      .slice(0, count)
      .reduce((sum, s) => sum + get(s), 0);
    const valid = Math.abs(totalSplit - 100) <= 0.01;

    for (let scent = 1; scent <= count; scent++) {
      const percentSplit = get(scent);
      const oz = (
        (percentBase / 100) *
        (percentSplit / 100) *
        batchSizeOz
      ).toFixed(2);
      const g = (oz * 28.3495).toFixed(2);

      const scentName = split?.[`name${scent}`] || `Scent ${scent}`;
      parts.push(
        <div key={scent} data-cy={`fragrance-split-${type}-s${scent}`}>
          {scentName}: {type === "oz" ? `${oz} oz` : `${g} g`}
        </div>
      );
    }

    if (!valid) {
      parts.push(
        <div key="warning" style={{ color: "red", fontSize: "0.85em" }}>
          Total must equal 100%
        </div>
      );
    }

    return <div className="fragrance-summary">{parts}</div>;
  };

  return (
    <tr
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
        backgroundColor: getPhaseColor(ing.phase),
        ...provided.draggableProps.style,
      }}
      data-cy="ingredient-row"
    >
      <td>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            data-cy="drag-handle"
            className="drag-handle"
            {...provided.dragHandleProps}
            style={{ cursor: "grab" }}
          >
            ☰
          </span>
          <input
            data-cy="ingredient-name"
            type="text"
            className="ingredient-input"
            value={ing.name}
            onChange={(e) =>
              handleIngredientChange(index, "name", e.target.value)
            }
          />
        </div>

        {fragrance && (
          <div
            className="fragrance-count-wrapper"
            style={{ marginTop: "8px" }}
            data-cy="fragrance-split-section"
          >
            <label>
              How many scents?
              <select
                data-cy="fragrance-split-count"
                value={split?.count || 1}
                onChange={(e) =>
                  handleFragranceSplitChange(
                    index,
                    "count",
                    parseInt(e.target.value)
                  )
                }
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </label>
            {split?.count >= 2 &&
              [1, 2, 3].slice(0, split.count).map((scent) => (
                <div key={`scent-${scent}`} className="fragrance-scent-pair">
                  <input
                    data-cy={`fragrance-scent-s${scent}`}
                    type="text"
                    placeholder={`Scent ${scent} Name`}
                    value={split?.[`name${scent}`] || ""}
                    onChange={(e) =>
                      handleFragranceSplitChange(
                        index,
                        `name${scent}`,
                        e.target.value
                      )
                    }
                    style={{
                      width: "120px",
                      marginRight: "10px",
                      marginTop: "4px",
                    }}
                  />
                  <input
                    data-cy={`fragrance-split-percent-s${scent}`}
                    type="number"
                    placeholder={`Scent ${scent} (%)`}
                    value={split?.[`scent${scent}`] || ""}
                    onChange={(e) =>
                      handleFragranceSplitChange(
                        index,
                        `scent${scent}`,
                        e.target.value
                      )
                    }
                    style={{
                      width: "60px",
                      marginRight: "10px",
                      marginTop: "4px",
                    }}
                  />
                </div>
              ))}
          </div>
        )}
      </td>
      <td className="percent-cell">
        <input
          data-cy="ingredient-percent"
          type="number"
          value={ing.percent}
          onChange={(e) =>
            handleIngredientChange(index, "percent", e.target.value)
          }
        />
      </td>
      <td className="phase-cell">
        <select
          data-cy="ingredient-phase"
          value={ing.phase}
          onChange={(e) =>
            handleIngredientChange(index, "phase", e.target.value)
          }
        >
          <option value="phaseA">Phase A</option>
          <option value="phaseB">Phase B</option>
          <option value="phaseC">Phase C</option>
        </select>
      </td>

      <td data-cy="ingredient-oz">
        {isSplit ? renderSplitAmount("oz") : isNaN(oz) ? "" : `${oz} oz`}
      </td>
      <td data-cy="ingredient-grams">
        {isSplit ? renderSplitAmount("g") : isNaN(grams) ? "" : `${grams} g`}
      </td>
      <td>
        <button
          className="danger-button"
          data-cy="remove-ingredient"
          onClick={() => removeIngredient(index)}
          disabled={index === 0 && ingredients.length === 1}
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

export default IngredientsRow;
