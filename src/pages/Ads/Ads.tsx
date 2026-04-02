import { Link } from 'react-router-dom';
import styles from './Ads.module.scss';

export function Ads() {
	return (
		<>
		<h1>Ads</h1>
		<Link to={'/ads/12'}>Перейти на Ad 12</Link>
		</>
	)
}