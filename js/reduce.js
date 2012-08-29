(function() {
  var unsizzleReduce;

  if (window.jQuery != null) {
    unsizzleReduce = function(target, selector) {
      var candidate, candidates, index, position, targetLeft, targetTop;
      targetTop = target.offsetTop;
      targetLeft = target.offsetLeft;
      candidates = jQuery(selector);
      if (candidates.length > 1) {
        position = 0;
        for (index in candidates) {
          candidate = candidates[index];
          if (candidate.offsetTop === targetTop && candidate.offsetLeft === targetLeft) {
            position = index;
            break;
          }
        }
        return selector + (":eq(" + position + ")");
      }
    };
  }

}).call(this);
