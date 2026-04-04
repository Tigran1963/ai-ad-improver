import { useState, useEffect, useCallback } from 'react';
import { Pagination, Button, ConfigProvider, theme as antdTheme } from 'antd';
import { useAdsList } from '@/hooks/useItems';
import { useTheme } from '@/hooks/useTheme';
import { useDebounce } from '@/hooks/useDebounce';
import { AdCard } from '@/components/AdCard/AdCard'
import { AdsActions } from '@/components/AdsActions/AdsActions';
import { AdsFilters } from '@/components/AdsFilters/AdsFilters';
import './Ads.scss';

export function Ads() {
	const { theme: appTheme, toggleTheme } = useTheme();
	const [page, setPage] = useState(1);
	const limit = 10;

	const [search, setSearch] = useState('');
	const debouncedSearch = useDebounce(search, 500);

	const [sort, setSort] = useState<string>('createdAt_desc');
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [needsRevision, setNeedsRevision] = useState(false);

	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

	useEffect(() => {
		setPage(1);
	}, [debouncedSearch, sort, selectedCategories, needsRevision]);

	const [sortColumn, sortDirection] = sort.split('_') as ['title' | 'createdAt', 'asc' | 'desc'];

	const { data, isLoading, isError } = useAdsList({
		limit,
		skip: (page - 1) * limit,
		q: debouncedSearch || undefined,
		categories: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
		sortColumn,
		sortDirection,
		needsRevision: needsRevision ? true : undefined,
	});

	const handleResetFilters = useCallback(() => {
		setSelectedCategories([]);
		setNeedsRevision(false);
		setSearch('');
	}, []);

	if (isError) return (
		<div className="ads">
			<div className="ads__container">
				<div>Произошла ошибка при загрузке</div>
			</div>
		</div>
	)
	return (
		<ConfigProvider
			theme={{
				algorithm: appTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
			}}
		>
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
						<Button className="ads__theme-btn" onClick={toggleTheme}>
							Включить {appTheme === 'dark' ? 'светлую тему' : 'темную тему'}
						</Button>
					</div>
					<div className="ads__body">
						<div className="ads__actions">
							{/* Component search and sorting */}
							<AdsActions
								search={search}
								onSearchChange={setSearch}
								sort={sort}
								onSortChange={setSort}
								viewMode={viewMode}
								onViewModeChange={setViewMode}
							/>
						</div>
						<div className="ads__filter">
							{/* Component Filter */}
							<AdsFilters
								selectedCategories={selectedCategories}
								onCategoriesChange={setSelectedCategories}
								needsRevision={needsRevision}
								onNeedsRevisionChange={setNeedsRevision}
								onReset={handleResetFilters}
							/>
						</div>
						<div className="ads__list list-ads">
							<div className={`list-ads__items list-ads__items--${viewMode}`}>
								{isLoading ? (
									Array.from({ length: limit }).map((_, i) => (
										<div key={i} className="skeleton">
											<div className="skeleton-anim skeleton__image"></div>
											<div className="skeleton-anim skeleton__title"></div>
											<div className="skeleton-anim skeleton__descr"></div>
											<div className="skeleton-anim skeleton__price"></div>
										</div>
									))
								) : data?.items.length ? (
									data?.items.map((ad) => <AdCard key={ad.id} ad={ad} />)
								) : (
									<div className="ads__empty">Объявления не найдены</div>
								)}
							</div>
							{!isLoading && data && data.total > 0 && (
								<div className="list-ads__pagination">
									<Pagination
										current={page}
										total={data.total}
										pageSize={limit}
										onChange={(newPage) => setPage(newPage)}
										showSizeChanger={false}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</ConfigProvider>
	)
}

