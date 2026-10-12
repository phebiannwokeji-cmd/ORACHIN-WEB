---
trigger: model_decision
description: Use when building or changing the quantity calculator, litres or pack estimates, coverage handling or the calculator's inputs and results.
---


# calculator.md
Job: the quantity calculator's inputs, arithmetic and results.

- Run the calculator only for products with approved coverage. Otherwise show contact guidance and carry the inputs into the quote request or WhatsApp link. Why: no coverage data means no honest number.
- Accept a direct paintable area or wall dimensions, optional opening deductions and a coat count. Say that wall area is not floor area. Label units on every input. Why: floor area is the most common mistake.
- Require positive area, coverage and coat count. Allow zero deductions and zero allowance. Reject negative and non-finite values and deductions larger than the gross area. Treat zero net area as zero packs. Why: these are the cases that produce nonsense.
- Calculate litres as net area times coats, divided by coverage per coat per litre, plus the allowance. If a product states coverage for a complete system, use that figure and do not multiply by coats again. Why: multiplying coats twice doubles the estimate.
- Work in integer or decimal units, never floats, then round positive needs up to whole packs. Why: float error can turn exactly 20 litres into 21.
- Make the allowance a disclosed config value that defaults to zero. Flag it for the owner. Why: no approved figure exists.
- Choose the pack combination with the fewest supplied litres at or above the need, and fewer packs on a tie. Record this as an agent default. Why: the PRD gives no rule for choosing packs.
- Show "about X litres, so Y pack(s)" with estimated and supplied litres. Label it an estimate affected by texture, preparation and application. Why: the result is not a guarantee.
- Run the calculator on the product page and as a step after the guide, using the selected product. Default the coats to the product's approved recommendation and let the user edit them. Apply the suggested pack to the selector. Show the product's approved preparation. Why: customers should not re-enter what the product already knows.
- Treat the 100 square metres, 2 coats, 10 square metres per litre case as test data only. Why: it is not a product claim.
- Required tests: each boundary above. The test case returns exactly 20 litres. Pack rounding at an exact multiple and just above. Per-coat and complete-system coverage. Missing coverage shows guidance. Why: these prove the rules above hold.