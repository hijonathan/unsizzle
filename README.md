unsizzle
========

Sizzle selector builder.

Given a target-based event, unsizzle will do it's best to build a sizzle selector string back to the given target. The plugin walks the DOM from the target through every parent until it finds an ID or exhausts the list of parents.

#### TODO

- If the target element is generic, check if the unsizzled selector returns multiple results (and handle accordingly).
- Explore doing a .sibling() check.
- Explore using attributes to strengthen selectors. This can potentially be slow.
- Build in performance checks and allow for different settings of specificity.
- Write tests!
