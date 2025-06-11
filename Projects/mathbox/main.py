import re
from decimal import Decimal, getcontext

getcontext().prec = 25  # Increase precision for more accurate square root

def solve(quadratic):
    quadratic = quadratic.replace(' ', '')
    terms = re.findall(r'[+-]?[^+-]+', quadratic)

    orderedCoefficients = [Decimal(0), Decimal(0), Decimal(0)]  # [a, b, c]

    for item in terms:
        if "x^2" in item:
            match = re.match(r'([+-]?\d*\.?\d*)x\^2', item)
            coeff_str = match.group(1)
            if coeff_str in ('', '+'):
                orderedCoefficients[0] = Decimal(1)
            elif coeff_str == '-':
                orderedCoefficients[0] = Decimal(-1)
            else:
                orderedCoefficients[0] = Decimal(coeff_str)
        elif "x" in item:
            match = re.match(r'([+-]?\d*\.?\d*)x', item)
            coeff_str = match.group(1)
            if coeff_str in ('', '+'):
                orderedCoefficients[1] = Decimal(1)
            elif coeff_str == '-':
                orderedCoefficients[1] = Decimal(-1)
            else:
                orderedCoefficients[1] = Decimal(coeff_str)
        else:
            orderedCoefficients[2] = Decimal(item)

    a, b, c = orderedCoefficients
    discriminant = b * b - 4 * a * c

    if discriminant < 0:
        raise ValueError("No real roots")  # or return complex numbers if desired

    sqrt_discriminant = discriminant.sqrt()

    x1 = (-b + sqrt_discriminant) / (2 * a)
    x2 = (-b - sqrt_discriminant) / (2 * a)

    return [x1, x2]

def factorise(quadratic):
    solved = solve(quadratic)
    solved[0] = solved[0]*-1
    solved[1] = solved[1]*-1

    for i in range(0, len(solved)):
        if solved[i] < 0:
            solved[i] = f"x{solved[i]}"
        else:
            solved[i] = f"x+{solved[i]}"
    return solved

# Example
equation = input("Equation> ")
print(factorise(equation))
input("[enter]")