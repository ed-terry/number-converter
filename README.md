# Number Base Converter 🔢

A beautiful, interactive number base converter that shows step-by-step conversion process for visual learning.


**Email:** sir_edward@icloud.com  
**Made with ❤️ By Edward Terry**

## Features

- **Convert between any bases (2-36)**: Binary, Octal, Decimal, Hexadecimal, and custom bases
- **Supports decimal/fractional numbers**: Handle numbers like 10.5, FF.A, 101.101
- **Step-by-step visualization**: See exactly how the conversion works
- **Beautiful UI**: Clean, modern interface with smooth animations
- **Educational**: Perfect for learning number systems and base conversions
- **Responsive design**: Works on desktop and mobile devices

## How to Use

1. Open `index.html` in your web browser
2. Enter a number in the input field
3. Select the source base (the base your number is currently in)
4. Select the target base (the base you want to convert to)
5. Click "Convert & Show Steps"
6. View the result and detailed step-by-step conversion process

## Examples

### Binary to Decimal
- Input: `1010`
- From: Binary (2)
- To: Decimal (10)
- Result: `10`

### Decimal to Hexadecimal
- Input: `255`
- From: Decimal (10)
- To: Hexadecimal (16)
- Result: `FF`

### Hexadecimal to Binary
- Input: `A5`
- From: Hexadecimal (16)
- To: Binary (2)
- Result: `10100101`

### Decimal with Fraction to Binary
- Input: `10.5`
- From: Decimal (10)
- To: Binary (2)
- Result: `1010.1`

### Binary with Fraction to Hexadecimal
- Input: `1010.101`
- From: Binary (2)
- To: Hexadecimal (16)
- Result: `A.A`

## Tech Stack

- **HTML5**: Structure
- **CSS3**: Styling with modern gradients and animations
- **Vanilla JavaScript**: All logic and interactivity

No frameworks, no build process - just open and use!

## How It Works

The converter uses a two-step process:

1. **Convert to Decimal**: First, the input number is converted to decimal (base 10) by multiplying each digit by the base raised to its position power (positive for integer part, negative for fractional part)
2. **Convert to Target Base**: 
   - For the integer part: repeatedly divide by the target base and collect remainders (read bottom to top)
   - For the fractional part: repeatedly multiply by the target base and collect integer parts (read top to bottom)

## Browser Support

Works in all modern browsers:
- Chrome/Edge
- Firefox
- Safari
- Opera

## Author

**Edward Terry**  
Email: [sir_edward@icloud.com](mailto:sir_edward@icloud.com)

Made with ❤️

## License

Free to use and modify for educational purposes.
