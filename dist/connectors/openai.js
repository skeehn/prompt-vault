import OpenAI from 'openai';
export async function callOpenAI(model, prompt) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('Missing OPENAI_API_KEY environment variable.');
    }
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
    });
    return completion.choices[0]?.message?.content ?? '';
}
