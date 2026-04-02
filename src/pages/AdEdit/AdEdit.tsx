import { useParams, Link } from 'react-router-dom';
import styles from './AdEdit.module.scss';

export function AdEdit() {
	const { id } = useParams()
	return (
		<>
			<h1>AdEdit {id}</h1>
			<Link to={`/ads/${id}`}>Перейти назад</Link>
		</>
	)
}

