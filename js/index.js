$(document).ready(function() {
  var operationChain = '0';
  var currentInputIndex = 0;
  var currentOperation = '';
  var number1 = 0;
  var number2 = 0;
  var equalLastPressed = false;
  var on = true;
  
  $('.digit').click(function () {
    digitPressed($(this).text());
  });
  
  $('#bdot').click(function () {
    dotPressed();
  });
  
  $('.operation').click(function() {
    operationPressed($(this).text());
  });
  
  $('#onoff').click(function() {
    if (on) {
      $('#single').fadeOut(800);
      $('#chain').fadeOut(800);
      on = false;
    } else {
      on = true;
      reset();
      $('#chain').text('');      
      $('#single').fadeIn(800);
      $('#chain').fadeIn(800);
    }
  });
  
  $('#c').click(function() {
    if (on) {
      reset();
      $('#chain').text('');
    }  
  });
  
  $('#ce').click(function () {
    if (on) {
      if (/[-+*/]/.test(operationChain)) {
        operationChain = operationChain.slice(0, currentInputIndex);
        $('#single').text(0);
        $('#chain').text(operationChain);
      } else {
        operationChain = '';
        $('#single').text(0);
        $('#chain').text('');
      }
    }  
  });
  
  function doActualMath() {
    if (on) {
      switch (currentOperation) {
        case '+':
          return ((number1 * 1000000) + (number2 * 1000000)) / 1000000;
        case '-':
          return ((number1 * 1000000) - (number2 * 1000000)) / 1000000;
        case '*':
          return number1 * number2;
        case '/':
          return number1 / number2;
        default:
          return number2;
      }
    }
  }

  function digitPressed(digit) {
    if (on) {
      if ($('#chain').text() == 'Digit limit exceeded') {
        $('#chain').text('');
      }
      if (currentInputIndex === operationChain.length - 1 && 
          operationChain.charCodeAt(currentInputIndex) == 48) {
        operationChain = operationChain.slice(0, operationChain.length - 1) + digit;
      } else {
        if (equalLastPressed) {
          equalLastPressed = false;
          operationChain = digit; 
          currentInputIndex = operationChain.length - 1;
          number1 = 0;
        } else {
          operationChain += digit;
        }
      }
      $('#single').text(operationChain.slice(currentInputIndex));
      checkLimit();
    }
  }
  
  function operationPressed(operation) {
    if (on) {
      if (operationChain.charCodeAt(operationChain.length - 1) >= 48 &&
          operationChain.charCodeAt(operationChain.length - 1) <= 57 || 
          operationChain.charCodeAt(operationChain.length -1) == 46) {
        number2 = +operationChain.slice(currentInputIndex);
        var result = doActualMath();
        if (result < 1000000000) {
          if (operation === '=') {
            equalLastPressed = true;
            operationChain = '' + result;
            currentOperation = '';
            currentInputIndex = 0;
            $('#chain').text('');
          } else {
            equalLastPressed = false;
            operationChain += operation;
            currentOperation = operation;
            currentInputIndex = operationChain.length;
            $('#chain').text(operationChain.slice(-30));
          }
          number1 = result;
          $('#single').text(('' + result).slice(0, 9));
        } else {
          reset();
          $('#chain').text('Digit limit exceeded');
        }
      } else if (operation !== '=') {
        currentOperation = operation;
        operationChain = operationChain.slice(0, -1) + operation;
        $('#chain').text(operationChain);
      }
    }
  }
  
  function dotPressed() {
    if (on) {
      if ($('#chain').text() == 'Digit limit exceeded') {
        $('#chain').text('');
      }
      if (equalLastPressed) {
        equalLastPressed = false;
        operationChain = '0.'; 
        number1 = 0;
      } else if (operationChain.slice(currentInputIndex).indexOf('.') === -1) {
        if (operationChain.charCodeAt(operationChain.length - 1) >= 48 &&
            operationChain.charCodeAt(operationChain.length - 1) <= 57) {
          operationChain += '.';
        } else {
          operationChain += '0.';
        }
      }
      $('#single').text(operationChain.slice(currentInputIndex));
      checkLimit();
    }
  }
  
  function checkLimit() {
    if (on) {
      if (operationChain.slice(currentInputIndex).length > 9) {
        reset();
        $('#chain').text('Digit limit exceeded');
      }
    }
  }
  
  function reset() {
    operationChain = '0';
    currentInputIndex = 0;
    currentOperation = '';
    number1 = 0;
    equalLastPressed = false;
    $('#single').text('0');
  }
  
  $(document).keypress(function(e) {
    var helper = [42, 43, 45, 47, 61]
    if (e.which >= 48 && e.which <= 57) {
      digitPressed(String.fromCharCode(e.which));
    } else if (helper.indexOf(e.which) !== -1) {
      operationPressed(String.fromCharCode(e.which));
    } else if (e.which == 13) {
      operationPressed('=');
    } else if (e.which == 46) {
      dotPressed();
    }
  });
  
});