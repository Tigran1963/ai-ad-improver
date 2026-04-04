import React from 'react';
import { Checkbox, Button, Collapse, Switch } from 'antd';
import { CATEGORY_MAP } from '@/utils/constants';
import './AdsFilters.scss';

interface AdsFiltersProps {
	selectedCategories: string[];
	onCategoriesChange: (categories: string[]) => void;
	needsRevision: boolean;
	onNeedsRevisionChange: (checked: boolean) => void;
	onReset: () => void;
}

const CATEGORY_OPTIONS = Object.entries(CATEGORY_MAP).map(([key, label]) => ({
	label,
	value: key,
}));

export const AdsFilters = React.memo(function AdsFilters({ selectedCategories, onCategoriesChange, needsRevision, onNeedsRevisionChange, onReset }: AdsFiltersProps) {
	return (
		<div className="ads-filters">
			<div className="ads-filters__top">
				<h3 className='ads-filters__title'>Фильтры</h3>
				<div className="ads-filters__block">
					<Collapse
						defaultActiveKey={['1']}
						ghost
						className="ads-filters__collapse"
						items={[
							{
								key: '1',
								label: 'Категории',
								children: (
									<Checkbox.Group
										options={CATEGORY_OPTIONS}
										value={selectedCategories}
										onChange={(checkedValues) => onCategoriesChange(checkedValues as string[])}
										className="ads-filters__checkbox-group"
									/>
								),
							},
						]}
					/>
				</div>
				<div className="ads-filters__switch">
					<span>Только требующие доработок</span>
					<Switch checked={needsRevision} onChange={onNeedsRevisionChange} />
				</div>
			</div>
			<Button type="text" onClick={onReset} className="ads-filters__reset-btn">
				Сбросить фильтры
			</Button>
		</div>
	);
})