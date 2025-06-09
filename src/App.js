import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import IngredientsRow from "./components/IngredientsRow";
import PhaseTotals from "./components/PhaseTotals";
import WaterWeightTracking from "./components/WaterWeightTracking";
import { getPhaseColor } from "./utils/conversions";
import "./style.css";

const App = () => {
  const [ingredients, setIngredients] = useState([
    { name: "", percent: "", phase: "phaseA", id: "initial" },
  ]);
  const [fragranceSplits, setFragranceSplits] = useState({});
  const [batchSizeOz, setBatchSizeOz] = useState(100);
  const [waterWeightBefore, setWaterWeightBefore] = useState(0);
  const [waterWeightAfter, setWaterWeightAfter] = useState(0);

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);

    if (
      field === "name" &&
      value.toLowerCase().includes("fragrance") &&
      !fragranceSplits[index]
    ) {
      setFragranceSplits((prev) => ({
        ...prev,
        [index]: {
          count: 1,
          scent1: "",
          scent2: "",
          scent3: "",
        },
      }));
    }
  };

  const handleFragranceSplitChange = (index, field, value) => {
    setFragranceSplits((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    if (
      ingredients.length === 0 ||
      ingredients[ingredients.length - 1].name.trim() === "" ||
      ingredients[ingredients.length - 1].percent.trim() === ""
    )
      return;

    setIngredients([
      ...ingredients,
      { name: "", percent: "", phase: "phaseA", id: Date.now().toString() },
    ]);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(ingredients);
    const [moved] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, moved);
    setIngredients(newItems);
  };

  const totalPercent = ingredients.reduce(
    (sum, ing) => sum + parseFloat(ing.percent || 0),
    0
  );

  const [formulaName, setFormulaName] = useState("");
  const [savedFormulas, setSavedFormulas] = useState(() => {
    const data = localStorage.getItem("savedFormulas");
    return data ? JSON.parse(data) : {};
  });

  const saveFormula = () => {
    if (!formulaName.trim()) return;
    const newFormulas = {
      ...savedFormulas,
      [formulaName]: {
        ingredients: ingredients,
        fragranceSplits: fragranceSplits,
      },
    };
    setSavedFormulas(newFormulas);
    localStorage.setItem("savedFormulas", JSON.stringify(newFormulas));
  };

  const loadFormula = (e) => {
    const name = e.target.value;
    if (savedFormulas[name]) {
      const formulaData = savedFormulas[name];
      setIngredients(formulaData.ingredients || []);
      setFragranceSplits(formulaData.fragranceSplits || {});
      setFormulaName(name);
    }
  };

  const deleteFormula = () => {
    if (!formulaName.trim()) return;
    const updated = { ...savedFormulas };
    delete updated[formulaName];
    setSavedFormulas(updated);
    localStorage.setItem("savedFormulas", JSON.stringify(updated));
    setFormulaName("");
    setIngredients([{ name: "", percent: "", phase: "water", id: "initial" }]);
    setFragranceSplits({});
  };

  return (
    <div className="App" data-cy="app-container">
      <h1>Moon Moisture Formula Recalculator</h1>

      <div className="section-box batch-header" data-cy="batch-section">
        <div className="batch-row">
          <div className="batch-left">
            <label htmlFor="batchSize">
              <strong>Batch Size (oz):</strong>
            </label>
            <input
              id="batchSize"
              type="number"
              value={batchSizeOz}
              onChange={(e) => setBatchSizeOz(parseFloat(e.target.value))}
            />
          </div>

          <div className="batch-right">
            <input
              className="formula-name-input"
              type="text"
              placeholder="Formula Name"
              value={formulaName}
              onChange={(e) => setFormulaName(e.target.value)}
            />
            <button
              className="btn-6"
              data-cy="save-formula"
              onClick={saveFormula}
            >
              <span>Save Formula</span>
            </button>

            {Object.keys(savedFormulas).length > 0 && (
              <select data-cy="formula-select" onChange={loadFormula}>
                <option value="">Select a saved formula</option>
                {Object.keys(savedFormulas).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            )}

            <button
              className="danger-button"
              data-cy="delete-formula"
              onClick={deleteFormula}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="section-box table-wrapper" data-cy="ingredients-section">
        <h2 className="icon-label">🧪 Ingredients Table</h2>
        <table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>%</th>
              <th>Phase</th>
              <th>Amount (oz)</th>
              <th>Amount (g)</th>
              <th>Remove</th>
            </tr>
          </thead>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="ingredients">
              {(provided) => (
                <tbody ref={provided.innerRef} {...provided.droppableProps}>
                  {ingredients.map((ing, index) => (
                    <Draggable key={ing.id} draggableId={ing.id} index={index}>
                      {(provided, snapshot) => (
                        <IngredientsRow
                          ing={ing}
                          index={index}
                          provided={{ ...provided, snapshot }}
                          handleIngredientChange={handleIngredientChange}
                          handleFragranceSplitChange={
                            handleFragranceSplitChange
                          }
                          fragranceSplits={fragranceSplits}
                          batchSizeOz={batchSizeOz}
                          removeIngredient={removeIngredient}
                          getPhaseColor={getPhaseColor}
                          ingredients={ingredients}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <tr className="no-border-row">
                    <td>
                      <button
                        className="btn-6"
                        data-cy="add-ingredient"
                        onClick={addIngredient}
                      >
                        <span>Add Ingredient</span>
                      </button>
                    </td>
                    <td className="total-percent">
                      Total: {totalPercent.toFixed(2)}%
                    </td>
                    <td colSpan={3}>
                      {totalPercent !== 100 && (
                        <span className="total-warning-inline">
                          ⚠️ Total percentage must equal 100%
                        </span>
                      )}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              )}
            </Droppable>
          </DragDropContext>
        </table>
      </div>
      <div className="section-box">
        <div className="side-by-side-sections">
          <div data-cy="phase-totals-section">
            <PhaseTotals ingredients={ingredients} batchSizeOz={batchSizeOz} />
          </div>

          <div data-cy="water-tracking-section">
            <WaterWeightTracking
              waterWeightBefore={waterWeightBefore}
              waterWeightAfter={waterWeightAfter}
              setWaterWeightBefore={setWaterWeightBefore}
              setWaterWeightAfter={setWaterWeightAfter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
