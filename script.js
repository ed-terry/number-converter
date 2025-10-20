/**
 * Number Base Converter
 * Created by: Edward Terry
 * Email: sir_edward@icloud.com
 * Made with ❤️
 */

// Get DOM elements
const inputNumber = document.getElementById('inputNumber');
const fromBase = document.getElementById('fromBase');
const toBase = document.getElementById('toBase');
const customFromBase = document.getElementById('customFromBase');
const customToBase = document.getElementById('customToBase');
const convertBtn = document.getElementById('convertBtn');
const resultSection = document.getElementById('result');
const resultValue = document.getElementById('resultValue');
const stepsSection = document.getElementById('stepsSection');
const stepsContainer = document.getElementById('stepsContainer');
const inputHelper = document.getElementById('inputHelper');
const fromBaseInfo = document.getElementById('fromBaseInfo');
const toBaseInfo = document.getElementById('toBaseInfo');
const quickInfo = document.getElementById('quickInfo');
const quickInfoContent = document.getElementById('quickInfoContent');
const resultExplanation = document.getElementById('resultExplanation');
const copyBtn = document.getElementById('copyBtn');
const progressBar = document.getElementById('progressBar');
const expandAllBtn = document.getElementById('expandAllBtn');
const collapseAllBtn = document.getElementById('collapseAllBtn');
const darkModeBtn = document.getElementById('darkModeBtn');

let isDarkMode = false;

// Handle custom base selection
fromBase.addEventListener('change', function() {
    customFromBase.style.display = this.value === 'custom' ? 'block' : 'none';
    updateBaseInfo();
    validateInputRealtime();
});

toBase.addEventListener('change', function() {
    customToBase.style.display = this.value === 'custom' ? 'block' : 'none';
    updateBaseInfo();
});

// Real-time input validation and help
inputNumber.addEventListener('input', validateInputRealtime);
customFromBase.addEventListener('input', function() {
    updateBaseInfo();
    validateInputRealtime();
});
customToBase.addEventListener('input', updateBaseInfo);

// Copy result to clipboard
copyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(resultValue.textContent).then(() => {
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyBtn.textContent = '📋 Copy';
        }, 2000);
    });
});

// Example cards click handlers
document.querySelectorAll('.example-card').forEach(card => {
    card.addEventListener('click', function() {
        const number = this.dataset.number;
        const from = this.dataset.from;
        const to = this.dataset.to;
        
        inputNumber.value = number;
        fromBase.value = from;
        toBase.value = to;
        
        // Add visual feedback
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        updateBaseInfo();
        validateInputRealtime();
        
        // Auto-convert after a short delay
        setTimeout(() => {
            convertBtn.click();
        }, 300);
    });
});

// Dark mode toggle
darkModeBtn.addEventListener('click', function() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    darkModeBtn.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('darkMode', isDarkMode);
});

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    isDarkMode = true;
    document.body.classList.add('dark-mode');
    darkModeBtn.textContent = '☀️ Light Mode';
}

// Expand/Collapse controls
expandAllBtn.addEventListener('click', function() {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('collapsed');
    });
});

collapseAllBtn.addEventListener('click', function() {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.add('collapsed');
    });
});

// Update base information
function updateBaseInfo() {
    const sourceBase = fromBase.value === 'custom' ? parseInt(customFromBase.value) : parseInt(fromBase.value);
    const targetBase = toBase.value === 'custom' ? parseInt(customToBase.value) : parseInt(toBase.value);
    
    if (sourceBase >= 2 && sourceBase <= 36) {
        const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(0, sourceBase);
        fromBaseInfo.innerHTML = `<small>Valid digits: ${validChars}</small>`;
        fromBaseInfo.style.display = 'block';
    } else {
        fromBaseInfo.style.display = 'none';
    }
    
    if (targetBase >= 2 && targetBase <= 36) {
        const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(0, targetBase);
        toBaseInfo.innerHTML = `<small>Will use digits: ${validChars}</small>`;
        toBaseInfo.style.display = 'block';
    } else {
        toBaseInfo.style.display = 'none';
    }
}

