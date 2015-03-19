((root, factory) ->
    # AMD.
    if typeof define is 'function' and define.amd
        define -> factory(root)
    # Node/Commonjs.
    else if typeof exports isnt undefined
        factory(root)
    # Browser global.
    else
        root.unsizzle = factory(root)

    return

) @, (root, factory) ->

    doc = root.document

    # We'll apply weights to different types of selectors and check for dupes
    # when we reach appropriate levels of confidence.
    UNIQUNESS_THRESHOLD = 0.4
    MAX_UNIQUENESS = 1
    ID_WEIGHT = 0.8
    CLASS_WEIGHT = 0.2
    TAGNAME_WEIGHT = 0

    nodeUniqueness = (node) ->
        # Super verbose.
        idScore = if node.id then ID_WEIGHT else 0
        classScore = node.classList.length * CLASS_WEIGHT
        tagScore = if node.id then TAGNAME_WEIGHT else 0

        return idScore + classScore + tagScore


    class unsizzle

        constructor: (obj) ->
            if isEvent obj
                return unsizzle::event obj
            else if isNode obj
                return unsizzle::node obj
            else
                return

        event: (evt) ->
            @node evt.target

        node: (origNode) ->
            parts = []
            confidence = 0
            node = origNode
            selectors = {}

            # Walk up the dom tree and collect info until we get a reliable score or run out of nodes.
            while (node and confidence < MAX_UNIQUENESS)
                # Add this node's uniqueness to the overall score.
                confidence += nodeUniqueness node
                nodeSel = @selector node

                # Stop if we have run out of parents.
                if not hasParent(node)
                    node = null
                # If this could be a unique node, check the DOM.
                else if confidence >= UNIQUNESS_THRESHOLD
                    # Compare globally across the document. This is expensive, so we only
                    # want to do this when we're confident in the selector.
                    parts.unshift nodeSel
                    sel = parts.join ' '
                    matches = querySelectorAll sel

                    # Check that the nodes match.
                    if matches.length is 1 and matches[0] is origNode
                        confidence = MAX_UNIQUENESS
                    else
                        # Reset to below the threshold and retry.
                        confidence = MAX_UNIQUENESS - 1
                        node = node.parentElement
                else
                    # Compare against children and add specificity if it's not unique.
                    separator = if selectors[nodeSel] then '' else '> '

                    parts.unshift(separator + @selector(node))
                    node = node.parentElement

                # Record that we've seen this type of node before.
                selectors[nodeSel] = true

            return parts.join ' '

        selector: (node) ->
            selector = @join node.tagName, node.id, node.classList
            hasClasses = node.classList.length > 0
            classSel = node.className.split(' ').sort().join ' '

            if not node.id and node.parentNode isnt doc and hasSiblings(node)
                similar = 0
                nodeIndex = null
                _index = -1

                for n in node.parentNode.children
                    isSameNode = n is node
                    # Tags match.
                    if node.tagName is n.tagName
                        # There are no other identifiers or the classes are a subset.
                        if not hasClasses or (node.classList.length <= n.classList.length and n.className.split(' ').sort().join(' ').startsWith(classSel))
                            _index++
                            if isSameNode
                                nodeIndex = _index
                            else
                                similar++

                    # Break out early if we already found something similar and know
                    # where we are in the lineup.
                    break if similar > 0 and nodeIndex?

                if similar > 0
                    return selector + ":eq(#{nodeIndex})"

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

        # Helpers.
        @hasParent: hasParent
        @hasSiblings: hasSiblings
        @isEvent: isEvent
        @isNode: isNode
        @nodeUniqueness: nodeUniqueness
        @querySelectorAll: querySelectorAll

    hasParent = (node) ->
        node.parentElement? and node.parentNode isnt doc and node.parentElement.tagName isnt 'HTML'

    hasSiblings = (node) ->
        node.parentNode.children.length > 1

    isEvent = (obj) ->
        obj.currentTarget?

    isNode = (obj) ->
        if typeof Node is "object"
            obj instanceof Node
        else
            obj and
            typeof obj is "object" and
            typeof obj.nodeType is "number" and
            typeof obj.nodeName is "string"

    querySelectorAll = (sel) ->
        el = doc
        eqRegex = /:eq\([0-9]+\)/
        result = []

        # Shim to work with :eq jquery selector.
        if eqRegex.test sel
            groups = []
            for part in sel.split ' '
                match = /:eq\(([0-9]+)\)/.exec(part)
                if match and match[1]
                    # Get the position and query that element.
                    # NOTE: match[1] is a string. This should be fine for most browsers.
                    groups.push part.replace(eqRegex, '')
                    el = el.querySelectorAll(groups.join(' '))[match[1]]

                    # Reset the group since we've updated the base element.
                    groups = []
                else
                    groups.push part

            # Finish querying any leftovers.
            if groups.length
                result = el.querySelectorAll groups
            else
                # Always return an array.
                result = [el]
        else
            result = el.querySelectorAll sel

        return result

    # O hai there.
    return unsizzle
