/**
 * Returns the list of classes for the given node.
 * @param  {Node}     node     DOM node
 * @param  {Function} filterFn Filter function.
 * @return {Array}             List of classes
 */
export function getClassList(node, filterFn) {
  let classList = node.classList;

  if (filterFn) {
    classList = node.classList.filter(filterFn);
  }

  return classList;
}

/**
 * Compares attributes of two nodes for similarity.
 * @param  {Object}  aObj Target attributes
 * @param  {Object}  bObj Object to compare
 * @return {Boolean}      Similarity
 */
export function isSimilar(aObj, bObj) {
  return Object.keys(aObj).every((key) => {
    let a = aObj[key];
    let b = bObj[key];

    // Disqualify mismatched types.
    if (Object.prototype.toString.call(a) !== Object.prototype.toString(b)) {
      return false;
    }

    // Compare arrays, like classList, based on `a` being a subset of `b`.
    if (Array.isArray(a)) {
      if (a.length > b.length) {
        // Too big to be a subset.
        return false;
      } else {
        // Check that every item in `a` exists in `b`.
        return a.every(b.includes);
      }
    } else {
      // Exact comparison for non-arrays.
      return a === b;
    }
  });
}


/**
 * Concatenates the given node attributes into a selector.
 * @param  {String} tag       Name of node tag
 * @param  {String} id        Value of node ID attr
 * @param  {Array} classList  List of node classes
 * @param  {Number} position  Node index in a list
 * @return {String}           CSS selector
 */
export function join(tag, id, classList, position) {
  let idStr = '';
  let classStr = '';
  let positionStr = '';

  if (id.length) {
      idStr = `#${id}`;
  }

  if (classList.length > 0) {
    for (let c of classList) {
      classStr += `.${c}`;
    }
  }

  if (position != null) {
      positionStr = `:eq(${position})`;
  }

  return tag.toLowerCase() + idStr + classStr + positionStr;
}


export function isEvent(obj) {
  return obj.currentTarget != null;
}


export function isNode(obj) {
  if (typeof Node is 'object') {
    return obj instanceof Node;
  } else {
    return obj && \
      typeof obj === 'object' && \
      typeof obj.nodeType === 'number' && \
      typeof obj.nodeName === 'string';
  }
}


export function hasParent(node) {
  return (node.parentElement != null) && \
    node.parentNode !== doc && \
    node.parentElement.tagName !== 'HTML';
}


export function hasSiblings(node) {
  let parent = node.parentNode;
  return parent != null && parent.children.length > 1;
}
