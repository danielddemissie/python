def say(number):
    units = ["", "one", "two", "three", "four",
             "five", "six", "seven", "eight", "nine"]
    teens = ["", "eleven", "twelve", "thirteen", "fourteen",
             "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"]
    tens = ["", "ten", "twenty", "thirty", "forty",
            "fifty", "sixty", "seventy", "eighty", "ninety"]
    thousands = ["", "thousand", "million", "billion"]

    if number < 0 or number > 999999999999:
        raise ValueError('input out of range')

    def recursive_conversion(number, idx):
        if number == 0:
            return ""
        elif number < 10:
            return units[number] + " "
        elif number < 20:
            return teens[number - 10] + " "
        elif number < 100:
            ans: str = tens[number // 10] + "-" + \
                recursive_conversion(number % 10, idx)
            if ans[-1] == '-':
                ans = ans[:-1]
            return ans
        else:
            return units[number // 100] + " hundred " + recursive_conversion(number % 100, idx)

    if number == 0:
        return "zero"

    words = ""
    for i in range(len(thousands)):
        if number % 1000 != 0:
            words = recursive_conversion(
                number % 1000, i) + thousands[i] + " " + words
        number //= 1000
    return words.strip()
