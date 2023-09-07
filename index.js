class Calculator {
    constructor(inputDisplay,outputDisplay) {
        this.inputDisplay = inputDisplay;
        this.outputDisplay = outputDisplay;
        this.inputHistory = [];
    }

    clearAllHistory() {
        this.inputHistory = [];
        this.updateInputDisplay();
        this.updateOutputDisplay("0");
    }
    
    backspace() {
        switch (this.getLastInputType()) {
            case "number":
                if(this.getLastInputValue().length > 1) {
                    this.editLastInput(this.getLastInputValue().slice(0, -1), "number");
                } else {
                    this.deleteLastInput();
                }
                break;
            case "operator":
                this.deleteLastInput();
                break;
            default:
                return;
        }
    }
    
    changePercentToDecimal() {
        if(this.getLastInputType() === "number") {
            this.editLastInput(this.getLastInputValue() / 100, "number");
        }
    }
    
    insertNumber(value) {
        if(this.getLastInputType() === "number") {
            this.appendToLastInput(value);
        } else if(this.getLastInputType() === "operator" || this.getLastInputType() === null) {
            this.addNewInput(value, "number");
        }
    }
    
    insertOperation(value) {
        switch (this.getLastInputType()) {
            case "number":
                this.addNewInput(value, "operator");
                break;
            case "operator":
                this.editLastInput(value, "operator");
                break;
            case "equals":
                let output = this.getOutputValue();
                this.clearAllHistory();
                this.addNewInput(output, "number");
                this.addNewInput(value, "operator");
            default:
                return;
        }
    }
    
    negateNumber() {
        if (this.getLastInputType() === "number") {
            this.editLastInput(parseFloat(this.getLastInputValue()) * -1, "number");
        }
    }
    
    insertDecimalPoint() {
        if (this.getLastInputType() === "number" && !this.getLastInputType().includes(".")) {
            this.appendToLastInput(".");
        } else if (this.getLastInputType() === "operator" || this.getLastInputType() === null) {
            this.addNewInput("0", "number");
        }
    }
    
    generateResult() {
        if (this.getLastInputType() === "number") {
            const inputExpression = this.getAllInputValues().join("");
    
            // Define a regular expression to split the input expression into numbers and operators
            const regex = /(\d+(?:\.\d+)?|[+\-×÷])/g;
            const tokens = inputExpression.match(regex);
    
            if (tokens && tokens.length >= 3) {
                try {
                    let result = parseFloat(tokens[0]);
    
                    for (let i = 1; i < tokens.length; i += 2) {
                        const operator = tokens[i];
                        const operand = parseFloat(tokens[i + 1]);
    
                        if (isNaN(operand)) {
                            throw new Error("Invalid operand");
                        }
    
                        switch (operator) {
                            case "+":
                                result += operand;
                                break;
                            case "-":
                                result -= operand;
                                break;
                            case "×":
                                result *= operand;
                                break;
                            case "÷":
                                if (operand === 0) {
                                    throw new Error("Division by zero");
                                }
                                result /= operand;
                                break;
                            default:
                                throw new Error("Invalid operator");
                        }
                    }
    
                    this.addNewInput("=", "equals");
                    this.updateOutputDisplay(result.toString());
                } catch (error) {
                    console.error("Error:", error);
                }
            } else {
                console.error("Invalid input");
            }
        }
    }

    //Helper functions
    getLastInputType() {
        return (this.inputHistory.length === 0) ? null : this.inputHistory[this.inputHistory.length -1].type;
    }

    getLastInputValue() {
        return (this.inputHistory.length === 0) ? null : this.inputHistory[this.inputHistory.length -1].value;
    }

    getAllInputValues() {
        return this.inputHistory.map(entry => entry.value);
    }

    getOutputValue() {
        return this.outputDisplay.value.replace(/,/g,'');
    }

    addNewInput(value, type) {
        this.inputHistory.push({ "type": type, "value": value.toString() });
        this.updateInputDisplay();
    }

    appendToLastInput(value) {
        this.inputHistory[this.inputHistory.length - 1 ].value += value.toString();
        this.updateInputDisplay();
    }

    editLastInput(value, type) {
        this.inputHistory.pop();
        this.addNewInput(value, type);
    }

    deleteLastInput() {
        this.inputHistory.pop();
        this.updateInputDisplay();
    }

    updateInputDisplay() {
        this.inputDisplay.value = this.getAllInputValues().join(" ");
    }

    updateOutputDisplay(value) {
        this.outputDisplay.value = Number(value).toLocaleString();
    }

    performOperation(leftOperand, operation, rightOperand) {
        leftOperand = parseFloat(leftOperand);
        rightOperand = parseFloat(rightOperand);

        if (Number.isNaN(leftOperand) || Number.isNaN(rightOperand)) {
            return;
        }

        switch (operation) {
            case "×":
                return leftOperand * rightOperand;
            case "÷":
                return leftOperand / rightOperand;
            case "-":
                return leftOperand - rightOperand;
            case "+":
                return leftOperand + rightOperand;
            default:
                return rightOperand.toString();
        }
    }
}

const inputDisplay= document.querySelector('#history');
const outputDisplay= document.querySelector('#result');

const allClearButton= document.querySelector('[data-all-clear]');
const backspaceButton= document.querySelector('[data-backspace]');
const percentButton= document.querySelector('[data-percent]');
const operationButtons= document.querySelectorAll('[data-operator]');
const numberButtons= document.querySelectorAll('[data-number]');
const negationButton= document.querySelector('[data-negation]');
const decimanButton= document.querySelector('[data-decimal]');
const equalsButton= document.querySelector('[data-equals]');

const calculator = new Calculator(inputDisplay, outputDisplay);

allClearButton.addEventListener("click", () => {
    calculator.clearAllHistory();
});

backspaceButton.addEventListener("click", () => {
    calculator.backspace();
});

percentButton.addEventListener("click", () => {
    calculator.changePercentToDecimal();
});

operationButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        let{target} = event;
        calculator.insertNumber(target.dataset.operator);
    })
});

numberButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        let{target} = event;
        calculator.insertNumber(target.dataset.number);
    })
});

negationButton.addEventListener("click", () => {
    calculator.negateNumber();
});

decimanButton.addEventListener("click", () => {
    calculator.insertDecimalPoint();
});

equalsButton.addEventListener("click", () => {
    calculator.generateResult();
});