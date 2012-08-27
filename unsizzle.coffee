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

            sel.unshift @joinSelector tag, id, classes

            if id.length or not t.parentElement?
                hasParent = false
            else
                t = t.parentElement

        return sel.join ' '

    joinSelector: (tag, id, classList) ->
        idStr = ""
        classStr = ""

        if id.length
            idStr = "#" + id

        if classList.length > 0
            classStr += "." + c for c in classList

        return tag.toLowerCase() + idStr + classStr

    # Figure out what element the mouse has selected
    getTarget: (evt) ->
        return event.target
