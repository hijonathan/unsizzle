(function() {
  var unsizzleReduce;

  if (window.jQuery != null) {
    unsizzleReduce = function(target, selector) {
      var candidate, candidates, exactSelector, index, match, position, targetLeft, targetTop;
      targetTop = target.offsetTop;
      targetLeft = target.offsetLeft;
      candidates = $(selector);
      match = false;
      if (candidates.length === 1) {
        candidate = candidates.get(0);
        match = candidate.offsetTop === targetTop && candidate.offsetLeft === targetLeft;
        return {
          match: match,
          selector: selector
        };
      } else if (candidates.length > 1) {
        position = 0;
        for (index in candidates) {
          candidate = candidates[index];
          if (candidate.offsetTop === targetTop && candidate.offsetLeft === targetLeft) {
            position = index;
            break;
          }
        }
        exactSelector = "" + selector + ":eq(" + position + ")";
        return this.reduce(target, exactSelector);
      } else {
        return {
          match: match,
          selector: selector
        };
      }
    };
  }

}).call(this);
