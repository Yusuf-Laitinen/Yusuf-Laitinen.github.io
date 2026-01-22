window.onload = () => {
    ['age', 'height', 'weight', 'bodyFat', 'correctiveMargin'].forEach(id => {
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

    // 👇 FIXED: default corrective margin to 0 if empty
    const correctiveMargin = parseInt(document.getElementById('correctiveMargin').value) || 0;

    if (isNaN(bodyFat)) {
        alert("Body Fat % is required.");
        return;
    }

    localStorage.setItem('age', age);
    localStorage.setItem('height', height);
    localStorage.setItem('weight', weight);
    localStorage.setItem('bodyFat', bodyFat);
    localStorage.setItem('correctiveMargin', correctiveMargin);

    const leanMass = weight * (1 - bodyFat / 100);
    const bmr = 370 + (21.6 * leanMass);

    const stepsCalories = steps * 0.04;
    const gymCalories = gymMins * 5;//gemini correction. as of 22nd jan 2026. change from 8 to 5 

    const tdee = Math.round(bmr + stepsCalories + gymCalories);
    document.getElementById('tdeeResult').innerText = `Estimated TDEE for today: ${tdee} kcal`;

    if (!isNaN(caloriesEaten)) {
        const rawDeficit = tdee - caloriesEaten;
        const correctedDeficit = rawDeficit - correctiveMargin;

        const status = correctedDeficit > 0 ? 'Deficit' : 'Surplus';
        document.getElementById('deficitResult').innerText =
            `Caloric ${status}: ${Math.abs(correctedDeficit)} kcal`;
    } else {
        document.getElementById('deficitResult').innerText = '';
    }
}