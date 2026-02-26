const display = document.getElementById('display');
const expressionDisplay = document.getElementById('expression');
const buttons = document.querySelectorAll('.btn');

let currentValue = '0';
let previousValue = '';
let operator = null;
let shouldResetDisplay = false;

function updateDisplay(value) {
    if (value.length > 12) {
        display.value = Number(value).toExponential(4);
    } else {
        display.value = value;
    }
}

function updateExpression(text) {
    expressionDisplay.textContent = text || '';
}

function formatOperator(op) {
    switch (op) {
        case '/':
            return '÷';
        case '*':
            return '×';
        case '-':
            return '−';
        default:
            return op;
    }
}

function inputNumber(num) {
    if (shouldResetDisplay) {
        currentValue = num === '.' ? '0.' : num;
        shouldResetDisplay = false;
    } else {
        if (num === '.' && currentValue.includes('.')) return;
        if (num === '0' && currentValue === '0' && num !== '.') return;
        if (num !== '.' && currentValue === '0' && !currentValue.includes('.')) {
            currentValue = num;
        } else {
            currentValue += num;
        }
    }
    updateDisplay(currentValue);
}

function inputOperator(op) {
    if (op === 'C') {
        currentValue = '0';
        previousValue = '';
        operator = null;
        shouldResetDisplay = false;
        updateDisplay(currentValue);
        updateExpression('');
        return;
    }

    if (op === '±') {
        if (currentValue !== '0') {
            currentValue = String(Number(currentValue) * -1);
            updateDisplay(currentValue);
        }
        return;
    }

    if (op === '%') {
        currentValue = String(Number(currentValue) / 100);
        updateDisplay(currentValue);
        return;
    }

    if (operator && !shouldResetDisplay) {
        calculate();
    }

    previousValue = currentValue;
    operator = op;
    shouldResetDisplay = true;
    updateExpression(`${previousValue} ${formatOperator(operator)}`);
}

function calculate() {
    if (!operator || previousValue === '') return;

    const prev = parseFloat(previousValue);
    const curr = parseFloat(currentValue);
    let result;

    switch (operator) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '*':
            result = prev * curr;
            break;
        case '/':
            result = curr === 0 ? 'Error' : prev / curr;
            break;
        default:
            return;
    }

    updateExpression(`${prev} ${formatOperator(operator)} ${curr}`);

    if (result === 'Error') {
        currentValue = '0';
        updateDisplay('Error');
    } else {
        currentValue = String(Math.round(result * 1e10) / 1e10);
        updateDisplay(currentValue);
    }

    previousValue = '';
    operator = null;
    shouldResetDisplay = true;
}

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value');

        if (btn.classList.contains('btn-number')) {
            inputNumber(value);
        } else if (btn.classList.contains('btn-operator')) {
            inputOperator(value);
        } else if (btn.classList.contains('btn-equals')) {
            calculate();
        }
    });
});
