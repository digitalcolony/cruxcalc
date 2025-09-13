// Enhanced Reactive SharedValues Manager for CruxCalc
// Provides event-driven updates and component registration system

class ReactiveSharedValues extends EventTarget {
	constructor() {
		super();
		this.storageKey = "cruxcalc-shared-values";
		this.subscribers = new Map(); // Component registration system
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
			bodyFat: 15, // for body fat calculations
			activityLevel: "moderate", // for BMR/TDEE calculations
		};

		// Initialize with stored values
		this.values = this.load();

		// Listen for storage events from other tabs/windows
		this.bindStorageEvents();
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

	// Save values to localStorage and emit events
	save(newValues, options = {}) {
		try {
			const oldValues = { ...this.values };
			this.values = { ...this.values, ...newValues };

			// Save to localStorage
			localStorage.setItem(this.storageKey, JSON.stringify(this.values));

			// Emit events for changed values
			if (!options.silent) {
				this.emitChangeEvents(oldValues, this.values, newValues);
			}

			return this.values;
		} catch (error) {
			console.warn("Error saving shared values to localStorage:", error);
			return this.values;
		}
	}

	// Emit change events for updated values
	emitChangeEvents(oldValues, newValues, changedValues) {
		// Emit individual key change events
		Object.keys(changedValues).forEach((key) => {
			if (oldValues[key] !== newValues[key]) {
				this.dispatchEvent(
					new CustomEvent(`change:${key}`, {
						detail: {
							key,
							oldValue: oldValues[key],
							newValue: newValues[key],
							allValues: newValues,
						},
					})
				);
			}
		});

		// Emit general change event
		this.dispatchEvent(
			new CustomEvent("change", {
				detail: {
					changed: changedValues,
					oldValues,
					newValues,
				},
			})
		);

		// Notify registered components
		this.notifySubscribers(changedValues, oldValues, newValues);
	}

	// Register a component for automatic updates
	subscribe(componentId, callback, keys = []) {
		if (!this.subscribers.has(componentId)) {
			this.subscribers.set(componentId, []);
		}

		this.subscribers.get(componentId).push({
			callback,
			keys: keys.length > 0 ? keys : null, // null means all keys
		});

		// Return unsubscribe function
		return () => this.unsubscribe(componentId, callback);
	}

	// Unregister a component
	unsubscribe(componentId, callback = null) {
		if (callback) {
			// Remove specific callback
			const subs = this.subscribers.get(componentId) || [];
			const filtered = subs.filter((sub) => sub.callback !== callback);
			if (filtered.length > 0) {
				this.subscribers.set(componentId, filtered);
			} else {
				this.subscribers.delete(componentId);
			}
		} else {
			// Remove all callbacks for component
			this.subscribers.delete(componentId);
		}
	}

	// Notify all registered components
	notifySubscribers(changedValues, oldValues, newValues) {
		this.subscribers.forEach((subscriptions, componentId) => {
			subscriptions.forEach(({ callback, keys }) => {
				// Check if any of the changed keys match this subscription
				const relevantKeys = keys || Object.keys(changedValues);
				const hasRelevantChanges = Object.keys(changedValues).some((key) =>
					relevantKeys.includes(key)
				);

				if (hasRelevantChanges) {
					try {
						callback({
							componentId,
							changed: changedValues,
							oldValues,
							newValues,
							relevantKeys: relevantKeys.filter((key) => key in changedValues),
						});
					} catch (error) {
						console.warn(`Error in subscriber callback for ${componentId}:`, error);
					}
				}
			});
		});
	}

	// Listen for storage events from other tabs
	bindStorageEvents() {
		window.addEventListener("storage", (event) => {
			if (event.key === this.storageKey && event.newValue) {
				try {
					const newValues = JSON.parse(event.newValue);
					const oldValues = { ...this.values };
					this.values = newValues;

					// Find what changed
					const changedValues = {};
					Object.keys(newValues).forEach((key) => {
						if (oldValues[key] !== newValues[key]) {
							changedValues[key] = newValues[key];
						}
					});

					// Emit events (silently to avoid infinite loops)
					if (Object.keys(changedValues).length > 0) {
						this.emitChangeEvents(oldValues, newValues, changedValues);
					}
				} catch (error) {
					console.warn("Error parsing storage event:", error);
				}
			}
		});
	}

	// Get a specific value
	get(key) {
		return this.values[key];
	}

	// Get all values
	getAll() {
		return { ...this.values };
	}

	// Set a specific value with automatic event emission
	set(key, value, options = {}) {
		return this.save({ [key]: value }, options);
	}

	// Update multiple values at once
	update(newValues, options = {}) {
		return this.save(newValues, options);
	}

