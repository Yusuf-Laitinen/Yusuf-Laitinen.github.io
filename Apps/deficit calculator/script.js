window.onload = () => {
    ['age', 'height', 'weight', 'bodyFat'].forEach(id => {
        const stored = localStorage.getItem(id);
        if (stored !== null) {
            document.getElementById(id).value = stored;
        }
    });
};

function calculateTDEE() {
    const sex = document.getElementById('sex').value;
    const age = parseInt(document.getElementById('age').value);
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const bodyFat = parseFloat(document.getElementById('bodyFat').value);
    const steps = parseInt(document.getElementById('steps').value);
    const gymMins = parseInt(document.getElementById('gymMins').value);
    const caloriesEaten = parseFloat(document.getElementById('caloriesEaten').value);

    if (isNaN(bodyFat)) {
        alert("Body Fat % is required.");
        return;
    }

    // Store static inputs in localStorage
    localStorage.setItem('age', age);
    localStorage.setItem('height', height);
    localStorage.setItem('weight', weight);
    localStorage.setItem('bodyFat', bodyFat);

    const leanMass = weight * (1 - bodyFat / 100);
    const bmr = 370 + (21.6 * leanMass);

    const stepsCalories = steps * 0.04;
    const gymCalories = gymMins * 8;

    const tdee = Math.round(bmr + stepsCalories + gymCalories);
    document.getElementById('tdeeResult').innerText = `Estimated TDEE for today: ${tdee} kcal`;

    if (!isNaN(caloriesEaten)) {
        const deficit = tdee - caloriesEaten;
        const status = deficit > 0 ? 'Deficit' : 'Surplus';
        document.getElementById('deficitResult').innerText = `Caloric ${status}: ${Math.abs(deficit)} kcal`;
    } else {
        document.getElementById('deficitResult').innerText = '';
    }
}