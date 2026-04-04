import React from 'react';
import { Input, Select, Radio } from 'antd';
import GridIcon from "@/assets/icons/grid-layout.svg?react"
import ListIcon from "@/assets/icons/list-layout.svg?react"
import SearchIcon from "@/assets/icons/search.svg?react"
import { SORT_OPTIONS } from '@/utils/constants';
import './AdsActions.scss';

interface AdsActionsProps {
	search: string;
	onSearchChange: (val: string) => void;
	sort: string;
	onSortChange: (val: string) => void;
	viewMode: 'grid' | 'list';
	onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const AdsActions = React.memo(function AdsActions({ search, onSearchChange, sort, onSortChange, viewMode, onViewModeChange }: AdsActionsProps) {
	return (
		<div className="ads-actions">
			<Input
				placeholder="Найти объявление...."
				value={search}
				variant="filled"
				suffix={<SearchIcon />}
				onChange={(e) => onSearchChange(e.target.value)}
				className="ads-actions__search"
				allowClear
			/>

			<div className="ads-actions__controls">
				<Radio.Group value={viewMode} className='ads-actions__layout' onChange={(e) => onViewModeChange(e.target.value)}>
					<Radio.Button value="grid">
						<GridIcon />
					</Radio.Button>
					<Radio.Button value="list">
						<ListIcon />
					</Radio.Button>
				</Radio.Group>
				<Select
					value={sort}
					onChange={onSortChange}
					options={SORT_OPTIONS}
					className="ads-actions__sort"
					placeholder="Сортировка"
				/>
			</div>
		</div>
	);
})