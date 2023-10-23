import string


def rows(letter: str) -> [str]:
    '''A function that create diamond from given alphabet

    params:
        letter: str
    returns:
        A diamond from the given letter
    '''
    alp_lst = string.ascii_uppercase[:string.ascii_uppercase.index(
        letter.upper())+1]
    total_space = len(alp_lst)*2 - 3 if len(alp_lst) > 1 else 0
    resp = []

    for idx, val in enumerate(alp_lst):
        if val == "A":
            space_around = len(alp_lst)-1
            s = " "*space_around+val+" "*space_around
            resp.append(s)
        else:
            space_around = (len(alp_lst) - 1)-idx
            space_bn = total_space - space_around*2
            s = " "*space_around+val+" "*space_bn+val+" "*space_around
            resp.append(s)

    for idx, val in enumerate(reversed(alp_lst[:-1])):
        if val == "A":
            space_around = len(alp_lst)-1
            s = " "*space_around+val+" "*space_around
            resp.append(s)
        else:
            space_around = idx+1
            space_bn = total_space - space_around*2
            s = " "*space_around+val+" "*space_bn+val+" "*space_around
            resp.append(s)

    return resp


# A very clever solution from community by pranasas
"""
    from typing import List
    def rows(letter:str)->List[str]:
        letters = [chr(k) for k in range(ord('A'), ord(letter) + 1)]
        alphabet = letters[:-1] + letters[::-1]
        diamond_line = letters[::-1] + letters[1:]

        return [''.join(x if x == y else ' ' for y in diamond_line) for x in alphabet]
    
    #basically what he did is he form lader/DNA (a<->a match a<->b not match) type of matching and
    #if match is found place the letter other wise place " "
"""
