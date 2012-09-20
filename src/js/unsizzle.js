(function() {

  this.unsizzle = (function() {

    function unsizzle(obj) {
      if (this.isEvent) {
        this.event(obj);
      } else if (this.isNode(obj)) {
        this.node(obj);
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
      t = target;
      while (hasParent) {
        tag = t.tagName;
        id = t.id;
        classes = t.classList;
        if (id.length || !((t.parentElement != null) && t.parentNode !== document)) {
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
      var n, position, sel, selector, similar, _i, _len, _ref;
      selector = this.join(node.tagName, node.id, node.classList);
      if (node.parentNode !== document && this.hasSiblings(node)) {
        position = null;
        similar = 0;
        _ref = node.parentNode.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          sel = this.join(n.tagName, n.id, n.classList);
          if (n === node) {
            position = similar;
          }
          if (sel === selector) {
            similar += 1;
          }
        }
        if ((position != null) && similar > 1) {
          return selector + (":eq(" + position + ")");
        }
      }
      return selector;
    };

    unsizzle.prototype.join = function(tag, id, classList, position) {
      var c, classStr, idStr, positionStr, _i, _len;
      idStr = "";
      classStr = "";
      positionStr = "";
      if (id.length) {
        idStr = "#" + id;
      }
      if (classList.length > 0) {
        for (_i = 0, _len = classList.length; _i < _len; _i++) {
          c = classList[_i];
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
      return obj.target != null;
    };

    unsizzle.prototype.isNode = function(obj) {
      if (typeof Node === "object") {
        return obj instanceof Node;
      } else {
        return obj && typeof obj === "object" && typeof o.nodeType === "number" && typeof o.nodeName === "string";
      }
    };

    return unsizzle;

  })();

}).call(this);
