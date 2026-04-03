import { apiClient } from './apiClient';
import type { ItemsResponse, Item, GetItemsParams } from '@/types/api';
import { CATEGORY_PARAMS } from '@/utils/constants';

const calculateNeedsRevision = (item: Partial<Item>): boolean => {
	const expectedParams = item.category ? CATEGORY_PARAMS[item.category] : [];
	
	const areParamsMissing = expectedParams.some(paramKey => {
		const value = (item.params as any)?.[paramKey];
		return value === undefined || value === null || value === '';
	});

	return areParamsMissing;
};

export const getItems = async (params: GetItemsParams, signal?: AbortSignal): Promise<ItemsResponse> => {
	const { data } = await apiClient.get<ItemsResponse>('/items', {
		params,
		signal
	});
	const mappedItems = data.items.map(item => ({
		...item,
		needsRevision: calculateNeedsRevision(item)
	}));

	return { ...data, items: mappedItems };
};

export const getItemById = async (id: number, signal?: AbortSignal): Promise<Item> => {
	const { data } = await apiClient.get<Item>(`/items/${id}`, { signal });
	return {
		...data,
		needsRevision: calculateNeedsRevision(data)
	};
};

export const updateItem = async (id: number, updateData: Partial<Item>): Promise<void> => {
	const { data } = await apiClient.put(`/items/${id}`, updateData);
	return data;
};