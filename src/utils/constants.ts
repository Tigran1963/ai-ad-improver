import type { Category } from '@/types/api';

export const CATEGORY_MAP: Record<string, string> = {
	auto: 'Авто',
	real_estate: 'Недвижимость',
	electronics: 'Электроника',
};

// cписок обязательных полей для каждой категории
export const CATEGORY_PARAMS: Record<Category, string[]> = {
	auto: ['brand', 'model', 'yearOfManufacture', 'transmission', 'mileage', 'enginePower'],
	real_estate: ['type', 'address', 'area', 'floor'],
	electronics: ['type', 'brand', 'model', 'condition', 'color']
};

// названия полей
export const PARAM_LABELS: Record<string, string> = {
	brand: 'Марка',
	model: 'Модель',
	yearOfManufacture: 'Год выпуска',
	transmission: 'Коробка передач',
	mileage: 'Пробег',
	enginePower: 'Мощность',
	type: 'Тип',
	address: 'Адрес',
	area: 'Площадь',
	floor: 'Этаж',
	condition: 'Состояние',
	color: 'Цвет'
};

// перевод значений для параметров
export const VALUE_LABELS: Record<string, string> = {
	// трансмиссия
	automatic: 'Автомат',
	manual: 'Механика',
	// тип недвижимости
	flat: 'Квартира',
	house: 'Дом',
	room: 'Комната',
	// тип электроники
	phone: 'Телефон',
	laptop: 'Ноутбук',
	misc: 'Разное',
	// состояние
	new: 'Новое',
	used: 'Б/у'
};

export const MONTHS = [
	'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
	'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

export const SORT_OPTIONS = [
	{ value: 'createdAt_desc', label: 'По новизне (сначала новые)' },
	{ value: 'createdAt_asc', label: 'По новизне (сначала старые)' },
	{ value: 'title_asc', label: 'По названию (А → Я)' },
	{ value: 'title_desc', label: 'По названию: (Я → А)' },
];
