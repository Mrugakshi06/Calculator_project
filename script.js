/**
 * Premium Calculator Logic
 * ------------------------
 * This script handles the mathematical logic, user input validation,
 * error handling, and UI updates for the calculator.
 */

// --- State Variables ---
// These variables store the 'memory' of the calculator during use.

let currentOperand = '0';      // The number currently being entered or shown as a result.
let previousOperand = '';      // The number entered before an operator was pressed.
let operator = null;           // The current math operation (+, -, *, /).
let shouldResetDisplay = false; // Flag to clear the screen when a new number is typed after a result.

// --- DOM Elements ---
// Grabbing references to the HTML elements so we can update them dynamically.

const currentDisplay = document.getElementById('current-operand');
const previousDisplay = document.getElementById('previous-operand');
const errorMessage = document.getElementById('error-message');

/**
 * Appends a number or decimal point to the current input.
 * @param {string} number - The digit or '.' to add.
 */
function appendNumber(number) {
    // If a calculation was just finished, start a fresh number.
    if (shouldResetDisplay) {
        currentOperand = '';
        shouldResetDisplay = false;
    }
    
    // Safety check: Prevent users from typing more than one decimal point.
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Handle the starting zero: Replace '0' with the new number unless it's a decimal.
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    
    // Clear any active error messages as soon as the user starts typing again.
    clearError();
    // Update the visual display.
    updateDisplay();
}

/**
 * Sets the operator (+, -, *, /) for the current calculation.
 * @param {string} op - The operator symbol.
 */
function appendOperator(op) {
    // Handle percentage separately as it's an immediate calculation.
    if (op === '%') {
        calculatePercentage();
        return;
    }

    // If there's already an operator waiting, compute the result first (e.g., 5 + 5 + ...).
    if (operator !== null) {
        compute();
    }
    
    // Store the current operator and move the current number to 'previous'.
    operator = op;
    previousOperand = currentOperand;
    // Tell the calculator to clear the main screen when the next number is typed.
    shouldResetDisplay = true;
    updateDisplay();
}

/**
 * Calculates the percentage of the current number (divides by 100).
 */
function calculatePercentage() {
    try {
        const value = parseFloat(currentOperand);
        if (isNaN(value)) throw new Error('Invalid Input');
        currentOperand = (value / 100).toString();
        updateDisplay();
    } catch (err) {
        showError(err.message);
    }
}

/**
 * Clears the entire calculator state (All Clear - AC).
 */
function clearDisplay() {
    currentOperand = '0';
    previousOperand = '';
    operator = null;
    shouldResetDisplay = false;
    clearError();
    updateDisplay();
}

/**
 * Deletes the last character entered (Backspace).
 */
function deleteLast() {
    // If the display was just reset by an operator, we can't backspace into the previous state.
    if (shouldResetDisplay) return;
    
    // Remove the last character from the string.
    currentOperand = currentOperand.toString().slice(0, -1);
    // If the string becomes empty, default back to '0'.
    if (currentOperand === '') currentOperand = '0';
    updateDisplay();
}

/**
 * Performs the actual mathematical calculation based on the stored operator.
 */
function compute() {
    let computation;
    // Convert strings to actual numbers for calculation.
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    // If either value is missing, we can't calculate anything.
    if (isNaN(prev) || isNaN(current)) return;
    
    // Decision logic for math operations.
    switch (operator) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            // Error handling for division by zero.
            if (current === 0) {
                showError('Cannot divide by zero');
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    
    // Update state with the result.
    currentOperand = computation.toString();
    operator = null;
    previousOperand = '';
    // Next number typed will start a fresh input.
    shouldResetDisplay = true;
    updateDisplay();
}

/**
 * Syncs the internal state variables with the HTML elements on screen.
 */
function updateDisplay() {
    // Show the current number (formatted with commas).
    currentDisplay.innerText = formatNumber(currentOperand);
    
    // If an operation is in progress, show the previous number and the symbol (e.g., "50 +").
    if (operator != null) {
        previousDisplay.innerText = `${formatNumber(previousOperand)} ${getOperatorSymbol(operator)}`;
    } else {
        previousDisplay.innerText = '';
    }
}

/**
 * Formats numbers into human-readable strings (e.g., 10000 -> 10,000).
 * @param {string} number - The raw number string.
 */
function formatNumber(number) {
    const stringNumber = number.toString();
    // Split into integer and decimal parts.
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    
    // Use toLocaleString to add commas based on the user's region.
    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    
    // Combine back with the decimal part if it exists.
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

/**
 * Converts internal symbols (*, /) into pretty symbols (×, ÷) for the user.
 * @param {string} op - The raw operator.
 */
function getOperatorSymbol(op) {
    switch (op) {
        case '/': return '÷';
        case '*': return '×';
        case '-': return '−';
        case '+': return '+';
        default: return op;
    }
}

/**
 * Displays an error message and triggers a shake animation.
 * @param {string} msg - The error text to show.
 */
function showError(msg) {
    errorMessage.innerText = msg;
    currentDisplay.style.color = 'var(--error-color)';
    
    // Trigger the shake animation by adding a CSS class.
    const container = document.querySelector('.calculator-container');
    container.classList.add('shake');
    // Remove the class after the animation ends so it can be triggered again.
    setTimeout(() => container.classList.remove('shake'), 500);
}

/**
 * Resets the UI error state.
 */
function clearError() {
    errorMessage.innerText = '';
    currentDisplay.style.color = 'var(--text-primary)';
}

/**
 * Keyboard Support
 * ----------------
 * Listens for physical key presses and maps them to calculator functions.
 */
window.addEventListener('keydown', e => {
    // Map number keys 0-9.
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    // Map decimal point.
    if (e.key === '.') appendNumber('.');
    // Map Enter or '=' to compute.
    if (e.key === '=' || e.key === 'Enter') compute();
    // Map Backspace to delete.
    if (e.key === 'Backspace') deleteLast();
    // Map Escape to clear all.
    if (e.key === 'Escape') clearDisplay();
    // Map math operators.
    if (['+', '-', '*', '/'].includes(e.key)) appendOperator(e.key);
    // Map percentage.
    if (e.key === '%') appendOperator('%');
});

// Adding the shake animation CSS dynamically to keep it within the logic file.
const style = document.createElement('style');
style.innerHTML = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    .shake { animation: shake 0.2s ease-in-out 0s 2; }
`;
document.head.appendChild(style);
