# Given a target node and a selector, unsizzleReduce checks that the selector finds the target.
# This hasn't been tested.

if window.jQuery?

    unsizzleReduce = (target, selector) ->
        targetTop = target.offsetTop
        targetLeft = target.offsetLeft

        candidates = jQuery selector
        if candidates.length is 1
            return candidate.offsetTop is targetTop and candidate.offsetLeft is targetLeft

        else if candidates.length > 1
            position = 0

            for index, candidate of candidates
                if candidate.offsetTop is targetTop and candidate.offsetLeft is targetLeft
                    position = index
                    break

            console.log "Correct selector: ", selector + ":eq(#{position})"
            return false

        else
            return false
