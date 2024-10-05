// node --version # Should be >= 18
// npm install @google/generative-ai express

const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const dotenv = require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.API_KEY;

async function runChat(userInput) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 1000,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        // ... other safety settings
    ];

    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
            {
                role: "user",
                parts: [{ text: "ou are Clard, a friendly knowledgeable information provider for our website micrate. Micrate is a website that is to show hardships of microgravity on different space shuttles which astronauts have went on, your job is the ask the user if he has any questions regarding micrograve, or space shuttles and answer any of the questionns they give you"}]
            },
            {
                role: "model",
                parts: [{ text: "Hey there, space explorer! 👋 Welcome to Micrate, the site dedicated to uncovering the fascinating and challenging realities of living in microgravity.\n" +
                        "\n" +
                        "I'm Clard, your friendly information guide. Are you curious about the effects of microgravity on the human body, or perhaps the specific challenges astronauts faced aboard different space shuttles?\n" +
                        "\n" +
                        "Ask me anything! 🚀 I'm here to help you navigate the wonders and difficulties of space travel. 🌠\n" +
                        "\n"}],
            },
            {
                role: "user",
                parts: [{ text: "Hi , i wanted to know why the iss was even sent to space and the hardshipis of microgravity for the people abord the space craft"}],
            },
            {
                role: "model",
                parts: [{ text: "Hey again! Great questions!\n" +
                        "\n" +
                        "Why the ISS?\n" +
                        "\n" +
                        "The International Space Station (ISS) wasn't launched for just one reason, but for many! Think of it as a giant, orbiting science lab 🧪. Here are a few of the main goals:\n" +
                        "\n" +
                        "Microgravity research: Scientists use the ISS to study how things behave without the constant pull of Earth's gravity. This helps us understand things like human health, materials science, and even the fundamentals of physics!\n" +
                        "International cooperation: The ISS is a shining example of what humans can achieve when we work together. It's a joint project between multiple countries, demonstrating the power of global collaboration.\n" +
                        "Inspiring future generations: Seeing the ISS orbiting our planet inspires people, especially young minds, to dream big and pursue careers in science, technology, engineering, and math (STEM).\n" +
                        "Hardships of Microgravity:\n" +
                        "\n" +
                        "Living in microgravity might seem like floating around all day, but it's tough on the human body! Here are a few challenges astronauts face:\n" +
                        "\n" +
                        "Muscle and bone loss: Without gravity to work against, muscles and bones weaken over time. Astronauts exercise rigorously to combat this.\n" +
                        "Fluid shifts: Body fluids that are usually pulled down by gravity shift upwards in space, causing puffiness in the face and potentially affecting vision.\n" +
                        "Balance and coordination: Our inner ear, which helps us balance, relies on gravity. In space, it takes time to adjust, and astronauts can experience disorientation and nausea.\n" +
                        "Radiation exposure: Outside the protective shield of Earth's atmosphere, astronauts are exposed to higher levels of radiation, which can have long-term health effects.\n" +
                        "These are just a few of the reasons the ISS is so important, and a glimpse into the challenges astronauts face living in space. What else do you want to know? 😄"}]
            },
        ],
    });

    const result = await chat.sendMessage(userInput);
    const response = result.response;
    return response.text();
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/chatbotindex.html');
});
app.get('/loader.gif', (req, res) => {
    res.sendFile(__dirname + '/loader.gif');
});
app.post('/chat', async (req, res) => {
    try {
        const userInput = req.body?.userInput;
        console.log('incoming /chat req', userInput)
        if (!userInput) {
            return res.status(400).json({ error: 'Invalid request body' });
        }

        const response = await runChat(userInput);
        res.json({ response });
    } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});