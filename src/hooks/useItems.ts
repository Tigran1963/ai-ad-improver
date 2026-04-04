import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItems, getItemById, updateItem } from '@/api/items';
import type { GetItemsParams } from '@/types/api';

export const useAdsList = (params: GetItemsParams) => {
	return useQuery({
		queryKey: ['ads', params], // при изменении params запрос уйдет заново
		queryFn: ({ signal }) => getItems(params, signal), // signal для отмены запроса
	});
};

export const useAdDetails = (id: number) => {
	return useQuery({
		queryKey: ['ad', id],
		queryFn: ({ signal }) => getItemById(id, signal),
		enabled: !isNaN(id),// запрос пойдет только если id число
	});
};

export const useUpdateAd = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: any }) => updateItem(id, data),
		onSuccess: (_, variables) => {
			// сбрасываем кэш, чтобы при переходе на карточку данные обновились
			queryClient.invalidateQueries({ queryKey: ['ad', variables.id] });
			queryClient.invalidateQueries({ queryKey: ['ads'] });
		},
	});
};