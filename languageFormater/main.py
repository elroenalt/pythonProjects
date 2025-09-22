import tkinter as tk
import json

file_path = "oldNorse.json"

Language = []

def addEntry():
    new = newENT.get()
    old = oldENT.get()
    print(new, old)
    addWord(new, old)
    sort()
    newENT.delete(0, tk.END)
    oldENT.delete(0, tk.END)

def addWord(new, old):
    word = {new: old}
    Language.append(word)

def sort():
    global Language
    Language = sorted(Language, key=lambda d: list(d.keys())[0])

def save():
    with open(file_path, 'w') as json_file:
        json.dump(Language, json_file, indent=4)
    print("File saved successfully!")

try:
    with open(file_path, 'r') as json_file:
        Language = json.load(json_file)
        sort()
except FileNotFoundError:
    Language = []

root = tk.Tk()
root.title("Old Norse Dictionary")
root.geometry("400x300")
root.resizable(False, False)

main_frame = tk.Frame(root, padx=20, pady=20)
main_frame.pack(expand=True, fill="both")

Title = tk.Label(main_frame, text="Add a New Word", font=("Helvetica", 16, "bold"))
Title.pack(pady=10)

input_frame = tk.Frame(main_frame)
input_frame.pack(pady=10)

new_label = tk.Label(input_frame, text="New Word:", font=("Helvetica", 12))
new_label.grid(row=0, column=0, sticky="e", padx=5, pady=5)
newENT = tk.Entry(input_frame, width=25, font=("Helvetica", 12))
newENT.grid(row=0, column=1, padx=5, pady=5)

old_label = tk.Label(input_frame, text="Old Norse:", font=("Helvetica", 12))
old_label.grid(row=1, column=0, sticky="e", padx=5, pady=5)
oldENT = tk.Entry(input_frame, width=25, font=("Helvetica", 12))
oldENT.grid(row=1, column=1, padx=5, pady=5)

button_frame = tk.Frame(main_frame)
button_frame.pack(pady=10)

addBUT = tk.Button(button_frame, text="Add Word", font=("Helvetica", 14), command=addEntry)
addBUT.pack(side="left", padx=10)

saveBUT = tk.Button(button_frame, text="Save to File", font=("Helvetica", 14), command=save)
saveBUT.pack(side="left", padx=10)

fileNameENT = tk.Entry(button_frame, width=25, font=("Helvetica", 12))
fileNameENT.pack(side="left", padx=10)
fileNameENT.insert(0, file_path)

root.mainloop()
