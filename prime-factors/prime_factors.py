def factors(value):
    prime_factors = []
    while value != 1:
        factor = pollard_rho(value)
        if factor is None:
            prime_factors.append(value)
            break
        while value % factor == 0:
            prime_factors.append(factor)
            value //= factor

    # reduce answer to simple form
    simple_pf = [2, 3, 5, 7]
    for i in prime_factors:
        for j in simple_pf:
            if i not in simple_pf and i % j == 0:
                prime_factors.remove(i)
                while i != 1:
                    prime_factors.append(j)
                    i //= j

    return sorted(prime_factors)


def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a


def pollard_rho(n):
    def f(x):
        return (x ** 2 + 1) % n

    x, y, d = 2, 2, 1
    while d == 1:
        x = f(x)
        y = f(f(y))
        d = gcd(abs(x - y), n)
    if d == n:
        return None
    return d