// Real-time input validation
function validateInputRealtime() {
    const number = inputNumber.value.trim().toUpperCase();
    const sourceBase = fromBase.value === 'custom' ? parseInt(customFromBase.value) : parseInt(fromBase.value);
    
    if (!number) {
        inputHelper.innerHTML = '<small>💡 Enter a number to convert</small>';
        inputHelper.className = 'input-helper info';
        return;
    }
    
    if (!sourceBase || sourceBase < 2 || sourceBase > 36) {
        inputHelper.innerHTML = '<small>⚠️ Select a valid source base (2-36)</small>';
        inputHelper.className = 'input-helper warning';
        return;
    }
    
    if (isValidNumber(number, sourceBase)) {
        inputHelper.innerHTML = '<small>✓ Valid number for base ' + sourceBase + '</small>';
        inputHelper.className = 'input-helper success';
    } else {
        const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(0, sourceBase);
        inputHelper.innerHTML = '<small>❌ Invalid! Use only: ' + validChars + ' and decimal point (.)</small>';
        inputHelper.className = 'input-helper error';
    }
}

// Initial base info
updateBaseInfo();

// Main conversion function
convertBtn.addEventListener('click', function() {
    const number = inputNumber.value.trim().toUpperCase();
    
    // Get the base values
    let sourceBase = fromBase.value === 'custom' ? parseInt(customFromBase.value) : parseInt(fromBase.value);
    let targetBase = toBase.value === 'custom' ? parseInt(customToBase.value) : parseInt(toBase.value);
    
    // Validate inputs
    if (!number) {
        showError('Please enter a number to convert');
        return;
    }
    
    if (!sourceBase || sourceBase < 2 || sourceBase > 36) {
        showError('Source base must be between 2 and 36');
        return;
    }
    
    if (!targetBase || targetBase < 2 || targetBase > 36) {
        showError('Target base must be between 2 and 36');
        return;
    }
    
    // Validate the input number for the source base
    if (!isValidNumber(number, sourceBase)) {
        showError(`"${number}" is not a valid number in base ${sourceBase}`);
        return;
    }
    
    // Perform conversion and show steps
    try {
        const steps = [];
        
        // Show quick explanation
        showQuickExplanation(number, sourceBase, targetBase);
        
        // Step 1: Convert to decimal (if not already)
        let decimalValue;
        if (sourceBase === 10) {
            // Parse decimal number (handle both integer and fractional parts)
            decimalValue = parseFloat(number.replace(',', '.'));
            steps.push({
                title: '✓ Step 1: Input is already in decimal',
                content: `The number <strong>${number}</strong> is already in base 10 (decimal). No conversion needed for this step.`,
                result: decimalValue,
                explanation: 'Since we\'re starting from decimal, we can skip directly to converting to the target base.'
            });
        } else {
            const conversionSteps = convertToDecimal(number, sourceBase);
            decimalValue = conversionSteps.result;
            steps.push(conversionSteps);
        }
        
        // Step 2: Convert from decimal to target base (if needed)
        let finalResult;
        if (targetBase === 10) {
            finalResult = decimalValue.toString();
            steps.push({
                title: '✓ Step 2: Target base is decimal',
                content: `The decimal value is <strong>${decimalValue}</strong>. This is our final result!`,
                result: finalResult,
                explanation: 'Since the target is decimal and we already have the decimal value, we\'re done!'
            });
        } else {
            const conversionSteps = convertFromDecimal(decimalValue, targetBase);
            finalResult = conversionSteps.result;
            steps.push(conversionSteps);
        }
        
        // Display result and steps
        displayResult(finalResult, sourceBase, targetBase, number);
        displaySteps(steps);
        
    } catch (error) {
        showError('Error during conversion: ' + error.message);
    }
});

// Validate if a number is valid for the given base
function isValidNumber(number, base) {
    const validChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.substring(0, base);
    let hasDecimalPoint = false;
    
    for (let char of number) {
        if (char === '.' || char === ',') {
            if (hasDecimalPoint) return false; // Only one decimal point allowed
            hasDecimalPoint = true;
        } else if (!validChars.includes(char)) {
            return false;
        }
    }
    return true;
}

