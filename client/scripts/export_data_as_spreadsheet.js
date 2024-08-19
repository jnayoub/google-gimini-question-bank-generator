/*
Structure
- LOOP THROUGH QUESTIONS [
Question {NUMBER} \t Multiple Choice \t {QUESTION TEXT} \t {CORRECT FEEDBACK} \t {INCORRECT FEEDBACK}
-- LOOP THROUGH ANSWERS [
IF CORRECT ANSWER {X} \t \t {ANSWER TEXT
IF INCORRECT ANSWER \t \t {ANSWER TEXT}
]]
*/

function exportToXLSX() {
  const data = responseText.candidates[0].content.parts[0].text;
  const questions = JSON.parse(data);
  const worksheetData = [];
  worksheetData.push([
    "Question Number",
    "Multiple Choice",
    "Question Text",
    "Correct Feedback",
    "Incorrect Feedback",
  ]);

  for (let i = 0; i < questions.length; i++) {
    worksheetData.push([
      "Question " + (i + 1),
      "Multiple Choice",
      questions[i].question,
      questions[i].correctFeedback,
      questions[i].incorrectFeedback,
    ]);

    for (let x = 0; x < questions[i].answers.length; x++) {
      let mark = "";
      if (x === questions[i].correctAnswerIndex) {
        mark = "X";
      }
      worksheetData.push([
        mark, 
        "", 
        questions[i].answers[x]
    ]);
    }
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(wb, ws, "Questions");
  XLSX.writeFile(wb, "questions.xlsx");
}
