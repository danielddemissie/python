def factors(value, start=2):
    if value == 1:
        return []
    for j in range(start, value + 1):
        if value % j == 0:
            return [j] + factors(int(value / j), j)
