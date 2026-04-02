export type Category = 'auto' | 'real_estate' | 'electronics';

export interface AutoItemParams {
	brand?: string;
	model?: string;
	yearOfManufacture?: number;
	transmission?: 'automatic' | 'manual';
	mileage?: number;
	enginePower?: number;
}

export interface RealEstateItemParams {
	type?: 'flat' | 'house' | 'room';
	address?: string;
	area?: number;
	floor?: number;
}

export interface ElectronicsItemParams {
	type?: 'phone' | 'laptop' | 'misc';
	brand?: string;
	model?: string;
	condition?: 'new' | 'used';
	color?: string;
}

export interface Item {
	imageUrl: string;
	id: number;
	title: string;
	description?: string;
	price: number;
	category: Category;
	createdAt: string;
	updatedAt: string;
	needsRevision: boolean;
	params: AutoItemParams | RealEstateItemParams | ElectronicsItemParams;
}

export interface ListItem {
	imageUrl: string;
	id: number;
	title: string;
	price: number;
	category: Category;
	needsRevision: boolean;
}

export interface ItemsResponse {
	items: Item[];
	total: number;
}

export interface GetItemsParams {
	q?: string;
	limit?: number;
	skip?: number;
	needsRevision?: boolean;
	categories?: string;
	sortColumn?: 'title' | 'createdAt';
	sortDirection?: 'asc' | 'desc';
}