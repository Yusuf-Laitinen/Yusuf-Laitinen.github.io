(() => {
  const classes = [
    { letter: 'O', low: 25000, high: 50000, label: '25,000–50,000 K' },
    { letter: 'B', low: 11000, high: 25000, label: '11,000–25,000 K' },
    { letter: 'A', low: 7500, high: 11000, label: '7,500–11,000 K' },
    { letter: 'F', low: 6000, high: 7500, label: '6,000–7,500 K' },
    { letter: 'G', low: 5000, high: 6000, label: '5,000–6,000 K' },
    { letter: 'K', low: 3500, high: 5000, label: '3,500–5,000 K' },
    { letter: 'M', low: 2500, high: 3499, label: '< 3,500 K' },
  ];

  const colors = ['#87d4f2', '#ff8879', '#f1cf61', '#8bdd91', '#cb9beb', '#f29dca', '#e2e9ee'];
  const getElement = (id) => document.getElementById(id);

  let questions = [];
  let questionIndex = 0;
  let points = 0;
  let locked = false;

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach((screen) => {
      screen.classList.toggle('active', screen.id === id);
    });
  }

  function makeQuestions() {
    const result = [];

    for (let lap = 0; lap < 2; lap += 1) {
      const shuffledClasses = [...classes].sort(() => Math.random() - 0.5);

      shuffledClasses.forEach((starClass) => {
        // The guide ranges are approximate and share endpoints, so quiz from their interiors.
        const minimum = starClass.low + 1;
        const maximum = starClass.high - 1;
        const temperature = Math.floor(minimum + Math.random() * (maximum - minimum + 1));
        result.push({ letter: starClass.letter, temperature, firstTry: true });
      });
    }

    return result;
  }

  function renderChoices() {
    const host = getElement('choices');
    host.replaceChildren();

    classes.forEach((starClass) => {
      const button = document.createElement('button');
      button.className = 'choice';
      button.textContent = starClass.letter;
      button.setAttribute('aria-label', `Star class ${starClass.letter}`);
      button.addEventListener('click', () => answer(starClass.letter, button));
      host.appendChild(button);
    });
  }

  function startGame() {
    questions = makeQuestions();
    questionIndex = 0;
    points = 0;
    renderChoices();
    showScreen('game-screen');
    drawQuestion();
  }

  function drawQuestion() {
    locked = false;
    const question = questions[questionIndex];

    getElement('temperature').innerHTML =
      `${question.temperature.toLocaleString()}<span class="unit"> K</span>`;
    getElement('count').textContent = `${questionIndex + 1} / ${questions.length}`;
    getElement('progress-bar').style.width = `${(questionIndex / questions.length) * 100}%`;
    getElement('feedback').className = 'feedback';
    getElement('feedback').textContent = '';

    document.querySelectorAll('.choice').forEach((button) => {
      button.disabled = false;
      button.classList.remove('wrong', 'correct');
    });
  }

  function answer(letter, button) {
    if (locked) return;

    const question = questions[questionIndex];

    if (letter !== question.letter) {
      question.firstTry = false;
      button.disabled = true;
      button.classList.add('wrong');

      const correctClass = classes.find((starClass) => starClass.letter === question.letter);
      getElement('feedback').className = 'feedback';
      getElement('feedback').innerHTML = `Not quite <span>— ${correctClass.label}</span>`;
      return;
    }

    locked = true;
    button.classList.add('correct');

    if (question.firstTry) {
      points += 1000;
    }

    getElement('feedback').className = 'feedback good';
    getElement('feedback').textContent = question.firstTry ? 'Correct! +1,000' : 'That’s it!';
    document.querySelectorAll('.choice').forEach((choice) => {
      choice.disabled = true;
    });

    window.setTimeout(() => {
      questionIndex += 1;
      if (questionIndex === questions.length) {
        finishGame();
      } else {
        drawQuestion();
      }
    }, 420);
  }

  function finishGame() {
    getElement('progress-bar').style.width = '100%';
    getElement('score').textContent = points.toLocaleString();

    const firstTryCount = points / 1000;
    let title;
    let copy;
    let medal;

    if (firstTryCount === questions.length) {
      title = 'Perfect run!';
      copy = `All ${questions.length} were right on the first tap. You’ve got OBAFGKM temperatures down.`;
      medal = '🏆';
    } else if (firstTryCount >= 10) {
      title = 'Star player.';
      copy = `${firstTryCount} of ${questions.length} were right on the first tap. Keep those temperature bands in orbit.`;
      medal = '🌟';
    } else if (firstTryCount >= 6) {
      title = 'Good orbit.';
      copy = `${firstTryCount} of ${questions.length} were right on the first tap. A few more laps and those ranges will stick.`;
      medal = '🪐';
    } else {
      title = 'Warm-up lap.';
      copy = `${firstTryCount} of ${questions.length} were right on the first tap. Run it again and see what sticks.`;
      medal = '🚀';
    }

    getElement('result-title').textContent = title;
    getElement('result-copy').textContent = copy;
    getElement('medal').textContent = medal;
    showScreen('result-screen');

    if (firstTryCount >= 10) confetti();
  }

  function confetti() {
    const host = getElement('confetti');
    host.replaceChildren();

    for (let index = 0; index < 76; index += 1) {
      const piece = document.createElement('i');
      piece.className = 'piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty('--dur', `${2.2 + Math.random() * 1.8}s`);
      piece.style.setProperty('--drift', `${Math.random() * 180 - 90}px`);
      piece.style.setProperty('--rot', `${Math.random() * 180}deg`);
      piece.style.animationDelay = `${Math.random() * 0.55}s`;
      host.appendChild(piece);
    }

    window.setTimeout(() => host.replaceChildren(), 4500);
  }

  function handleKeydown(event) {
    if (!getElement('game-screen').classList.contains('active') || locked) return;

    const key = event.key.toUpperCase();
    const choiceIndex = /^[1-7]$/.test(event.key)
      ? Number(event.key) - 1
      : classes.findIndex((starClass) => starClass.letter === key);
    const button = getElement('choices').children[choiceIndex];

    if (button && !button.disabled) {
      answer(classes[choiceIndex].letter, button);
    }
  }

  getElement('start').addEventListener('click', startGame);
  getElement('again').addEventListener('click', startGame);
  document.addEventListener('keydown', handleKeydown);

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
})();
