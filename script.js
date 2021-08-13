// function add(a, b) {
//   return parseFloat(a) + parseFloat(b);
// }

// function subtract(a, b) {
//   return a - b;
// }

// function multiply(a, b) {
//   return a * b;
// }

// function divide(a, b) {
//   return a / b;
// }

// function calculate(op, a, b) {
//   switch (op) {
//     case 'add' : 
//       return add(a, b);
//     case 'subtract' : 
//       return subtract(a, b);
//     case 'multiply' : 
//       return multiply(a, b);
//     case 'divide' : 
//       return divide(a, b);
//     default :
//       throw new Error("Called with unknown operator");
//   }
// }

// const calc = document.querySelector('.calc');
// const display = document.querySelector('.calc-display');
// const keys = calc.querySelector('.calc-keys');

// keys.addEventListener('click', e => {
//   if (e.target.matches('button')) {
//     const key = e.target;
//     const action = key.dataset.action;
//     const keyContent = key.textContent;
//     const displayedNum = display.textContent;
//     const previousKeyType = calc.dataset.previousKeyType;
    
//     if (!action) {
//       if (displayedNum === '0' || previousKeyType === 'operator') {
//         display.textContent = keyContent;
//       } else {
//         display.textContent = displayedNum + keyContent;
//       }
//       calc.dataset.previousKey = 'number';
//     }
//     if (
//       action === 'add' ||
//       action === 'subtract' ||
//       action === 'multiply' ||
//       action === 'divide'
//       ) {
//         key.classList.add('is-depressed');
//         calc.dataset.previousKeyType = 'operator';
//         calc.dataset.firstValue = displayedNum;
//         calc.dataset.operator = action;
//       }
//     if (action === 'decimal') {
//       if (!displayedNum.includes('.')) {
//         display.textContent = displayedNum + '.';
//       } else if (previousKeyType === 'operator') {
//         display.textContent = '0.'
//       }
//     calc.dataset.previousKeyType = 'decimal';
//     }
    
//     if (action === 'clear') {
//       display.textContent = '0';
//       calc.dataset.previousKeyType = 'clear';
//     }
    
//     if (action === 'calculate') {
//       const firstValue = calc.dataset.firstValue;
//       const operator = calc.dataset.operator;
//       const secondValue = displayedNum;

//       display.textContent = calculate(operator, firstValue, secondValue);
//       calc.dataset.previousKeyType = 'calculate';

//     }
//     Array.from(key.parentNode.children)
//       .forEach(k => k.classList.remove('is-depressed'));
//   }
// })

class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement
    this.currentOperandTextElement = currentOperandTextElement
    this.clear()
  }

  clear() {
    this.currentOperand = ''
    this.previousOperand = ''
    this.operation = undefined
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return
    this.currentOperand = this.currentOperand.toString() + number.toString()
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return
    if (this.previousOperand !== '') {
      this.compute()
    }
    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = ''
  }

  compute() {
    let computation
    const prev = parseFloat(this.previousOperand)
    const current = parseFloat(this.currentOperand)
    if (isNaN(prev) || isNaN(current)) return
    switch (this.operation) {
      case '+':
        computation = prev + current
        break
      case '-':
        computation = prev - current
        break   
      case 'x':
        computation = prev * current
        break
      case '÷':
        computation = prev / current
        break
      default:
        return
    }
    this.currentOperand = computation
    this.operation = undefined
    this.previousOperand = ''
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString()
    const integerDigits = parseFloat(stringNumber.split('.')[0])
    const decimalDigits = stringNumber.split('.')[1]
    let integerDisplay
    if (isNaN(integerDigits)) {
      integerDisplay = ''
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0 })
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText = 
      this.getDisplayNumber(this.currentOperand)    
    if (this.operation != null) {
      this.previousOperandTextElement.innerText = 
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandTextElement.innerText = ''
    }
  }
}

const numberButtons = document.querySelectorAll('[data-number]')
const operationButtons = document.querySelectorAll('[data-operation]')
const equalsButton = document.querySelector('[data-equals]')
const clearButton = document.querySelector('[data-clear]')
const previousOperandTextElement = document.querySelector('[data-previous-operand]')
const currentOperandTextElement = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText)
    calculator.updateDisplay()
  })
})

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
  })
})

equalsButton.addEventListener('click', button => {
  calculator.compute()
  calculator.updateDisplay()
})

clearButton.addEventListener('click', button => {
  calculator.clear()
  calculator.updateDisplay()
})