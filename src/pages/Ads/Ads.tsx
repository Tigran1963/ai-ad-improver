import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdsList } from '../../hooks/useItems';
import styles from './Ads.module.scss';

export function Ads() {
	const [page, setPage] = useState(1);
	const limit = 10;

	const { data, isLoading, isError } = useAdsList({
		limit,
		skip: (page - 1) * limit
	});
	console.log(data)
	if (isLoading) return <div>Загрузка объявлений...</div>;
	if (isError) return <div>Произошла ошибка при загрузке</div>;

	return (
		<div>
			<h1>Мои объявления</h1>
			<div className={styles.grid}>
				{data?.items.map((ad) => (
					<div key={ad.id} className={styles.card}>
						<h3>{ad.title}</h3>
						<p>Цена: {ad.price} ₽</p>
						{ad.needsRevision && <span className="badge">Требует доработки</span>}
						<Link to={`/ads/${ad.id}`}>Посмотреть</Link>
					</div>
				))}
			</div>

			{/* Кнопки пагинации */}
			<button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Назад</button>
			<button onClick={() => setPage(p => p + 1)}>Вперед</button>
		</div>
	)
}