// Convert from any base to decimal
function convertToDecimal(number, base) {
    // Replace comma with period for consistency
    number = number.replace(',', '.');
    
    // Split by decimal point
    const parts = number.split('.');
    const integerPart = parts[0] || '0';
    const fractionalPart = parts[1] || '';
    
    let decimalValue = 0;
    const calculations = [];
    let formula = '';
    
    // Convert integer part
    const integerDigits = integerPart.split('');
    const intLength = integerDigits.length;
    
    for (let i = 0; i < intLength; i++) {
        const digit = integerDigits[i];
        const digitValue = getDigitValue(digit);
        const position = intLength - 1 - i;
        const positionValue = digitValue * Math.pow(base, position);
        
        decimalValue += positionValue;
        
        calculations.push({
            digit: digit,
            digitValue: digitValue,
            position: position,
            calculation: `${digitValue} × ${base}^${position} = ${positionValue}`
        });
        
        if (i > 0) formula += ' + ';
        formula += `(${digit} × ${base}^${position})`;
    }
    
    // Convert fractional part
    if (fractionalPart) {
        const fracDigits = fractionalPart.split('');
        
        for (let i = 0; i < fracDigits.length; i++) {
            const digit = fracDigits[i];
            const digitValue = getDigitValue(digit);
            const position = -(i + 1);
            const positionValue = digitValue * Math.pow(base, position);
            
            decimalValue += positionValue;
            
            calculations.push({
                digit: digit,
                digitValue: digitValue,
                position: position,
                calculation: `${digitValue} × ${base}^${position} = ${positionValue.toFixed(10)}`
            });
            
            formula += ' + ';
            formula += `(${digit} × ${base}^${position})`;
        }
    }
    
    return {
        title: `📊 Step 1: Convert from base ${base} to decimal`,
        content: `To convert <strong>${number}</strong> from base ${base} to decimal, we multiply each digit by the base raised to its position power.<br><br>
                  <strong>How it works:</strong><br>
                  • Integer part: positions go right-to-left starting from 0 (units, ${base}s, ${base}²s, etc.)<br>
                  • Fractional part: positions are negative (1/${base}, 1/${base}², etc.)<br>
                  • Add all the results together to get the decimal value.`,
        formula: formula,
        calculations: calculations,
        result: decimalValue,
        explanation: `Each position represents a power of ${base}. We calculate the value of each digit at its position and sum them all up.`
    };
}

// Convert from decimal to any base
function convertFromDecimal(decimal, base) {
    if (decimal === 0) {
        return {
            title: `Step 2: Convert from decimal to base ${base}`,
            content: 'The decimal value is 0.',
            result: '0'
        };
    }
    
    // Split into integer and fractional parts
    const integerPart = Math.floor(Math.abs(decimal));
    const fractionalPart = Math.abs(decimal) - integerPart;
    const isNegative = decimal < 0;
    
    // Convert integer part
    const divisions = [];
    let quotient = integerPart;
    let intResult = '';
    
    if (quotient === 0) {
        intResult = '0';
    } else {
        while (quotient > 0) {
            const remainder = quotient % base;
            const newQuotient = Math.floor(quotient / base);
            
            divisions.push({
                dividend: quotient,
                divisor: base,
                quotient: newQuotient,
                remainder: remainder,
                digit: getDigitChar(remainder)
            });
            
            intResult = getDigitChar(remainder) + intResult;
            quotient = newQuotient;
        }
    }
    
    // Convert fractional part
    const multiplications = [];
    let fracResult = '';
    let fraction = fractionalPart;
    const maxIterations = 10; // Limit to prevent infinite loops
    let iteration = 0;
    
    if (fraction > 0.0000001) { // Check if there's a significant fractional part
        while (fraction > 0.0000001 && iteration < maxIterations) {
            const product = fraction * base;
            const digit = Math.floor(product);
            
            multiplications.push({
                multiplicand: fraction.toFixed(10),
                multiplier: base,
                product: product.toFixed(10),
                integerPart: digit,
                digit: getDigitChar(digit),
                newFraction: (product - digit).toFixed(10)
            });
            
            fracResult += getDigitChar(digit);
            fraction = product - digit;
            iteration++;
        }
    }
    
    const fullResult = (isNegative ? '-' : '') + intResult + (fracResult ? '.' + fracResult : '');
    
    let contentText = `To convert the decimal number <strong>${decimal}</strong> to base ${base}:<br><br>`;
    
    if (divisions.length > 0) {
        contentText += `<strong>For the integer part (${integerPart}):</strong><br>
                        • Repeatedly divide by ${base}<br>
                        • Collect the remainders<br>
                        • Read the remainders from bottom to top to get: <strong>${intResult}</strong><br><br>`;
    }
    
    if (multiplications.length > 0) {
        contentText += `<strong>For the fractional part (${fractionalPart.toFixed(10)}):</strong><br>
                        • Repeatedly multiply by ${base}<br>
                        • Take the integer part of each result<br>
                        • Read from top to bottom to get: <strong>.${fracResult}</strong><br>
                        • Limited to ${maxIterations} digits for precision`;
    }
    
    return {
        title: `🎯 Step 2: Convert from decimal (${decimal}) to base ${base}`,
        content: contentText,
        divisions: divisions.length > 0 ? divisions : null,
        multiplications: multiplications.length > 0 ? multiplications : null,
        result: fullResult,
        explanation: divisions.length > 0 && multiplications.length > 0 
            ? 'We handle integer and fractional parts separately, then combine them with a decimal point.'
            : divisions.length > 0 
            ? 'This is a whole number, so we only need to convert the integer part.'
            : 'This number has only a fractional part.'
    };
}

