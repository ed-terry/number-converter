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

// Handle custom base selection
fromBase.addEventListener('change', function() {
    customFromBase.style.display = this.value === 'custom' ? 'block' : 'none';
});

toBase.addEventListener('change', function() {
    customToBase.style.display = this.value === 'custom' ? 'block' : 'none';
});

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
        
        // Step 1: Convert to decimal (if not already)
        let decimalValue;
        if (sourceBase === 10) {
            // Parse decimal number (handle both integer and fractional parts)
            decimalValue = parseFloat(number.replace(',', '.'));
            steps.push({
                title: 'Input is already in decimal',
                content: `The number ${number} is already in base 10 (decimal).`,
                result: decimalValue
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
                title: 'Target base is decimal',
                content: `The decimal value is ${decimalValue}.`,
                result: finalResult
            });
        } else {
            const conversionSteps = convertFromDecimal(decimalValue, targetBase);
            finalResult = conversionSteps.result;
            steps.push(conversionSteps);
        }
        
        // Display result and steps
        displayResult(finalResult);
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
        title: `Step 1: Convert from base ${base} to decimal`,
        content: 'We multiply each digit by the base raised to its position. Integer positions are positive (right to left from 0), fractional positions are negative.',
        formula: formula,
        calculations: calculations,
        result: decimalValue
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
    
    return {
        title: `Step 2: Convert from decimal (${decimal}) to base ${base}`,
        content: 'Integer part: divide repeatedly and collect remainders (bottom to top). Fractional part: multiply repeatedly and collect integer parts (top to bottom).',
        divisions: divisions.length > 0 ? divisions : null,
        multiplications: multiplications.length > 0 ? multiplications : null,
        result: fullResult
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

// Display the result
function displayResult(result) {
    resultValue.textContent = result;
    resultSection.style.display = 'block';
}

// Display the conversion steps
function displaySteps(steps) {
    stepsContainer.innerHTML = '';
    
    steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        stepDiv.style.animationDelay = `${index * 0.1}s`;
        
        let stepHTML = `
            <div class="step-title">${step.title}</div>
            <div class="step-content">${step.content}</div>
        `;
        
        // Add formula if present
        if (step.formula) {
            stepHTML += `<div class="step-formula">${step.formula}</div>`;
        }
        
        // Add calculations if present
        if (step.calculations) {
            stepHTML += '<div class="step-calculation">';
            step.calculations.forEach(calc => {
                stepHTML += `<div class="calc-item">${calc.calculation}</div>`;
            });
            stepHTML += '</div>';
            stepHTML += `<div class="step-result">Sum = ${step.result}</div>`;
        }
        
        // Add divisions if present
        if (step.divisions) {
            stepHTML += '<div class="step-formula">';
            stepHTML += '<strong>Integer part conversion:</strong><br>';
            step.divisions.forEach((div, i) => {
                stepHTML += `${div.dividend} ÷ ${div.divisor} = ${div.quotient} remainder ${div.remainder} (digit: ${div.digit})<br>`;
            });
            stepHTML += '</div>';
        }
        
        // Add multiplications if present
        if (step.multiplications) {
            stepHTML += '<div class="step-formula">';
            stepHTML += '<strong>Fractional part conversion:</strong><br>';
            step.multiplications.forEach((mult, i) => {
                stepHTML += `${mult.multiplicand} × ${mult.multiplier} = ${mult.product} → integer part: ${mult.integerPart} (digit: ${mult.digit})<br>`;
            });
            stepHTML += '</div>';
        }
        
        if (step.divisions || step.multiplications) {
            stepHTML += `<div class="step-result">Result = ${step.result}</div>`;
        }
        
        // Add simple result if present
        if (typeof step.result === 'string' && !step.calculations && !step.divisions) {
            stepHTML += `<div class="step-result">${step.result}</div>`;
        }
        
        stepDiv.innerHTML = stepHTML;
        stepsContainer.appendChild(stepDiv);
    });
    
    stepsSection.style.display = 'block';
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
