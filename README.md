unsizzle
========

Sizzle selector builder.

Given a target-based event, unsizzle will do it's best to build a sizzle selector string back to the given target. The plugin walks the DOM from the target through every parent until it finds an ID or exhausts the list of parents.

#### How to use it

Using unsizzle to remember what was clicked

    clickHistory = []

    $('#element').on 'click' (evt) ->
        clickHistory.push unsizzle evt

    showHistory = ->
        for selector in clickHistory
            $(selector).effect 'highlight'

Using unsizzle on nodes

    x = document.getElementById 'element'
    selector = unsizzle x

### API

#### Core

    unsizzle(objOrNode)

Returns a selector from either a node or object


    unsizzle.node(node)

Returns a selector from a node.


    unsizzle.event(eventObj)

Returns a selector from an event object.

    unsizzle.selector(node)

Returns a unique selector for an individual node by looking at the node's siblings.


    unsizzle.join(tag, id, classList, position)

Concatenates the given arguments into a usable selector.


#### Utilities

    unsizzle.hasSiblings(node)
    unsizzle.isEvent(obj)
    unsizzle.isNode(obj)


#### Contributing

Build with grunt!

Write some tests!
