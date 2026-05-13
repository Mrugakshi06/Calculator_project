# Calculator_project
A modern, sleek, and highly functional calculator that mimics a real-world device with enhanced digital aesthetics.

Key Features
Modern Design: Implemented a glassmorphism theme with background blobs and a sleek dark mode.
Robust Logic: Handles basic arithmetic, percentages, and complex sequences.
Error Handling: Displays specific error messages (e.g., "Cannot divide by zero") and provides visual feedback (shake animation) for invalid inputs.
Keyboard Support: Full support for number pads and operator keys (+, -, *, /, Enter, Backspace, Escape).
SEO & Semantics: Proper HTML5 structure and meta tags for accessibility and performance.

Implementation Details

UI/UX
Glassmorphism: Used backdrop-filter: blur() for the calculator body and buttons.
Typography: Integrated the 'Outfit' font from Google Fonts for a premium look.
Animations: Added a slide-in entry animation and a shake animation for errors.

Logic (script.js)
Input Validation: Prevents multiple decimal points and handles leading zeros correctly.
Formatted Output: Numbers are formatted with commas for readability (e.g., 1,000,000).
State Management: Clear separation between currentOperand, previousOperand, and operator.