// Get numeric value of a digit character
function getDigitValue(digit) {
    if (digit >= '0' && digit <= '9') {
        return parseInt(digit);
    }
    return digit.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
}

// Get character representation of a digit value
function getDigitChar(value) {
    if (value < 10) {
        return value.toString();
    }
    return String.fromCharCode('A'.charCodeAt(0) + value - 10);
}

// Show quick explanation
function showQuickExplanation(number, sourceBase, targetBase) {
    const baseName = (base) => {
        const names = { 2: 'Binary', 8: 'Octal', 10: 'Decimal', 16: 'Hexadecimal' };
        return names[base] || `Base ${base}`;
    };
    
    let explanation = `<p><strong>What we're doing:</strong> Converting <code>${number}</code> from ${baseName(sourceBase)} (base ${sourceBase}) to ${baseName(targetBase)} (base ${targetBase})</p>`;
    
    if (sourceBase !== 10 && targetBase !== 10) {
        explanation += `<p><strong>The Process:</strong></p>
                       <ol>
                           <li>First, we convert from base ${sourceBase} to decimal (base 10)</li>
                           <li>Then, we convert from decimal to base ${targetBase}</li>
                       </ol>
                       <p><em>Why? Decimal is our "middle ground" - it's easier to go through decimal than directly between bases.</em></p>`;
    } else if (sourceBase === 10) {
        explanation += `<p><strong>The Process:</strong> Since your number is already in decimal, we just need to convert it to base ${targetBase}!</p>`;
    } else if (targetBase === 10) {
        explanation += `<p><strong>The Process:</strong> We'll convert from base ${sourceBase} to decimal - that's it!</p>`;
    }
    
    quickInfoContent.innerHTML = explanation;
    quickInfo.style.display = 'block';
}

