// Shared values manager for CruxCalc
// Manages persistent storage of user inputs across calculators

class SharedValues {
	constructor() {
		this.storageKey = "cruxcalc-shared-values";
		this.defaultValues = {
			age: 30,
			heightFeet: 5,
			heightInches: 8,
			heightTotalInches: 68, // 5'8" = 68 inches
			heightCm: 173,
			weightLbs: 160,
			weightKg: 73,
			heightUnit: "imperial", // 'imperial' or 'metric'
			weightUnit: "imperial", // 'imperial' or 'metric'
			gender: "male", // for BMR calculators
			useAsianBMI: false, // for BMI calculator
		};
	}

	// Load values from localStorage, falling back to defaults
	load() {
		try {
			const stored = localStorage.getItem(this.storageKey);
			if (stored) {
				const parsed = JSON.parse(stored);
				return { ...this.defaultValues, ...parsed };
			}
		} catch (error) {
			console.warn("Error loading shared values from localStorage:", error);
		}
		return { ...this.defaultValues };
	}

	// Save values to localStorage
	save(values) {
		try {
			const current = this.load();
			const updated = { ...current, ...values };
			localStorage.setItem(this.storageKey, JSON.stringify(updated));
			return updated;
		} catch (error) {
			console.warn("Error saving shared values to localStorage:", error);
			return values;
		}
	}

	// Get a specific value
	get(key) {
		const values = this.load();
		return values[key];
	}

	// Set a specific value
	set(key, value) {
		this.save({ [key]: value });
	}

	// Update multiple values at once
	update(newValues) {
		return this.save(newValues);
	}

	// Clear all stored values (reset to defaults)
	clear() {
		try {
			localStorage.removeItem(this.storageKey);
		} catch (error) {
			console.warn("Error clearing shared values from localStorage:", error);
		}
	}

	// Debug method to log current state
	debug() {
		const values = this.load();
		console.log("SharedValues debug:", {
			stored: values,
			localStorage: localStorage.getItem(this.storageKey),
			defaults: this.defaultValues,
		});
		return values;
	}

	// Convert height from feet/inches to cm
	heightToCm(feet, inches) {
		return Math.round((feet * 12 + inches) * 2.54);
	}

	// Convert total inches to cm
	totalInchesToCm(totalInches) {
		return Math.round(totalInches * 2.54);
	}

	// Convert height from cm to feet/inches
	heightToImperial(cm) {
		const totalInches = cm / 2.54;
		const feet = Math.floor(totalInches / 12);
		const inches = Math.round((totalInches % 12) * 2) / 2; // Round to nearest 0.5
		return { feet, inches };
	}

	// Convert cm to total inches
	cmToTotalInches(cm) {
		return Math.round((cm / 2.54) * 2) / 2; // Round to nearest 0.5 inch
	}

	// Convert total inches to feet and inches display
	totalInchesToFeetInches(totalInches) {
		const feet = Math.floor(totalInches / 12);
		const inches = Math.round((totalInches % 12) * 2) / 2; // Round to nearest 0.5
		return { feet, inches };
	}

	// Convert weight from lbs to kg
	weightToKg(lbs) {
		return Math.round(lbs * 0.453592 * 10) / 10; // Round to 1 decimal
	}

	// Convert weight from kg to lbs
	weightToLbs(kg) {
		return Math.round(kg / 0.453592);
	}

	// Sync height units - when height unit changes, convert and update values
	syncHeightUnits(newUnit) {
		const values = this.load();
		if (values.heightUnit !== newUnit) {
			if (newUnit === "metric") {
				// Convert imperial to metric
				const totalInches =
					values.heightTotalInches || values.heightFeet * 12 + values.heightInches;
				const cm = this.totalInchesToCm(totalInches);
				this.update({ heightUnit: newUnit, heightCm: cm, heightTotalInches: totalInches });
			} else {
				// Convert metric to imperial
				const totalInches = this.cmToTotalInches(values.heightCm);
				const { feet, inches } = this.totalInchesToFeetInches(totalInches);
				this.update({
					heightUnit: newUnit,
					heightFeet: feet,
					heightInches: inches,
					heightTotalInches: totalInches,
				});
			}
		}
	}

	// Sync weight units - when weight unit changes, convert and update values
	syncWeightUnits(newUnit) {
		const values = this.load();
		if (values.weightUnit !== newUnit) {
			if (newUnit === "metric") {
				// Convert imperial to metric
				const kg = this.weightToKg(values.weightLbs);
				this.update({ weightUnit: newUnit, weightKg: kg });
			} else {
				// Convert metric to imperial
				const lbs = this.weightToLbs(values.weightKg);
				this.update({ weightUnit: newUnit, weightLbs: lbs });
			}
		}
	}
}

// Make SharedValues available globally
window.SharedValues = SharedValues;
