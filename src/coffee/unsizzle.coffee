class @unsizzle

    constructor: (obj) ->
        if unsizzle::isEvent obj
            return unsizzle::event obj
        else if unsizzle::isNode obj
            return unsizzle::node obj
        else
            return

    event: (evt) ->
        @node evt.target

    node: (node) ->
        sel = []
        hasParent = true
        t = node

        # Walk up the dom tree and collect info until we get to an ID or the HTML tag
        while hasParent
            tag = t.tagName
            id = t.id
            classes = t.classList

            if id.length or not (t.parentElement? and t.parentNode isnt document and t.parentElement.tagName isnt 'HTML')
                sel.unshift @selector t
                hasParent = false
            else
                # NOTE: This is being overly specific. Consider doing this only when
                # nesting is a problem.
                sel.unshift "> " + @selector(t)
                t = t.parentElement

        return sel.join ' '

    selector: (node) ->
        selector = @join node.tagName, node.id, node.classList

        if node.parentNode isnt document and @hasSiblings node
            similar = position = 0

            debugger
            for n in node.parentNode.children
                currentSelector = @join n.tagName, n.id, n.classList
                similar  += 1 if currentSelector is selector
                break if n is node
                position += 1

            if similar > 1
                return selector + ":eq(#{position})"

        return selector

    join: (tag, id, classList, position) ->
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

    hasSiblings: (node) ->
        node.parentNode.children.length > 1

    isEvent: (obj) ->
        obj.currentTarget?

    isNode: (obj) ->
        if typeof Node is "object"
            obj instanceof Node
        else
            obj and
            typeof obj is "object" and
            typeof obj.nodeType is "number" and
            typeof obj.nodeName is "string"
