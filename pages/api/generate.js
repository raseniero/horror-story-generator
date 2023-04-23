import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function (req, res) {

  //apikey validation
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  //code input validation
  const codeInput = req.body.codeInput || '';
  if (codeInput.trim().length === 0 || codeInput !== '20230421') {
    res.status(400).json({
      error: {
        message: "Please enter a valid code input",
      }
    });
    return;
  }

  //system input validtion
  const systemInput = req.body.systemInput || '';
  if (systemInput.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid system input",
      }
    });
    return;
  }

  //user input validation
  const userInput = req.body.userInput || '';
  if (userInput.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid user input",
      }
    });
    return;
  }

  try {

    /* const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(systemInput),
      temperature: 0.6,
    }); */

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {role: "system", content: JSON.stringify(systemInput)},
        {role: "user", content: JSON.stringify(userInput)}
      ]     
    })

    res.status(200).json({ result: JSON.stringify(completion.data.choices[0].message['content'])});

  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();

  return `Suggest three names for an animal that is a superhero.

          Animal: Cat
          Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
          Animal: Dog
          Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
          Animal: ${capitalizedAnimal}
          Names:`;
}