// Display the result
function displayResult(result, sourceBase, targetBase, originalNumber) {
    resultValue.textContent = result;
    
    // Add result explanation
    const baseName = (base) => {
        const names = { 2: 'Binary', 8: 'Octal', 10: 'Decimal', 16: 'Hexadecimal' };
        return names[base] || `Base ${base}`;
    };
    
    resultExplanation.innerHTML = `
        <p>✨ <strong>${originalNumber}</strong> in ${baseName(sourceBase)} equals <strong>${result}</strong> in ${baseName(targetBase)}</p>
        <p class="result-note">Scroll down to see the detailed step-by-step conversion process!</p>
    `;
    
    resultSection.style.display = 'block';
    
    // Smooth scroll to result
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Display the conversion steps
function displaySteps(steps) {
    stepsContainer.innerHTML = '';
    
    // Animate progress bar
    progressBar.style.width = '0%';
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);
    
    steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        stepDiv.style.animationDelay = `${index * 0.15}s`;
        
        // Make steps collapsible
        const stepContent = document.createElement('div');
        stepContent.className = 'step-collapsible';
        
        let stepHTML = `
            <div class="step-header">
                <div class="step-number">${index + 1}.</div>
                <div class="step-title">${step.title}</div>
                <button class="collapse-btn">−</button>
            </div>
            <div class="step-body">
                <div class="step-content">${step.content}</div>
        `;
        
        // Add formula if present
        if (step.formula) {
            stepHTML += `<div class="step-formula">
                <div class="formula-label">Formula:</div>
                ${step.formula}
            </div>`;
        }
        
        // Add calculations if present
        if (step.calculations) {
            stepHTML += '<div class="calculation-section">';
            stepHTML += '<div class="section-label">🧮 Breaking it down:</div>';
            stepHTML += '<div class="step-calculation">';
            step.calculations.forEach((calc, i) => {
                stepHTML += `<div class="calc-item" style="animation-delay: ${(index * 0.15) + (i * 0.05)}s">
                    <span class="calc-number">${i + 1}.</span> ${calc.calculation}
                </div>`;
            });
            stepHTML += '</div>';
            stepHTML += `<div class="step-result">✓ Final Sum = ${step.result}</div>`;
            stepHTML += '</div>';
        }
        
        // Add divisions if present
        if (step.divisions) {
            stepHTML += '<div class="calculation-section">';
            stepHTML += '<div class="section-label">➗ Integer part conversion (read bottom to top):</div>';
            stepHTML += '<div class="step-formula division-table">';
            stepHTML += '<table><tr><th>Division</th><th>Quotient</th><th>Remainder</th><th>Digit</th></tr>';
            step.divisions.forEach((div, i) => {
                stepHTML += `<tr>
                    <td>${div.dividend} ÷ ${div.divisor}</td>
                    <td>${div.quotient}</td>
                    <td class="highlight">${div.remainder}</td>
                    <td><strong>${div.digit}</strong></td>
                </tr>`;
            });
            stepHTML += '</table>';
            stepHTML += '<div class="reading-direction">↑ Read these digits from bottom to top ↑</div>';
            stepHTML += '</div>';
            stepHTML += '</div>';
        }
        
        // Add multiplications if present
        if (step.multiplications) {
            stepHTML += '<div class="calculation-section">';
            stepHTML += '<div class="section-label">✕ Fractional part conversion (read top to bottom):</div>';
            stepHTML += '<div class="step-formula multiplication-table">';
            stepHTML += '<table><tr><th>Multiplication</th><th>Product</th><th>Integer Part</th><th>Digit</th></tr>';
            step.multiplications.forEach((mult, i) => {
                stepHTML += `<tr>
                    <td>${parseFloat(mult.multiplicand).toFixed(4)} × ${mult.multiplier}</td>
                    <td>${parseFloat(mult.product).toFixed(4)}</td>
                    <td class="highlight">${mult.integerPart}</td>
                    <td><strong>${mult.digit}</strong></td>
                </tr>`;
            });
            stepHTML += '</table>';
            stepHTML += '<div class="reading-direction">↓ Read these digits from top to bottom ↓</div>';
            stepHTML += '</div>';
            stepHTML += '</div>';
        }
        
        if (step.divisions || step.multiplications) {
            stepHTML += `<div class="step-result">✓ Result = ${step.result}</div>`;
        }
        
        // Add explanation if present
        if (step.explanation) {
            stepHTML += `<div class="step-explanation">💡 <strong>Why?</strong> ${step.explanation}</div>`;
        }
        
        stepHTML += '</div>'; // Close step-body
        
        stepDiv.innerHTML = stepHTML;
        
        // Add collapse functionality
        const collapseBtn = stepDiv.querySelector('.collapse-btn');
        const stepBody = stepDiv.querySelector('.step-body');
        
        collapseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            stepDiv.classList.toggle('collapsed');
            collapseBtn.textContent = stepDiv.classList.contains('collapsed') ? '+' : '−';
        });
        
        stepsContainer.appendChild(stepDiv);
    });
    
    stepsSection.style.display = 'block';
    
    // Scroll to steps section
    setTimeout(() => {
        stepsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// Show error message
function showError(message) {
    // Remove existing error
    const existingError = document.querySelector('.error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and show new error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    const converterSection = document.querySelector('.converter-section');
    converterSection.appendChild(errorDiv);
    
    // Hide result and steps
    resultSection.style.display = 'none';
    stepsSection.style.display = 'none';
    quickInfo.style.display = 'none';
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Allow Enter key to trigger conversion
inputNumber.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        convertBtn.click();
    }
});
