
import os

file_path = r"c:\Users\AYUSH\OneDrive - Indian Oil Corporation Limited\Documents\GitHub\GuardianLink\client\my-app\src\TeacherSide\TeacherAttendance.js"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_content = content.replace("class: '", "branch: '")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done")
