// Generated by CoffeeScript 1.10.0

/*
HTML5 Number polyfill | Jonathan Stipe | https://github.com/jonstipe/number-polyfill
 */

(function() {
  (function($) {
    var isLackingNumberInputSupport, numberPolyfill;
    isLackingNumberInputSupport = function() {
      var testInput, testValue;
      testInput = document.createElement("input");
      testInput.setAttribute("type", "number");
      testValue = "123foo";
      testInput.value = testValue;
      return testInput.value === testValue;
    };
    if (isLackingNumberInputSupport()) {
      $.fn.inputNumber = function() {
        $(this).filter(function() {
          var $this;
          $this = $(this);
          return $this.is('input[type="number"]') && !($this.parent().is("span") && $this.next().is("div.number-spin-btn-container") && $this.next().children().first().is("div.number-spin-btn-up") && $this.next().children().eq(1).is("div.number-spin-btn-down"));
        }).each(function() {
          numberPolyfill.polyfills.push(new numberPolyfill(this));
        });
        return $(this);
      };
      numberPolyfill = function(elem) {
        var $fieldContainer, MutationObserver, attrObserver, halfHeight;
        this.elem = $(elem);
        if (!(this.elem.is(":root *") && this.elem.height() > 0)) {
          throw new Error("Element must be in DOM and displayed so that its height can be measured.");
        }
        halfHeight = (this.elem.outerHeight() / 2) + 'px';
        this.upBtn = $('<div/>', {
          "class": 'number-spin-btn number-spin-btn-up',
          style: "height: " + halfHeight
        });
        this.downBtn = $('<div/>', {
          "class": 'number-spin-btn number-spin-btn-down',
          style: "height: " + halfHeight
        });
        this.btnContainer = $('<div/>', {
          "class": 'number-spin-btn-container'
        });
        $fieldContainer = $('<span/>', {
          style: "white-space: nowrap"
        });
        this.upBtn.appendTo(this.btnContainer);
        this.downBtn.appendTo(this.btnContainer);
        this.elem.wrap($fieldContainer);
        this.btnContainer.insertAfter(this.elem);
        this.elem.on({
          focus: (function(_this) {
            return function(e) {
              _this.elem.on({
                DOMMouseScroll: numberPolyfill.domMouseScrollHandler,
                mousewheel: numberPolyfill.mouseWheelHandler
              }, {
                p: _this
              });
            };
          })(this),
          blur: (function(_this) {
            return function(e) {
              _this.elem.off({
                DOMMouseScroll: numberPolyfill.domMouseScrollHandler,
                mousewheel: numberPolyfill.mouseWheelHandler
              });
            };
          })(this)
        });
        this.elem.on({
          keypress: numberPolyfill.elemKeypressHandler,
          change: numberPolyfill.elemChangeHandler
        }, {
          p: this
        });
        this.upBtn.on("mousedown", {
          p: this,
          func: "increment"
        }, numberPolyfill.elemBtnMousedownHandler);
        this.downBtn.on("mousedown", {
          p: this,
          func: "decrement"
        }, numberPolyfill.elemBtnMousedownHandler);
        this.elem.css("textAlign", 'right');
        this.attrMutationHandler("class");
        if ((typeof WebKitMutationObserver !== "undefined" && WebKitMutationObserver !== null) || (typeof MutationObserver !== "undefined" && MutationObserver !== null)) {
          if ((typeof WebKitMutationObserver !== "undefined" && WebKitMutationObserver !== null) && (typeof MutationObserver === "undefined" || MutationObserver === null)) {
            MutationObserver = WebKitMutationObserver;
          }
          attrObserver = new MutationObserver((function(_this) {
            return function(mutations, observer) {
              var j, len, mutation;
              for (j = 0, len = mutations.length; j < len; j++) {
                mutation = mutations[j];
                if (mutation.type === "attributes") {
                  _this.attrMutationHandler(mutation.attributeName, mutation.oldValue, _this.elem.attr(mutation.attributeName));
                }
              }
            };
          })(this));
          attrObserver.observe(elem, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ["class", "style", "min", "max", "step"]
          });
        } else if (typeof MutationEvent !== "undefined" && MutationEvent !== null) {
          this.elem.on("DOMAttrModified", (function(_this) {
            return function(evt) {
              _this.attrMutationHandler(evt.originalEvent.attrName, evt.originalEvent.prevValue, evt.originalEvent.newValue);
            };
          })(this));
        }
      };
      numberPolyfill.polyfills = [];
      numberPolyfill.isNumber = function(input) {
        if ((input != null) && typeof input.toString === "function") {
          return /^-?\d+(?:\.\d+)?$/.test(input.toString());
        } else {
          return false;
        }
      };
      numberPolyfill.isFloat = function(input) {
        if ((input != null) && typeof input.toString === "function") {
          return /^-?\d+\.\d+$/.test(input.toString());
        } else {
          return false;
        }
      };
      numberPolyfill.isInt = function(input) {
        if ((input != null) && typeof input.toString === "function") {
          return /^-?\d+$/.test(input.toString());
        } else {
          return false;
        }
      };
      numberPolyfill.isNegative = function(input) {
        if ((input != null) && typeof input.toString === "function") {
          return /^-\d+(?:\.\d+)?$/.test(input.toString());
        } else {
          return false;
        }
      };
      numberPolyfill.raiseNum = function(num) {
        var a, numi, nump;
        if (typeof num === "number" || (typeof num === "object" && num instanceof Number)) {
          if (num % 1) {
            return {
              num: num.toString(),
              precision: 0
            };
          } else {
            return numberPolyfill.raiseNum(num.toString());
          }
        } else if (typeof num === "string" || (typeof num === "object" && num instanceof String)) {
          if (numberPolyfill.isFloat(num)) {
            num = num.replace(/(\.\d)0+$/, "$1");
            nump = numberPolyfill.getPrecision(num);
            numi = num.slice(0, -(nump + 1)) + num.slice(-nump);
            numi = numi.replace(/^(-?)0+(\d+)/, "$1$2");
            a = {
              num: numi,
              precision: nump
            };
            return a;
          } else if (numberPolyfill.isInt(num)) {
            return {
              num: num,
              precision: 0
            };
          }
        }
      };
      numberPolyfill.raiseNumPrecision = function(rNum, newPrecision) {
        var i, j, ref, ref1;
        if (rNum.precision < newPrecision) {
          for (i = j = ref = rNum.precision, ref1 = newPrecision; ref <= ref1 ? j < ref1 : j > ref1; i = ref <= ref1 ? ++j : --j) {
            rNum.num += "0";
          }
          rNum.precision = newPrecision;
        }
      };
      numberPolyfill.lowerNum = function(num) {
        if (num.precision > 0) {
          while (num.num.length < (num.precision + 1)) {
            if (numberPolyfill.isNegative(num.num)) {
              num.num = num.num.slice(0, 1) + "0" + num.num.slice(1);
            } else {
              num.num = "0" + num.num;
            }
          }
          return (num.num.slice(0, -num.precision) + "." + num.num.slice(-num.precision)).replace(/\.?0+$/, '').replace(/^(-?)(\.)/, "$10$2");
        } else {
          return num.num;
        }
      };
      numberPolyfill.preciseAdd = function(num1, num2) {
        var num1i, num2i, result;
        if ((typeof num1 === "number" || (typeof num1 === "object" && num1 instanceof Number)) && (typeof num2 === "number" || (typeof num2 === "object" && num2 instanceof Number))) {
          if (num1 % 1 === 0 && num2 % 1 === 0) {
            return (num1 + num2).toString();
          } else {
            return numberPolyfill.preciseAdd(num1.toString(), num2.toString());
          }
        } else if ((typeof num1 === "string" || (typeof num1 === "object" && num1 instanceof String)) && (typeof num2 === "string" || (typeof num2 === "object" && num2 instanceof String))) {
          if (numberPolyfill.isNumber(num1)) {
            if (numberPolyfill.isNumber(num2)) {
              if (numberPolyfill.isInt(num1)) {
                if (numberPolyfill.isInt(num2)) {
                  return numberPolyfill.preciseAdd(parseInt(num1, 10), parseInt(num2, 10));
                } else if (numberPolyfill.isFloat(num2)) {
                  num1 += ".0";
                }
              } else if (numberPolyfill.isFloat(num1)) {
                if (numberPolyfill.isInt(num2)) {
                  num2 += ".0";
                }
              }
              num1i = numberPolyfill.raiseNum(num1);
              num2i = numberPolyfill.raiseNum(num2);
              if (num1i.precision < num2i.precision) {
                numberPolyfill.raiseNumPrecision(num1i, num2i.precision);
              } else if (num1i.precision > num2i.precision) {
                numberPolyfill.raiseNumPrecision(num2i, num1i.precision);
              }
              result = (parseInt(num1i.num, 10) + parseInt(num2i.num, 10)).toString();
              if (num1i.precision > 0) {
                if (numberPolyfill.isNegative(result)) {
                  while (num1i.precision > (result.length - 1)) {
                    result = "-0" + result.slice(1);
                  }
                } else {
                  while (num1i.precision > result.length) {
                    result = "0" + result;
                  }
                }
                result = numberPolyfill.lowerNum({
                  num: result,
                  precision: num1i.precision
                });
              }
              result = result.replace(/^(-?)\./, '$10.');
              if (numberPolyfill.isFloat(result)) {
                result = result.replace(/0+$/, '');
              }
              return result;
            } else {
              throw new SyntaxError("Argument \"" + num2 + "\" is not a number.");
            }
          } else {
            throw new SyntaxError("Argument \"" + num1 + "\" is not a number.");
          }
        } else {
          return numberPolyfill.preciseAdd(num1.toString(), num2.toString());
        }
      };
      numberPolyfill.preciseSubtract = function(num1, num2) {
        if (typeof num2 === "number" || (typeof num2 === "object" && num2 instanceof Number)) {
          return numberPolyfill.preciseAdd(num1, -num2);
        } else if (typeof num2 === "string" || (typeof num2 === "object" && num2 instanceof String)) {
          if (numberPolyfill.isNegative(num2)) {
            return numberPolyfill.preciseAdd(num1, num2.slice(1));
          } else {
            return numberPolyfill.preciseAdd(num1, "-" + num2);
          }
        }
      };
      numberPolyfill.getPrecision = function(num) {
        var k, kNum;
        if (typeof num === "number") {
          k = 0;
          kNum = num;
          while (kNum !== Math.floor(kNum)) {
            kNum = num * Math.pow(10, ++k);
          }
          return k;
        } else if (typeof num === "string") {
          if (numberPolyfill.isNumber(num)) {
            if (numberPolyfill.isFloat(num)) {
              return /^-?\d+(?:\.(\d+))?$/.exec(num)[1].length;
            } else {
              return 0;
            }
          }
        }
      };
      numberPolyfill.prototype.getParams = function() {
        var max, min, step, val;
        step = this.elem.attr('step');
        min = this.elem.attr('min');
        max = this.elem.attr('max');
        val = this.elem.val();
        if (!numberPolyfill.isNumber(step)) {
          step = null;
        }
        if (!numberPolyfill.isNumber(min)) {
          min = null;
        }
        if (!numberPolyfill.isNumber(max)) {
          max = null;
        }
        if (!numberPolyfill.isNumber(val)) {
          val = min || 0;
        }
        return {
          min: (min != null) ? min : null,
          max: (max != null) ? max : null,
          step: (step != null) ? step : "1",
          val: (val != null) ? val : null
        };
      };
      numberPolyfill.prototype.clipValues = function(value, min, max) {
        if ((max != null) && parseFloat(value) > parseFloat(max)) {
          return max;
        } else if ((min != null) && parseFloat(value) < parseFloat(min)) {
          return min;
        } else {
          return value;
        }
      };
      numberPolyfill.prototype.stepNormalize = function(value) {
        var cValue, min, params, sn, step;
        params = this.getParams();
        step = params['step'];
        min = params['min'];
        if (step == null) {
          return value;
        } else {
          step = numberPolyfill.raiseNum(step);
          cValue = numberPolyfill.raiseNum(value);
          if (cValue.precision > step.precision) {
            numberPolyfill.raiseNumPrecision(step, cValue.precision);
          } else if (cValue.precision < step.precision) {
            numberPolyfill.raiseNumPrecision(cValue, step.precision);
          }
          if (min != null) {
            cValue = numberPolyfill.raiseNum(numberPolyfill.preciseSubtract(value, min));
            numberPolyfill.raiseNumPrecision(cValue, step.precision);
          }
          if (parseFloat(cValue.num) % parseFloat(step.num) === 0) {
            return value;
          } else {
            cValue = numberPolyfill.lowerNum({
              num: (Math.round(parseFloat(cValue.num) / (sn = parseFloat(step.num))) * sn).toString(),
              precision: cValue.precision
            });
            if (min != null) {
              cValue = numberPolyfill.preciseAdd(cValue, min);
            }
            return cValue;
          }
        }
      };
      numberPolyfill.domMouseScrollHandler = function(evt) {
        var p;
        p = evt.data.p;
        evt.preventDefault();
        if (evt.originalEvent.detail < 0) {
          p.increment();
        } else {
          p.decrement();
        }
      };
      numberPolyfill.mouseWheelHandler = function(evt) {
        var p;
        p = evt.data.p;
        evt.preventDefault();
        if (evt.originalEvent.wheelDelta > 0) {
          p.increment();
        } else {
          p.decrement();
        }
      };
      numberPolyfill.elemKeypressHandler = function(evt) {
        var p, ref, ref1;
        p = evt.data.p;
        if (evt.keyCode === 38) {
          p.increment();
        } else if (evt.keyCode === 40) {
          p.decrement();
        } else if (((ref = evt.keyCode) !== 8 && ref !== 9 && ref !== 35 && ref !== 36 && ref !== 37 && ref !== 39 && ref !== 46) && ((ref1 = evt.which) !== 45 && ref1 !== 46 && ref1 !== 48 && ref1 !== 49 && ref1 !== 50 && ref1 !== 51 && ref1 !== 52 && ref1 !== 53 && ref1 !== 54 && ref1 !== 55 && ref1 !== 56 && ref1 !== 57)) {
          evt.preventDefault();
        }
      };
      numberPolyfill.elemChangeHandler = function(evt) {
        var min, newVal, p, params;
        p = evt.data.p;
        if (p.elem.val() !== "") {
          if (numberPolyfill.isNumber(p.elem.val())) {
            params = p.getParams();
            newVal = p.clipValues(params['val'], params['min'], params['max']);
            newVal = p.stepNormalize(newVal);
            if (newVal.toString() !== p.elem.val()) {
              p.elem.val(newVal).change();
            }
          } else {
            min = p.elem.attr('min');
            p.elem.val((min != null) && numberPolyfill.isNumber(min) ? min : "0").change();
          }
        }
      };
      numberPolyfill.elemBtnMousedownHandler = function(evt) {
        var func, p, releaseFunc, timeoutFunc;
        p = evt.data.p;
        func = evt.data.func;
        p[func]();
        timeoutFunc = (function(_this) {
          return function(incFunc) {
            p[func]();
            p.timeoutID = window.setTimeout(timeoutFunc, 10);
          };
        })(this);
        releaseFunc = (function(_this) {
          return function(e) {
            window.clearTimeout(p.timeoutID);
            $(document).off('mouseup', releaseFunc);
            $(_this).off('mouseleave', releaseFunc);
          };
        })(this);
        $(document).on('mouseup', releaseFunc);
        $(this).on('mouseleave', releaseFunc);
        p.timeoutID = window.setTimeout(timeoutFunc, 700);
      };
      numberPolyfill.prototype.attrMutationHandler = function(name, oldValue, newValue) {
        var ei, h, i, j, len, ref;
        if (name === "class" || name === "style") {
          h = {};
          ei = null;
          ref = ["opacity", "visibility", "-moz-transition-property", "-moz-transition-duration", "-moz-transition-timing-function", "-moz-transition-delay", "-webkit-transition-property", "-webkit-transition-duration", "-webkit-transition-timing-function", "-webkit-transition-delay", "-o-transition-property", "-o-transition-duration", "-o-transition-timing-function", "-o-transition-delay", "transition-property", "transition-duration", "transition-timing-function", "transition-delay"];
          for (j = 0, len = ref.length; j < len; j++) {
            i = ref[j];
            if ((ei = this.elem.css(i)) !== this.btnContainer.css(i)) {
              h[i] = ei;
            }
          }
          if (this.elem.css("display") === "none") {
            h["display"] = "none";
          } else {
            h["display"] = "inline-block";
          }
          this.btnContainer.css(h);
        } else if (name === "min" || name === "max" || name === "step") {
          this.elem.change();
        }
      };
      numberPolyfill.prototype.increment = function() {
        var newVal, params;
        if (!(this.elem.is(":disabled") || this.elem.is("[readonly]"))) {
          params = this.getParams();
          newVal = numberPolyfill.preciseAdd(params['val'], params['step']);
          if ((params['max'] != null) && parseFloat(newVal) > parseFloat(params['max'])) {
            newVal = params['max'];
          }
          newVal = this.stepNormalize(newVal);
          this.elem.val(newVal).change();
        }
      };
      numberPolyfill.prototype.decrement = function() {
        var newVal, params;
        if (!(this.elem.is(":disabled") || this.elem.is("[readonly]"))) {
          params = this.getParams();
          newVal = numberPolyfill.preciseSubtract(params['val'], params['step']);
          if ((params['min'] != null) && parseFloat(newVal) < parseFloat(params['min'])) {
            newVal = params['min'];
          }
          newVal = this.stepNormalize(newVal);
          this.elem.val(newVal).change();
        }
      };
    } else {
      $.fn.inputNumber = function() {
        return $(this);
      };
      return;
    }
    $(function() {
      $('input[type="number"]').inputNumber();
    });
  })(jQuery);

}).call(this);
