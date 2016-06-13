import * as utils from 'utils';


export class Unsizzle {
  constructor(opts) {
    const defaults = {
      MIN_SCORE: 10,
      MAX_RESULTS: 1,
      ID_WEIGHT: 8,
      CLASS_WEIGHT: 2,
      // TODO: Give more weight to custom tags.
      TAGNAME_WEIGHTS: {
        P: 1,
        FORM: 1,
        STRONG: 1,
        INPUT: 2,
        BUTTON: 2
      }
    };

    this.options = Object.assign({}, defaults, opts);

    // Return a shorthand function.
    function unsizzle(obj) {
      if (utils.isEvent(obj)) {
        return this.event(obj);
      } else if (utils.isNode(obj)) {
        return this.node(obj);
      } else {
        return;
      }
    }

    return unsizzle.bind(this);
  }

  /**
   * Create a path to the event target.
   * @param  {Event} evt DOM event
   * @return {Array}     Path descriptors
   */
  event(evt) {
    return this.node(evt.target);
  }

  /**
   * Create a path to the given node.
   * @param  {Node} originNode DOM node
   * @return {Array}           Path descriptors
   */
  node(originNode) {
    // Create multiple selectors using different strategies.
    const MIN_SCORE = this.options.MIN_SCORE;
    const results = strategies.map((strategy) => {
      return Object.assign({
        features: [],
        score: 0,
        isValid: false
      }, strategy);
    ];
    let node = originNode;

    function scoringComplete(allRes) {
      return allRes.every((res) => res.score > MIN_SCORE);
    }

    // Compute each result until all scores are satisfied, or we run out of nodes.
    while (node && utils.hasParent(node) && !scoringComplete(results)) {
      let attrs = this.getAttributes(node);

      // Build each result.
      results.forEach((result) => {
        // Attempt to process as long as the score is below the threshold.
        if (result.score < MIN_SCORE) {
          let feature = result.parser(result.features, attrs);
          // If we added a feature, score it and append it to the current score.
          if (feature) {
            result.score += this.getScore(feature);
          }
        }

        // If we've met the threshold, ensure the selector is unique.
        if (result.score >= MIN_SCORE && !result.isValid) {
          const matches = this.querySelectorAll(result.toSelector());
          if (matches != null && matches.length <= this.options.MAX_RESULTS) {
            // Don't check again.
            result.isValid = true;
          } else {
            // If not valid, retry in the next loop.
            result.score = MIN_SCORE - 1;
          }
        }
      });

      // Continue up the tree.
      node = node.parentElement;
    }

    // Compile the CSS selectors for each result.
    results.forEach((result) => {
      result.selector = result.toSelector());
    });

    return results;
  }

  /**
   * Get select attributes for a given node.
   * @param  {Node} node DOM node.
   * @return {Object}    Node attributes.
   */
  getAttributes(node) {
    let attrs = {};
    ['href', 'title', 'alt'].forEach((name) => {
      attrs[name] = node.getAttribute(name);
    });

    // Special.
    attrs.class = utils.getClassList(node, this.options.filter);
    attrs.id = node.id;
    attrs.tagName = node.tagName;

    // Add the index of the element relative to its siblings.
    let pos = this.getPosition(node);
    attrs.absolutePos = pos.absolute;
    attrs.relativePos = pos.relative;

    return attrs;
  }

  /**
   * Computes node position relative to siblings.
   * @param  {Node} node DOM node
   * @return {Object}    Position properties
   */
  getPosition(node) {
    let nodeAttrs = this.getAttributes(node);
    let similar = 0;
    let nodeIndex = null;
    let index = 0;

    // Loop through each sibling.
    for (let sibling of node.parentNode.children) {
      let isSameNode = sibling === node;
      let siblingAttrs = this.getAttributes(sibling);

      if (isSameNode) {
        nodeIndex = index;
        break;
      } else if (utils.isSimilar(nodeAttrs, siblingAttrs)) {
        similar++;
      }

      index++;
    }

    // TODO: Give these values better names.
    return {
      absolute: nodeIndex,
      relative: nodeIndex - (nodeIndex - similar)
    };
  }

  /**
   * Score the given node attributes for uniqueness.
   * @param  {Object} attrs Node attributes
   * @return {Number}       Representation of uniqueness
   */
  getScore(attrs) {
    let idScore = attrs.id : this.options.ID_WEIGHT ? 0;
    let classScore = attrs.class.length * this.options.CLASS_WEIGHT;
    let tagScore = 0;
    if (attrs.tagName != null) {
      tagScore = this.options.TAGNAME_WEIGHTS[attrs.tagName] || 0;
    }

    return idScore + classScore + tagScore;
  }

  // Allow this to be overridden.
  querySelectorAll(sel) {
    return document.querySelectorAll(sel);
  }
}
