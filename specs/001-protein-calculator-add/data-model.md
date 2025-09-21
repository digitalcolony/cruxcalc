# Data Model: Protein Calculator

## Entities

### UserProfileInputs

- age: number (years)
- gender: 'male' | 'female'
- weight: number (kg internal; store currentUnit: 'kg' | 'lb')
- currentUnit: 'kg' | 'lb'
- bodybuilding: boolean
- pregnancy: boolean (visible only if gender === 'female')
- calories: number | null (for longevity recommendation)

### ProteinRecommendation

- key: string (e.g., 'usa_rda', 'canada_rda', 'uk_rda', 'bodybuilding', 'pregnancy', 'seniors', 'longevity')
- label: string (display name)
- gramsPerDay: number | null
- rangeGramsPerDay: { min: number; max: number } | null
- conditions: { seniors?: boolean; pregnancy?: boolean; bodybuilding?: boolean }
- rationale: string (short description)
- unit: 'g/day'

## Rules & Conversions

- Internal weight: kilograms. If currentUnit === 'lb', weightKg = weightLb \* 0.45359237.
- Seniors applies when age >= 65.
- Pregnancy recommendation applies only if pregnancy === true and gender === 'female'.
- Bodybuilding recommendation shown when bodybuilding === true.
- Longevity shown when calories != null and calories > 0.
- Rounding: Display values rounded to whole grams.

## Derived Calculations

- USA RDA: 0.8 \* weightKg
- Canada RDA: [0.66 * weightKg, 0.80 * weightKg]
- UK RDA: 0.75 \* weightKg
- Bodybuilding: [1.6 * weightKg, 2.2 * weightKg]; when lb selected, also show 1.0 g/lb as an equivalent note
- Pregnancy: max(1.1 \* prepregWeightKg, usaRda + 25)
- Seniors: [1.0 * weightKg, 1.2 * weightKg]
- Longevity: [(calories * 0.10)/4, (calories * 0.15)/4]
