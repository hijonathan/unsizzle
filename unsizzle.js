(function() {
  this.unsizzle = (function() {
    function unsizzle(obj) {
      if (unsizzle.prototype.isEvent(obj)) {
        return unsizzle.prototype.event(obj);
      } else if (unsizzle.prototype.isNode(obj)) {
        return unsizzle.prototype.node(obj);
      } else {
        return;
      }
    }

    unsizzle.prototype.event = function(evt) {
      return this.node(evt.target);
    };

    unsizzle.prototype.node = function(node) {
      var classes, hasParent, id, sel, t, tag;
      sel = [];
      hasParent = true;
      t = node;
      while (hasParent) {
        tag = t.tagName;
        id = t.id;
        classes = t.classList;
        if (id.length || !((t.parentElement != null) && t.parentNode !== document && t.parentElement.tagName !== 'HTML')) {
          sel.unshift(this.selector(t));
          hasParent = false;
        } else {
          sel.unshift("> " + this.selector(t));
          t = t.parentElement;
        }
      }
      return sel.join(' ');
    };

    unsizzle.prototype.selector = function(node) {
      var currentSelector, i, len, n, position, ref, selector, similar;
      selector = this.join(node.tagName, node.id, node.classList);
      if (node.parentNode !== document && this.hasSiblings(node)) {
        similar = position = 0;
        ref = node.parentNode.children;
        for (i = 0, len = ref.length; i < len; i++) {
          n = ref[i];
          currentSelector = this.join(n.tagName, n.id, n.classList);
          if (currentSelector === selector) {
            similar += 1;
          }
          if (n === node) {
            break;
          }
          position += 1;
        }
        if (similar > 1) {
          return selector + (":eq(" + position + ")");
        }
      }
      return selector;
    };

    unsizzle.prototype.join = function(tag, id, classList, position) {
      var c, classStr, i, idStr, len, positionStr;
      idStr = "";
      classStr = "";
      positionStr = "";
      if (id.length) {
        idStr = "#" + id;
      }
      if (classList.length > 0) {
        for (i = 0, len = classList.length; i < len; i++) {
          c = classList[i];
          classStr += "." + c;
        }
      }
      if (position != null) {
        positionStr = ":eq(" + position + ")";
      }
      return tag.toLowerCase() + idStr + classStr + positionStr;
    };

    unsizzle.prototype.hasSiblings = function(node) {
      return node.parentNode.children.length > 1;
    };

    unsizzle.prototype.isEvent = function(obj) {
      return obj.currentTarget != null;
    };

    unsizzle.prototype.isNode = function(obj) {
      if (typeof Node === "object") {
        return obj instanceof Node;
      } else {
        return obj && typeof obj === "object" && typeof obj.nodeType === "number" && typeof obj.nodeName === "string";
      }
    };

    return unsizzle;

  })();

}).call(this);
