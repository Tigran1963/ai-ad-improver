import { useState } from 'react';
import { Button, Popover, Spin, Space } from 'antd';
import { fetchAIGeneration } from '@/api/gigachat';
import BulbIcon from "@/assets/icons/bulb.svg?react"
import ReloadIcon from "@/assets/icons/redo.svg?react"
import './AiAssist.scss';

interface AiPriceAssistProps {
	getContext: () => string;
}
export function AiPriceAssist({ getContext }: AiPriceAssistProps) {
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
			const res = await fetchAIGeneration(
				"Ты эксперт-оценщик на доске объявлений. Твоя задача назвать примерную рыночную стоимость товара в рублях.",
				`Оцени стоимость товара на основе этих данных:\n${context}\nВыведи краткий ответ: диапазон цен и небольшое обоснование.`
			);
			setResult(res);
		} catch (e) {
			setError(true);
		} finally {
			setIsLoading(false);
		}
	};

	const getButtonIcon = () => {
		if (isLoading) return <ReloadIcon />;
		if (requestedOnce) return <ReloadIcon />;
		return <BulbIcon />;
	};

	const popoverContent = (
		<div className="ai-assist__popover">
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
						<Button onClick={() => setIsOpen(false)} size="small">Закрыть</Button>
					</Space>
				</>
			)}
		</div>
	);

	return (
		<Popover className='ai-assist__popover-wrapper' content={popoverContent} trigger="click" open={isOpen} onOpenChange={setIsOpen}>
			<Button type='primary' className="ai-assist__btn" icon={getButtonIcon()} loading={isLoading} onClick={handleRequest}>
				{isLoading ? 'Выполняется запрос' : requestedOnce ? 'Повторить запрос' : 'Узнать рыночную цену'}
			</Button>
		</Popover>
	);
}