	// Clear all stored values (reset to defaults)
	clear() {
		try {
			const oldValues = { ...this.values };
			this.values = { ...this.defaultValues };
			localStorage.removeItem(this.storageKey);

			// Emit reset event
			this.dispatchEvent(
				new CustomEvent("reset", {
					detail: {
						oldValues,
						newValues: this.values,
					},
				})
			);

			// Notify subscribers of the reset
			this.notifySubscribers(this.values, oldValues, this.values);
		} catch (error) {
			console.warn("Error clearing shared values from localStorage:", error);
		}
	}

	// Batch update - useful for multiple related changes
	batch(updateFunction) {
		const oldValues = { ...this.values };
		const changes = {};

		// Create a proxy to track changes
		const tracker = {
			set: (key, value) => {
				changes[key] = value;
			},
			get: (key) => this.values[key],
			getAll: () => ({ ...this.values }),
		};

		// Execute the batch function
		updateFunction(tracker);

		// Apply all changes at once
		if (Object.keys(changes).length > 0) {
			return this.save(changes);
		}

		return this.values;
	}

	// Unit conversion methods (enhanced from original)
	heightToCm(feet, inches) {
		return Math.round((feet * 12 + inches) * 2.54);
	}

	heightToImperial(cm) {
		const totalInches = cm / 2.54;
		const feet = Math.floor(totalInches / 12);
		const inches = Math.round((totalInches % 12) * 2) / 2;
		return { feet, inches };
	}

	weightToKg(lbs) {
		return Math.round(lbs * 0.453592 * 10) / 10;
	}

	weightToLbs(kg) {
		return Math.round(kg / 0.453592);
	}

	// Enhanced unit synchronization with events
	syncHeightUnits(newUnit) {
		console.log("syncHeightUnits called with newUnit:", newUnit);
		console.log("Current values before sync:", this.values);

		if (this.values.heightUnit !== newUnit) {
			if (newUnit === "metric") {
				// Convert imperial to metric
				const totalInches =
					this.values.heightTotalInches || this.values.heightFeet * 12 + this.values.heightInches;
				console.log("Converting to metric - totalInches:", totalInches);
				console.log("heightTotalInches:", this.values.heightTotalInches);
				console.log(
					"heightFeet * 12 + heightInches:",
					this.values.heightFeet * 12 + this.values.heightInches
				);
				const cm = Math.round(totalInches * 2.54);
				console.log("Calculated cm:", cm);
				this.update({ heightUnit: newUnit, heightCm: cm, heightTotalInches: totalInches });
			} else {
				// Convert metric to imperial
				const totalInches = Math.round((this.values.heightCm / 2.54) * 2) / 2; // Round to nearest 0.5 inch
				console.log(
					"Converting to imperial - heightCm:",
					this.values.heightCm,
					"totalInches:",
					totalInches
				);
				const feet = Math.floor(totalInches / 12);
				const inches = Math.round((totalInches % 12) * 2) / 2; // Round to nearest 0.5
				console.log("Calculated feet/inches:", feet, "feet", inches, "inches");
				this.update({
					heightUnit: newUnit,
					heightFeet: feet,
					heightInches: inches,
					heightTotalInches: totalInches,
				});
			}
		} else {
			console.log("No conversion needed - units already match");
		}
	}

	syncWeightUnits(newUnit) {
		if (this.values.weightUnit !== newUnit) {
			if (newUnit === "metric") {
				const kg = this.weightToKg(this.values.weightLbs);
				this.update({ weightUnit: newUnit, weightKg: kg });
			} else {
				const lbs = this.weightToLbs(this.values.weightKg);
				this.update({ weightUnit: newUnit, weightLbs: lbs });
			}
		}
	}

	// Validation helpers
	isValidAge(age) {
		return age >= 15 && age <= 120;
	}

	isValidHeight(cm) {
		return cm >= 100 && cm <= 250;
	}

	isValidWeight(kg) {
		return kg >= 30 && kg <= 300;
	}

	// Get validation errors for current values
	getValidationErrors() {
		const errors = {};
		const values = this.values;

		if (!this.isValidAge(values.age)) {
			errors.age = "Age must be between 15 and 120 years";
		}

		const heightCm =
			values.heightUnit === "metric"
				? values.heightCm
				: this.heightToCm(values.heightFeet, values.heightInches);

		if (!this.isValidHeight(heightCm)) {
			errors.height = "Height must be between 100cm and 250cm";
		}

		const weightKg =
			values.weightUnit === "metric" ? values.weightKg : this.weightToKg(values.weightLbs);

		if (!this.isValidWeight(weightKg)) {
			errors.weight = "Weight must be between 30kg and 300kg";
		}

		return errors;
	}

	// Check if current values are valid
	isValid() {
		return Object.keys(this.getValidationErrors()).length === 0;
	}
}

// Create global instance
window.ReactiveSharedValues = ReactiveSharedValues;

// Backward compatibility - keep original SharedValues available
if (!window.SharedValues) {
	window.SharedValues = class extends ReactiveSharedValues {
		constructor() {
			super();
			console.warn(
				"Using legacy SharedValues interface. Consider upgrading to ReactiveSharedValues."
			);
		}
	};
}
