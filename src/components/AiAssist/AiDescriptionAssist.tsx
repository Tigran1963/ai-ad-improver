import { useState } from 'react';
import { Button, Popover, Spin, Space } from 'antd';
import { fetchAIGeneration } from '@/api/gigachat';
import BulbIcon from "@/assets/icons/bulb.svg?react"
import ReloadIcon from "@/assets/icons/redo.svg?react"
import './AiAssist.scss';

interface AiDescriptionAssistProps {
	getContext: () => string;
	currentDescription?: string;
	onApply: (desc: string) => void;
}

export function AiDescriptionAssist({ getContext, currentDescription, onApply }: AiDescriptionAssistProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<string | null>(null);
	const [error, setError] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [requestedOnce, setRequestedOnce] = useState(false);

	const handleRequest = async () => {
		setRequestedOnce(true);
		setIsLoading(true);
		setError(false);
		setIsOpen(true);

		try {
			const context = getContext();
			const systemPrompt = "Ты профессиональный копирайтер. Пиши продающие тексты для сайта объявлений. Используй Markdown для форматирования";
			const userPrompt = currentDescription
				? `Текущее описание:\n${currentDescription}\n\nУлучши его, сохранив структуру и добавив деталей из параметров:\n${context}`
				: `Придумай описание с нуля на основе параметров:\n${context}`;

			const res = await fetchAIGeneration(systemPrompt, userPrompt);
			setResult(res);
		} catch (e) {
			setError(true);
		} finally {
			setIsLoading(false);
		}
	};

	const handleApply = () => {
		if (result) onApply(result);
		setIsOpen(false);
	};

	const getButtonIcon = () => {
		if (isLoading) return <ReloadIcon />;
		if (requestedOnce) return <ReloadIcon />;
		return <BulbIcon />;
	};

	const popoverContent = (
		<div className="ai-assist__popover" style={{ maxWidth: 350 }}>
			{isLoading ? (
				<Spin description="Ответ AI..." size="small" />
			) : error ? (
				<>
					<p className="ai-assist__error">Произошла ошибка при запросе к AI<br />Попробуйте повторить запрос или закройте уведомление</p>
					<Button onClick={() => setIsOpen(false)} size="small">Закрыть</Button>
				</>
			) : (
				<>
					<div className="ai-assist__text"><strong>Ответ AI:</strong><br />{result}</div>
					<Space className="ai-assist__actions">
						<Button type="primary" size="small" onClick={handleApply}>Применить</Button>
						<Button size="small" onClick={() => setIsOpen(false)}>Закрыть</Button>
					</Space>
				</>
			)}
		</div>
	);

	return (
		<Popover className='ai-assist__popover-wrapper' content={popoverContent} trigger="click" open={isOpen} onOpenChange={setIsOpen}>
			<Button type='primary' className="ai-assist__btn" icon={getButtonIcon()} loading={isLoading} onClick={handleRequest}>
				{isLoading ? 'Выполняется запрос' : requestedOnce ? 'Повторить запрос' : (currentDescription ? 'Улучшить описание' : 'Придумать описание')}
			</Button>
		</Popover>
	);
}