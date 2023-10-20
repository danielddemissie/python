def is_paired(input_string):
    stack = []

    op = ["[", '{', '(']
    cls = ["]", '}', ")"]
    f_str = "".join([i for i in input_string if i in "{()[]}"])

    # check if the given string is valid
    if f_str == "":
        return True
    if f_str[0] in cls:
        return False

    for i in f_str:
        if len(stack) == 0:
            stack.append(i)
        elif i in cls:
            cls_i = cls.index(i)
            if stack[-1] == op[cls_i]:
                stack.pop()
            else:
                return False
        elif i in op:
            stack.append(i)

    return len(stack) == 0
