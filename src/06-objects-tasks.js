/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */


class StyleSelectorBuilder {
  constructor() {
    this.result = '';
    this.hasElem = false;
    this.hasId = false;
    this.hasPseudoElem = false;
    this.priority = 6;
  }

  checkPriorityOrder(priority) {
    if (priority > this.priority) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    this.priority = priority;
  }

  element(value) {
    this.checkPriorityOrder(6);
    if (this.hasElem) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.result += value;
    this.hasElem = true;
    return this;
  }

  id(value) {
    this.checkPriorityOrder(5);
    if (this.hasId) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.result += `#${value}`;
    this.hasId = true;
    return this;
  }

  class(value) {
    this.checkPriorityOrder(4);
    this.result += `.${value}`;
    return this;
  }

  attr(value) {
    this.checkPriorityOrder(3);
    this.result += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    this.checkPriorityOrder(2);
    this.result += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    this.checkPriorityOrder(1);
    if (this.hasPseudoElem) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.result += `::${value}`;
    this.hasPseudoElem = true;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.result = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    return this.result;
  }
}

const cssSelectorBuilder = {
  result: '',

  element(value) {
    return new StyleSelectorBuilder().element(value);
  },

  id(value) {
    return new StyleSelectorBuilder().id(value);
  },

  class(value) {
    return new StyleSelectorBuilder().class(value);
  },

  attr(value) {
    return new StyleSelectorBuilder().attr(value);
  },

  pseudoClass(value) {
    return new StyleSelectorBuilder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new StyleSelectorBuilder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new StyleSelectorBuilder().combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
