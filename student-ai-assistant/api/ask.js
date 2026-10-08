export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: "GEMINI_API_KEY is missing in Vercel."
            });
        }

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey
                },

                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text:
                                        "You are a helpful Student AI Assistant. " +
                                        "Answer the student's question clearly and " +
                                        "in simple language. Give step-by-step explanations " +
                                        "when useful.\n\nStudent question: " +
                                        question
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        console.log("Gemini status:", response.status);
        console.log("Gemini response:", JSON.stringify(data));

        if (!response.ok) {
            return res.status(500).json({
                error:
                    data?.error?.message ||
                    "Gemini API request failed."
            });
        }

        const answer =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!answer) {
            return res.status(500).json({
                error: "Gemini returned no answer."
            });
        }

        return res.status(200).json({
            answer: answer
        });

    } catch (error) {

        console.error("Server error:", error);

        return res.status(500).json({
            error: error.message || "Server error."
        });
    }
}
