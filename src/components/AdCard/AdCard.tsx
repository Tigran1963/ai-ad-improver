import { Link } from 'react-router-dom';
import type { ListItem } from '@/types/api';
import './AdCard.scss';

export function AdCard({ ad }: { ad: ListItem }) {
	const CATEGORY_MAP: Record<string, string> = {
		auto: 'Авто',
		real_estate: 'Недвижимость',
		electronics: 'Электроника',
	};

	return (
		<div className="ad-card">
			<Link to={`/ads/${ad.id}`} className="ad-card__image">
				<img
					src={ad.imageUrl || 'https://placehold.co/200x150'}
					alt="placeholder image"
					onError={(e) => {
						e.currentTarget.src = 'https://picsum.photos/200/150';
					}} />
			</Link>
			<div className="ad-card__bottom">
				<span className="ad-card__category">{CATEGORY_MAP[ad.category] || ad.category}</span>
				<Link to={`/ads/${ad.id}`} className="ad-card__title">{ad.title}</Link>
				<span className="ad-card__price">{ad.price.toLocaleString('ru-RU')} ₽</span>

				{ad.needsRevision && (
					<span className="ad-card__badge">Требует доработок</span>
				)}
			</div>
		</div>
	);
}