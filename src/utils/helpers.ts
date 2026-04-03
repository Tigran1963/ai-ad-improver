import { MONTHS } from '@/utils/constants';

export const formatDate = (dateString?: string) => {
	if (!dateString) return '';
	const date = new Date(dateString);

	const day = date.getDate();
	const month = MONTHS[date.getMonth()];
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	return `${day} ${month} ${hours}:${minutes}`;
};
