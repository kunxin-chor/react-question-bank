Purpose: This project is a question bank for React questions. For each question, there will be a set of requirements and automated test case. A code editor allows the student to write their code and run it to see if it passes the test cases. There is also a live browser preview.

## QUESTIONS
1. Store questions in `md` file.
2. Questions has title, requirements, test cases,  solution and a step by step walkthrough
3. Requirements must not mention how the solution is implemented.
4. Questions are stored in folders
5. A folder is one category
6. A question's order is set by the leading number in front of them. Example 01-hello-world, 02-say-goodbye. Use hash of the question's title without the leading number as its id, for the purpose of saving. When new questions are added, or the order of questions changed, the user's saved solutions must still be able to be displayed for the relevant question.
7. Solutions are saved in local storage
8. Students can restore to the default code
9. Students can export out their solution as a JSON file
10. There might be multiple files per questions.
11. Each question is one React application.
12. The test cases are written in JavaScript and are run in the browser.
13. The test cases are run in a sandboxed environment.
14. Important: changing the order of the questions should not affect the user's saved solutions
15. Use a nodejs script to convert all the md files in a JSON files. Read the questions from that JSON files.

## INTERFACE
1. there is an interface to select the question
2. questions that has been attempted should be marked
3. the sidebar that show all the questions can be expanded or collapsed
4. categories can be expanded or collapsed
5. give maximum space to the code editor
6. Code editor should be feature rich
7. Code editor can switch between different files
8. The code editor is always visible
9. Use Monaco Editor
10. Use tabs to switch between the question text, the test case, solution, walkthrugh and a preview of the student's code. When previewing the code, they should be able to interact with the preview, and can see the results of console.log in their code
11. Student can run test cases to see if they pass
12. Student can press a button to copy their code + the question's text + the solution + an AI prompt to evaluate their code, and paste it into chatgpt, deepseek etc for marking
13. Student can switch between light and dark mode

