# Contract: Protein Recommendations

## Input

- age: number (years)
- gender: 'male' | 'female'
- weight: number (unit: 'kg' | 'lb', converted internally to kg)
- unit: 'kg' | 'lb'
- bodybuilding: boolean
- pregnancy: boolean (effective only when gender === 'female')
- calories?: number (optional, kcal/day)

## Output

Array<Recommendation>

Recommendation:

- key: string
- label: string
- value: number | null (g/day, rounded to whole grams)
- range?: { min: number; max: number } (g/day, rounded)
- notes?: string
- conditions?: { seniors?: boolean; pregnancy?: boolean; bodybuilding?: boolean; longevity?: boolean }

## Rules

- USA RDA: 0.8 \* kg
- Canada RDA: [0.66 * kg, 0.80 * kg]
- UK RDA: 0.75 \* kg
- Seniors (age>=65): [1.0 * kg, 1.2 * kg]
- Bodybuilding (enabled): [1.6 * kg, 2.2 * kg]; note 1.0 g/lb equivalence
- Pregnancy (enabled & female): show both 1.1 \* kg and (USA RDA + 25 g) with note
- Longevity (if calories provided): [(cal * 0.10)/4, (cal * 0.15)/4]

## Examples

Input: { age: 30, gender: 'male', weight: 80, unit: 'kg', bodybuilding: true, pregnancy: false, calories: 2500 }
Output (subset):

- USA RDA: value 64 g/day
- Canada RDA: range 53–64 g/day
- UK RDA: value 60 g/day
- Bodybuilding: range 128–176 g/day (note 1.0 g/lb ≈ 2.2 g/kg)
- Longevity: range 63–94 g/day
