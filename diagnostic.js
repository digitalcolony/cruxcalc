// Quick localStorage diagnostic script
console.log("=== LOCALSTORAGE DIAGNOSTIC ===");
console.log("Raw localStorage entry:", localStorage.getItem("cruxcalc-shared-values"));

try {
	const data = JSON.parse(localStorage.getItem("cruxcalc-shared-values") || "{}");
	console.log("Parsed data:", data);
	console.log("heightTotalInches:", data.heightTotalInches);
	console.log("heightFeet:", data.heightFeet);
	console.log("heightInches:", data.heightInches);
	console.log("heightCm:", data.heightCm);
} catch (e) {
	console.error("Failed to parse localStorage:", e);
}

// Also test SharedValues class
if (typeof SharedValues !== "undefined") {
	const sv = new SharedValues();
	console.log("SharedValues.load():", sv.load());
	console.log("SharedValues.get('heightTotalInches'):", sv.get("heightTotalInches"));
} else {
	console.log("SharedValues class not available");
}

console.log("=== END DIAGNOSTIC ===");
