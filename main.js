$(function () {
    function log(message) {
        if (isLog) {
            console.log(message);
        }
    }

    function calcFontSize(textLength) {
        var fontSize = Math.round(450 / textLength);
        return fontSize;
    }

    function updateScreenStyle() {
        var length = screen.text().length;

        if (length > 9) {
            var fontSize = calcFontSize(length);
            screen.css('font-size', fontSize + 'px');
        } else {
            screen.css('font-size', '55px');
        }
    }

    function resetOperatorButton() {
        if (highlightedButton) {
            highlightedButton.removeClass('highlight');
            highlightedButton = undefined;
        }
    }

    function setScreenContent(newValue) {
        screen.text(newValue);
        updateScreenStyle();
    }

    function calcResult() {
        if (operand1 != undefined && operator != undefined) {
            var operand1Number = Number(operand1.replace(',', '.'));
            var operand2Number = Number(screen.text().replace(',', '.'));
            var result = 0;

            switch (operator) {
                case '+':
                    result = operand1Number + operand2Number;
                    break;
                case '-':
                    result = operand1Number - operand2Number;
                    break;
                case '×':
                    result = operand1Number * operand2Number;
                    break;
                case '/':
                    result = operand1Number / operand2Number;
                    break;
            }

            setScreenContent(String(result).replace('.', ','));
        }
    }

    function handleDigit(event) {
        var digit = event.type == 'keyup' ? event.key : event.target.innerHTML;

        if (digit == ',' || digit == '.') {
            if (screen.text() == '0' || highlightedButton) {
                setScreenContent('0,');
            } else {
                var dotNotFound = screen.text().indexOf(',') == -1;

                if (dotNotFound) {
                    setScreenContent(screen.text() + ',');
                }
            }
        } else {
            if (screen.text() == '0' || highlightedButton) {
                setScreenContent(digit);
            } else {
                setScreenContent(screen.text() + digit);
            }
        }

        resetOperatorButton();
    }

    function handleOperator(event) {
        var operatorButton;

        if (event.type == 'keyup') {
            switch (event.key) {
                case '+':
                    operatorButton = $('.plus');
                    break;
                case '-':
                    operatorButton = $('.minus');
                    break;
                case '/':
                    operatorButton = $('.division');
                    break;
                case '×':
                    operatorButton = $('.multiply');
                    break;
            }
        } else {
            operatorButton = $(event.target);
        }

        if (!highlightedButton) {
            calcResult();
        }

        resetOperatorButton();

        operatorButton.addClass('highlight');
        highlightedButton = operatorButton;

        operator = operatorButton.html();

        operand1 = screen.text();
    }

    function handleAcButton() {
        setScreenContent('0');
        operand1 = undefined;

        resetOperatorButton();
        operator = undefined;
    }

    function handleInvertButton() {
        if (screen.text() != '0') {
            var minusNotFound = screen.text().indexOf('-') == -1;

            if (minusNotFound) {
                setScreenContent('-' + screen.text());
            } else {
                setScreenContent(screen.text().substring(1));
            }
        }
    }

    function handleEqualButton() {
        calcResult();
        resetOperatorButton();
        operator = undefined;
    }

    function handlePercentButton() {
        var screenContentNumber = Number(screen.text().replace(',', '.'));

        var result = screenContentNumber / 100;

        setScreenContent(String(result).replace('.', ','));
    }

    // ======================================================================

    var isLog = true;
    var highlightedButton;
    var operand1;
    var operator;

    var screen = $('#calc-screen p');

    // ======================================================================

    $('.btn-digit').click(handleDigit);
    $('.btn-operator').click(handleOperator);
    $('.ac').click(handleAcButton);
    $('.plus-minus').click(handleInvertButton);
    $('.equal').click(handleEqualButton);
    $('.percent').click(handlePercentButton);

    $('body').keyup(function (event) {
        switch (event.key) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case ',':
            case '.':
                handleDigit(event);
                break;
            case '+':
            case '-':
            case '/':
            case '×':
                handleOperator(event);
                break;
            case '!':
                handleInvertButton();
                break;
            case 'Escape':
                handleAcButton();
                break;
            case '=':
            case 'Enter':
                handleEqualButton();
                break;
            case '%':
                handlePercentButton();
                break;
        }
    });
});
