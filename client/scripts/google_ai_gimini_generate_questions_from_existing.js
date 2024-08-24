let responseText;

function queryGiminiAPI() {
  if (document.querySelectorAll("#exportButton")[0]) {
    document.querySelectorAll("#exportButton")[0].remove();
  }
  document.querySelectorAll("#responseStatus")[0].textContent = "Loading...";
  const inputNumberOfQuestions = parseInt(
    document.querySelectorAll("#numberOfQuestions")[0].value
  );
  const numberOfQuestions = inputNumberOfQuestions || 5;
  const prompt = document.getElementById("promptInput").value;
  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }
  fetch("/gemini-prompt-existing-questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      numberOfQuestions: numberOfQuestions,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      responseText = data.response;
      const numberOfQuestionsReturned = JSON.parse(
        responseText.candidates[0].content.parts[0].text
      ).length;
      document.querySelectorAll(
        "#responseStatus"
      )[0].textContent = `Completed with - ${numberOfQuestionsReturned} questions returned`;
      var exportButton = document.createElement("button");
      exportButton.textContent = "Export Questions";
      exportButton.onclick = exportToXLSX;
      exportButton.id = "exportButton";
      document.getElementById("responseContainer").appendChild(exportButton);
    })
    .catch((error) => {
      console.error("There was a problem with your fetch operation:", error);
      document.querySelectorAll(
        "#responseStatus"
      )[0].textContent = `Failed with - ${error}`;
    });
}
