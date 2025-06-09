describe("Moon Moisture Formula Recalculator App", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("adds an ingredient and updates totals correctly", () => {
    cy.get('[data-cy="add-ingredient"]').click();

    cy.get('[data-cy="ingredient-name"]').eq(0).type("Shea Butter");
    cy.get('[data-cy="ingredient-percent"]').eq(0).clear().type("25");
    cy.get('[data-cy="ingredient-phase"]').eq(0).select("Phase B");

    cy.get('[data-cy="add-ingredient"]').click();
    cy.get('[data-cy="ingredient-name"]').eq(1).type("Distilled Water");
    cy.get('[data-cy="ingredient-percent"]').eq(1).clear().type("75");
    cy.get('[data-cy="ingredient-phase"]').eq(1).select("Phase A");

    cy.contains("Total: 100.00%").should("exist");
  });

  it("shows a warning when total % is not 100", () => {
    cy.get('[data-cy="add-ingredient"]').click();
    cy.get('[data-cy="ingredient-percent"]').eq(0).clear().type("80");
    cy.contains("⚠️ Total percentage must equal 100%").should("exist");
  });

  it("calculates water evaporation correctly", () => {
    cy.get('input[type="number"]').eq(2).clear().type("100"); // before heating
    cy.get('input[type="number"]').eq(3).clear().type("94"); // after heating
    cy.contains("➕ Add back: 6.00 g").should("exist");
  });

  it("saves and deletes a formula", () => {
    // Add one ingredient
    cy.get('[data-cy="add-ingredient"]').click();
    cy.get('[data-cy="ingredient-name"]').eq(0).type("Glycerin");
    cy.get('[data-cy="ingredient-percent"]').eq(0).clear().type("100");
    cy.get('[data-cy="ingredient-phase"]')
      .eq(0)
      .should("exist")
      .select("Phase A");

    // Save it
    cy.get('input[placeholder="Formula Name"]').type("TestFormula");
    cy.get('[data-cy="save-formula"]').click();

    // Confirm it's saved
    cy.get('[data-cy="formula-select"]', { timeout: 6000 })
      .should("exist")
      .and("contain", "TestFormula");

    // Delete it
    cy.get('[data-cy="delete-formula"]').click();

    // Ensure the formula dropdown exists before checking it no longer contains the deleted one
    cy.get('[data-cy="formula-select"]').should("not.exist");
  });

  // Test for fragrance split inputs
  it("shows fragrance split inputs when 'fragrance' is typed", () => {
    // Step 1: Add ingredient and type 'Fragrance'
    cy.get('[data-cy="add-ingredient"]').click();
    cy.get('[data-cy="ingredient-name"]').eq(0).clear().type("Fragrance Oil");
    cy.get('[data-cy="fragrance-split-count"]').select("2");

    // Fill out the percentages to add up to 100%
    cy.get('[data-cy="fragrance-split-percent-s1"]').eq(0).type("50");
    cy.get('[data-cy="fragrance-split-percent-s2"]').eq(0).type("50");

    // Step 2: Wait for the split select to appear 
    cy.get('[data-cy="fragrance-split-section"]', { timeout: 5000 }).should(
      "exist"
    );

    // Step 3: Wait for the two fragrance scent inputs to appear
    cy.get('[data-cy="fragrance-split-section"]', { timeout: 5000 }).should(
      "exist"
    );
    cy.get('[data-cy="fragrance-scent-s1"]', { timeout: 5000 }).should("exist");
    cy.get('[data-cy="fragrance-scent-s2"]', { timeout: 5000 }).should("exist");

    // Step 4: Fill in both scent names
    cy.get('[data-cy="fragrance-scent-s1"]').type("Lavender");
    cy.get('[data-cy="fragrance-scent-s2"]').type("Vanilla");
    cy.wait(100);

    // Step 5: Assert if the preview values show correctly
    cy.get('[data-cy="fragrance-split-oz-s1"]').should("contain", "Lavender");
    cy.get('[data-cy="fragrance-split-oz-s1"]').should("contain", "oz");

    cy.get('[data-cy="fragrance-split-oz-s2"]').should("contain", "Vanilla");
    cy.get('[data-cy="fragrance-split-oz-s2"]').should("contain", "oz");

    cy.get('[data-cy="fragrance-split-g-s1"]').should("contain", "g");
    cy.get('[data-cy="fragrance-split-g-s2"]').should("contain", "g");
  });

  // Test for phase totals
describe("Phase Totals", () => {
  it("displays correct total weight in grams and oz for each phase", () => {
    // Setup ingredients
    cy.get('[data-cy="add-ingredient"]').click();
    cy.get('[data-cy="ingredient-name"]').eq(0).type("Distilled Water");
    cy.get('[data-cy="ingredient-percent"]').eq(0).clear().type("75");
    cy.get('[data-cy="ingredient-phase"]').eq(0).select("Phase A");

    cy.get('[data-cy="add-ingredient"]').click();
    cy.get('[data-cy="ingredient-name"]').eq(1).type("Shea Butter");
    cy.get('[data-cy="ingredient-percent"]').eq(1).clear().type("25");
    cy.get('[data-cy="ingredient-phase"]').eq(1).select("Phase B");

    const phaseTotals = [
      { selector: '[data-cy="phase-total-phaseA-g"]', expected: 2126.21, tolerance: 0.1 },
      { selector: '[data-cy="phase-total-phaseB-g"]', expected: 708.74, tolerance: 0.1 },
      { selector: '[data-cy="phase-total-grams"]', expected: 2834.95, tolerance: 0.1 },
      { selector: '[data-cy="phase-total-oz"]', expected: 100.0, tolerance: 0.05 },
    ];

    // Check each total value with cleanup
    phaseTotals.forEach(({ selector, expected, tolerance }) => {
      cy.get(selector).should(($el) => {
        const rawText = $el.text().trim();
        const numericText = rawText.replace(/[^0-9.]/g, "");
        const num = parseFloat(numericText);

        expect(num).to.be.a("number");
        expect(num).to.be.closeTo(expected, tolerance);
      });
    });
  });
});

// Test for responsive layout
describe("Responsive Layout", () => {
  const viewports = [
    { width: 375, height: 667, name: "Mobile" },       // iPhone 
    { width: 768, height: 1024, name: "Tablet" },      // iPad
    { width: 1280, height: 800, name: "Laptop" },      // Desktop
  ];

  viewports.forEach(({ width, height, name }) => {
    it(`should display layout correctly on ${name}`, () => {
      cy.viewport(width, height);
      cy.visit("/");

      // Confirm key sections are visible
      cy.get('[data-cy="app-container"]').should("be.visible");
      cy.get('[data-cy="batch-section"]').should("be.visible");
      cy.get('[data-cy="ingredients-section"]').should("be.visible");
      cy.get('[data-cy="phase-totals-section"]').should("be.visible");
      cy.get('[data-cy="water-tracking-section"]').should("be.visible");
    });
  });
});




});
