import { apiClient } from './apiClient';
import type { ItemsResponse, Item, GetItemsParams } from '@/types/api';

export const getItems = async (params: GetItemsParams, signal?: AbortSignal): Promise<ItemsResponse> => {
	const { data } = await apiClient.get<ItemsResponse>('/items', {
		params,
		signal
	});
	return data;
};

export const getItemById = async (id: number, signal?: AbortSignal): Promise<Item> => {
	const { data } = await apiClient.get<Item>(`/items/${id}`, { signal });
	return data;
};

export const updateItem = async (id: number, updateData: Partial<Item>): Promise<void> => {
	const { data } = await apiClient.put(`/items/${id}`, updateData);
	return data;
};