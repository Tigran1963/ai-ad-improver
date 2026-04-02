import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, ConfigProvider, Alert, theme as antdTheme } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/free-mode';
// @ts-ignore
import 'swiper/css/thumbs';
import { useTheme } from '@/hooks/useTheme';
import { useAdDetails } from '@/hooks/useItems';
import EditIcon from "@/assets/icons/edit.svg?react"
import type { Item } from '@/types/api'
import './AdDetails.scss';

export function AdDetails() {
	const { id } = useParams();
	const { theme: appTheme } = useTheme();
	const { data: ad, isLoading, isError } = useAdDetails(Number(id));
	console.log(ad)

	const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

	const images = [
		'https://placehold.co/200x150',
		'https://placehold.co/200x150',
		'https://placehold.co/200x150',
		'https://placehold.co/200x150',
		'https://placehold.co/200x150',
		'https://placehold.co/200x150',
	].filter(Boolean);

	const getMissingFields = (item: Item) => {
		const missing = [];
		if (!item.description) missing.push('Описание');

		Object.entries(item.params).forEach(([key, value]) => {
			if (value === undefined || value === null || value === '') {
				missing.push(PARAM_LABELS[key] || key);
			}
		});
		return missing;
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		const months = [
			'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
			'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
		];

		const day = date.getDate();
		const month = months[date.getMonth()];
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');

		return `${day} ${month} ${hours}:${minutes}`;
	};

	if (isError) return (
		<div className="ad-details">
			<div className="ad-details__container">
				<div className='ad-details__notfound'>Объявление не найдено</div>
				<Link to={`/ads`} className="">
					<Button className="">
						Вернуться к списку
					</Button>
				</Link>
			</div>
		</div>
	)

	const missingFields = ad ? getMissingFields(ad) : [];

	return (
		<div>
			<div className="ad-details">
				<div className="ad-details__container">
					{isLoading ? (
						<div className="skeleton">
							<div className="skeleton-anim skeleton-details__title"></div>
							<div className="skeleton-details__content">
								<div className="skeleton-anim skeleton-details__image"></div>
								<div className="skeleton-details__info">
									<div className="skeleton-anim skeleton-details__line"></div>
									<div className="skeleton-anim skeleton-details__line"></div>
									<div className="skeleton-anim skeleton-details__line"></div>
								</div>
							</div>
						</div>
					) : (
						<>
							<div className="ad-details__top">
								<div className="ad-details__top-left">
									<h1 className="ad-details__title">{ad?.title}</h1>
									<div className="ad-details__top-buttons">
										<ConfigProvider
											theme={{
												algorithm: appTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
											}}
										>
											<Link to={`/ads/${id}/edit`} className="">
												<Button type="primary" className="" icon={<EditIcon />} iconPlacement="end">
													Редактировать
												</Button>
											</Link>
											<Link to={`/ads`} className="">
												<Button className="">
													Вернуться к списку
												</Button>
											</Link>
										</ConfigProvider>
									</div>
								</div>
								<div className="ad-details__top-right">
									<div className="ad-details__price">{ad?.price.toLocaleString('ru-RU')} ₽</div>
									<div className="ad-details__time">
										<span>Опубликовано {formatDate(ad?.createdAt)}</span>
										{Boolean(ad?.updatedAt) && (
											<span>Отредактировано {formatDate(ad.updatedAt)}</span>
										)}
									</div>
								</div>
							</div>
							<div className="ad-details__body">
								<div className="ad-details__body-left">
									<div className="ad-details__gallery">
										<Swiper
											spaceBetween={10}
											navigation={true}
											thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
											modules={[FreeMode, Thumbs]}
											className="ad-details__main-slider"
										>
											{images.map((img, index) => (
												<SwiperSlide key={index}>
													<img src={img} alt={`Slide ${index}`} />
												</SwiperSlide>
											))}
										</Swiper>

										{/* Thumbnails */}
										<Swiper
											onSwiper={setThumbsSwiper}
											spaceBetween={4}
											slidesPerView="auto"
											freeMode={true}
											watchSlidesProgress={true}
											modules={[FreeMode, Thumbs]}
											className="ad-details__thumbs-slider"
										>
											{images.map((img, index) => (
												<SwiperSlide key={index} className="ad-details__thumb-slide">
													<div className="ad-details__thumb-image">
														<img src={img} alt={`Thumb ${index}`} />
													</div>
												</SwiperSlide>
											))}
										</Swiper>
									</div>
								</div>
								<div className="ad-details__body-right">
									{ad?.needsRevision && missingFields.length > 0 && (
										<div className="ad-details__badge">
											<Alert
												className="ad-details__badge-title"
												title="Требуются доработки"
												description={
													<div className='ad-details__badge-description'>
														У объявления не заполнены поля:
														<ul className='ad-details__badge-list'>
															{missingFields.map((field, index) => (
																<li key={index} className="ad-details__badge-list-item">
																	{field}
																</li>
															))}
														</ul>
													</div>
												}
												type="warning"
												showIcon
											/>
										</div>
									)}
									<div className="ad-details__characteristics">
										<h2 className="ad-details__characteristics-title">Характеристики</h2>
										<div className="ad-details__characteristics-list">

										</div>
									</div>
								</div>
							</div>
							<div className="ad-details__description">
								<div className="ad-details__description-title">Описание</div>
								<div className="ad-details__description-text">
									{ad?.description || <span>Отсутствует</span>}
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}