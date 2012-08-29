(function() {

  this.unsizzle = {
    buildSelector: function(evt) {
      var classes, hasParent, id, sel, t, tag, target;
      target = this.getTarget(evt);
      sel = [];
      hasParent = true;
      t = target;
      while (hasParent) {
        tag = t.tagName;
        id = t.id;
        classes = t.classList;
        if (id.length || !(t.parentElement != null)) {
          sel.unshift(this.getUniqueSelector(t));
          hasParent = false;
        } else {
          sel.unshift("> " + this.getUniqueSelector(t));
          t = t.parentElement;
        }
      }
      return sel.join(' ');
    },
    getUniqueSelector: function(node) {
      var n, position, sel, selector, similar, _i, _len, _ref;
      selector = this.joinSelector(node.tagName, node.id, node.classList);
      if (this.hasSiblings(node)) {
        position = null;
        similar = 0;
        _ref = node.parentNode.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          sel = this.joinSelector(n.tagName, n.id, n.classList);
          if (n === node) position = similar;
          if (sel === selector) similar += 1;
        }
        if ((position != null) && similar > 1) {
          return selector + (":eq(" + position + ")");
        }
      }
      return selector;
    },
    hasSiblings: function(node) {
      return node.parentNode.children.length > 1;
    },
    joinSelector: function(tag, id, classList, position) {
      var c, classStr, idStr, positionStr, _i, _len;
      idStr = "";
      classStr = "";
      positionStr = "";
      if (id.length) idStr = "#" + id;
      if (classList.length > 0) {
        for (_i = 0, _len = classList.length; _i < _len; _i++) {
          c = classList[_i];
          classStr += "." + c;
        }
      }
      if (position != null) positionStr = ":eq(" + position + ")";
      return tag.toLowerCase() + idStr + classStr + positionStr;
    },
    getTarget: function(evt) {
      return event.target;
    }
  };

}).call(this);
