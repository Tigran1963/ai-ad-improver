import { useState } from 'react';
import { Pagination, Button, ConfigProvider, theme as antdTheme } from 'antd';
import { useAdsList } from '@/hooks/useItems';
import { useTheme } from '@/hooks/useTheme';
import { AdCard } from '@/components/AdCard/AdCard'
import './Ads.scss';

export function Ads() {
	const { theme: appTheme, toggleTheme } = useTheme();
	const [page, setPage] = useState(1);
	const limit = 10;

	const { data, isLoading, isError } = useAdsList({
		limit,
		skip: (page - 1) * limit
	});

	console.log(data)
	
	if (isError) return (
		<div className="ads">
			<div className="ads__container">
				<div>Произошла ошибка при загрузке</div>
			</div>
		</div>
	)
	return (
		<div className="ads">
			<div className="ads__container">
				<div className="ads__top">
					<h1 className="ads__title">Мои объявления</h1>
					{isLoading ? (
						<div className="sceleton">
							<div className="skeleton__counter skeleton-anim"></div>
						</div>
					) : (
						<div className="ads__counter">{data?.total} объявления</div>
					)}
					<ConfigProvider
						theme={{
							algorithm: appTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
						}}
					>
						<Button className="ads__theme-btn" onClick={toggleTheme}>
							Включить {appTheme === 'dark' ? 'светлую тему' : 'темную тему'}
						</Button>
					</ConfigProvider>
				</div>
				<div className="ads__body">
					<div className="ads__actions">
						{/* Component search and sorting */}
					</div>
					<div className="ads__filter">
						{/* Component Filter */}
					</div>
					<div className="ads__list list-ads">
						<div className="list-ads__items">
							{isLoading ? (
								Array.from({ length: limit }).map((_, i) => (
									<div key={i} className="skeleton">
										<div className="skeleton-anim skeleton__image"></div>
										<div className="skeleton-anim skeleton__title"></div>
										<div className="skeleton-anim skeleton__descr"></div>
										<div className="skeleton-anim skeleton__price"></div>
									</div>
								))
							) : (
								data?.items.map((ad) => <AdCard key={ad.id} ad={ad} />)
							)}
						</div>
						{!isLoading && data && data.total > 0 && (
							<div className="list-ads__pagination">
								<ConfigProvider
									theme={{
										algorithm: appTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
									}}
								>
									<Pagination
										current={page}
										total={data.total}
										pageSize={limit}
										onChange={(newPage) => setPage(newPage)}
										showSizeChanger={false}
									/>
								</ConfigProvider>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}


