def resistor_label(colors: [str]) -> str:
    """A function that  returns  resistor color value for human eyes

    params:
        colors: list of d/t colors

    returns:
        value of resistor color
    """

    val_tol = {
        "black": ("0", None),
        "brown": ("1", "1"),
        "red": ("2", "2"),
        "orange": ("3", None),
        "yellow": ("4", None),
        "green": ("5", "0.5"),
        "blue": ("6", "0.25"),
        "violet": ("7", "0.1"),
        "grey": ("8", "0.05"),
        "white": ("9", None),
        "gold": (None, "5"),
        "silver": (None, "10")
    }
    if len(colors) == 1:
        val_str = val_tol[colors[0]][0]
        return getQuantifier(val_str)

    if len(colors) == 3:
        val1, val2, mul = colors
        val_str = val_tol[val1][0] + \
            val_tol[val2][0] + "0"*int(val_tol[mul][0])

        return getQuantifier(val_str)
    elif len(colors) == 4:
        val1, val2, mul, tol = colors
        val_str = val_tol[val1][0] + val_tol[val2][0]+"0"*int(val_tol[mul][0])

        return getQuantifier(val_str)+getTolerance(val_tol, tol)
    elif len(colors) == 5:
        val1, val2, val3, mul, tol = colors
        val_str = val_tol[val1][0] + val_tol[val2][0] + \
            val_tol[val3][0]+"0"*int(val_tol[mul][0])

        return getQuantifier(val_str)+getTolerance(val_tol, tol)


def getQuantifier(val_str: str) -> str:
    val = int(val_str)
    k = 1000
    m = k*k
    g = m*k
    if val >= g:
        if val % g == 0:
            return str(val//g)+" gigaohms"
        return str(val/g)+" gigaohms"
    elif val >= m:
        if val % m == 0:
            return str(val//m)+" megaohms"
        return str(val/m)+" megaohms"
    elif val >= k:
        if val % k == 0:
            return str(val//k)+" kiloohms"
        return str(val/k)+" kiloohms"
    else:
        return val_str+" ohms"


def getTolerance(val_tol, tol: int) -> str:
    return " ±"+val_tol[tol][1]+"%"
