text = ""

letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

index = 0

items = []

while text != "[STOP]":
    text = input(f"{letters[index]} >> ")
    index+=1
    items.append(text)

items.pop()

arrayString = "{ 'A' : '" + items[0] + "'"


for i in range(1, len(items)):
    arrayString = f"{arrayString}, '{letters[i]}' : '{items[i]}'"

arrayString = arrayString + "}"

print(arrayString)