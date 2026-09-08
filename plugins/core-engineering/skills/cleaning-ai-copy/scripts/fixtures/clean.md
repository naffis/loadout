Checkout can run when the cart is empty. Later checks then fail
because they expect items, and the order gets stuck.

Stop those checkouts from getting stuck. Either drop the needs-items
rule when the cart was skipped, or refuse checkout until there are items.
