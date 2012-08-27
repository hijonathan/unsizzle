if window.jQuery?

    unsizzleReduce = (target, selector) ->
        targetTop = target.offsetTop
        targetLeft = target.offsetLeft

        candidates = jQuery selector
        if candidates.length > 1
            position = 0

            for index, candidate of candidates
                if candidate.offsetTop is targetTop and candidate.offsetLeft is targetLeft
                    position = index
                    break

            return selector + ":eq(#{position})"
