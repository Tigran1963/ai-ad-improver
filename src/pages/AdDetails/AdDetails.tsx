import { useParams, Link } from 'react-router-dom';
import styles from './AdDetails.module.scss';

export function AdDetails() {
	const { id } = useParams()

	return (
		<>
			<h1>AdDetails {id}</h1>
			<Link to={`/ads/${id}/edit`}>Редактировать</Link>
			<Link to={`/ads/`}>Перейти назад</Link>
		</>
	)
}