module.exports = {
  capitals: (str) => {
    return str.toUpperCase();
  },
  equal: (leftValue, rightValue, options) => {
    if(arguments.length < 3)
      throw new Error('Handlebars Helper equal needs 2 parameters');

    if(leftValue !== rightValue ) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  },
  notequal: (leftValue, rightValue, options) => {
    if(arguments.length < 3)
      throw new Error('Handlebars Helper equal needs 2 parameters');

    if(leftValue === rightValue ) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  },
  condition: (leftValue, operator, rightValue, options) => {
  switch (operator) {
    case '==':
      return (leftValue == rightValue) ? options.fn(this) : options.inverse(this);
    case '===':
      return (leftValue === rightValue) ? options.fn(this) : options.inverse(this);
    case '!=':
      return (leftValue != rightValue) ? options.fn(this) : options.inverse(this);
    case '!==':
      return (leftValue !== rightValue) ? options.fn(this) : options.inverse(this);
    case '<':
      return (leftValue < rightValue) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (leftValue <= rightValue) ? options.fn(this) : options.inverse(this);
    case '>':
      return (leftValue > rightValue) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (leftValue >= rightValue) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (leftValue && rightValue) ? options.fn(this) : options.inverse(this);
    case '||':
      return (leftValue || rightValue) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
  },
  invertOperand: (leftValue, operator, rightValue, options) => {
  switch (operator) {
    case '&&':
    return !leftValue && !rightValue ? options.fn(this) : options.inverse(this);
    default:
    return options.inverse(this);
  }
  },
  firstTrue: (leftValue, rightValue, options) => {
    return leftValue && !rightValue ? options.fn(this) : options.inverse(this);
  },
  switch: (value, options) => {
    this._switch_value_ = value;
    this._switch_break_ = false;

    const html = options.fn(this);

    delete this._switch_break_;
    delete this._switch_value_;

    return html;
  },
  case: (value, options) => {
    if (this._switch_break_ || value.indexOf(this._switch_value_) === -1) {
      return '';
    } else {
      if (options.hash.break === true) {
      this._switch_break_ = true;
      }

      return options.fn(this);
    }
  },
  default: (options) => {
    if (!this._switch_break_) {
      return options.fn(this);
    }
  }
}
