unsizzle =

    # Build a CSS selector for the selected element
    buildSelector: (evt) ->

        target = @getTarget evt

        sel = []
        hasParent = true
        t = target

        # Walk up the dom tree and collect info until we get to an ID or the HTML tag
        while hasParent
            tag = t.tagName
            id = t.id
            classes = t.classList

            if id.length or not t.parentElement?
                sel.unshift @getUniqueSelector t
                hasParent = false
            else
                # NOTE: This is being overly specific. Consider doing this only when
                # nesting is a problem.
                sel.unshift "> " + @getUniqueSelector(t)
                t = t.parentElement

        return sel.join ' '

    getUniqueSelector: (node) ->
        selector = @joinSelector node.tagName, node.id, node.classList

        if @hasSiblings node
            position = null
            similar = []

            for n in node.parentNode.children
                sel = @joinSelector n.tagName, n.id, n.classList
                if sel is selector
                    similar.push n

            for n, i in similar
                position = i if n is node

                if position?
                    return selector + ":eq(#{position})"

        return selector

    hasSiblings: (node) ->
        node.parentNode.children.length > 1

    joinSelector: (tag, id, classList, position) ->
        idStr = ""
        classStr = ""
        positionStr = ""

        if id.length
            idStr = "#" + id

        if classList.length > 0
            classStr += "." + c for c in classList

        if position?
            positionStr = ":eq(#{position})"

        return tag.toLowerCase() + idStr + classStr + positionStr

    # Figure out what element the mouse has selected
    getTarget: (evt) ->
        return event.target
