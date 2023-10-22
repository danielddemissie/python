"""
This exercise stub and the test suite contain several enumerated constants.

Enumerated constants can be done with a NAME assigned to an arbitrary,
but unique value. An integer is traditionally used because it’s memory
efficient.
It is a common practice to export both constants and functions that work with
those constants (ex. the constants in the os, subprocess and re modules).

You can learn more here: https://en.wikipedia.org/wiki/Enumerated_type
"""

# Possible sublist categories.
# Change the values as you see fit.
SUBLIST = 1
SUPERLIST = 2
EQUAL = 3
UNEQUAL = 4


def sublist(list_one, list_two):
    str_l1 = "-".join([str(x) for x in list_one])
    str_l2 = "-".join([str(x) for x in list_two])

    if len(list_one) == len(list_two):
        if all([x == y for x, y in zip(list_one, list_two)]):
            return EQUAL
    elif len(list_one) > len(list_two):
        if str_l2 in str_l1:
            return SUPERLIST
    elif len(list_one) < len(list_two):
        if str_l1 in str_l2:
            return SUBLIST

    return UNEQUAL
