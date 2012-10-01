# Given a target node and a selector, unsizzleReduce checks that the selector finds the target.
# If more than one target is returned, it tries with a more specific selector. This returns the
# selector used in the form of: {match: true/false, selector: '#coolId'}.
#
# This needs more extensive testing.

if window.jQuery?

    unsizzleReduce = (target, selector) ->
        targetTop = target.offsetTop
        targetLeft = target.offsetLeft
        
        candidates = $ selector
        match = false

        if candidates.length is 1
            candidate = candidates.get 0
            match = candidate.offsetTop is targetTop and candidate.offsetLeft is targetLeft
            return {match, selector}

        else if candidates.length > 1
            position = 0

            for index, candidate of candidates
                if candidate.offsetTop is targetTop and candidate.offsetLeft is targetLeft
                    position = index
                    break

            exactSelector = "#{selector}:eq(#{position})"
            return @reduce target, exactSelector

        else
            return {match, selector}
