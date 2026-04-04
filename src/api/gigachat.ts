import axios from 'axios';

const generateUUID = () => {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

export const getGigaChatToken = async () => {
	const credentials = import.meta.env.VITE_GIGACHAT_CREDENTIALS;
	if (!credentials) {
		throw new Error("Не указаны VITE_GIGACHAT_CREDENTIALS в .env");
	}

	const params = new URLSearchParams();
	params.append('scope', 'GIGACHAT_API_PERS');

	const { data } = await axios.post('/gigachat-auth/api/v2/oauth', params, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json',
			'RqUID': generateUUID(),
			'Authorization': `Basic ${credentials}`
		}
	});

	return data.access_token;
};

export const fetchAIGeneration = async (systemPrompt: string, userMessage: string) => {
	const token = await getGigaChatToken();

	const { data } = await axios.post('/gigachat-api/api/v1/chat/completions', {
		model: "GigaChat",
		messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: userMessage }
		],
		temperature: 0.7,
		max_tokens: 200,
	}, {
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer ${token}`
		}
	});

	return data.choices[0].message.content;
};