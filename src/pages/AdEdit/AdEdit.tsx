import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, ConfigProvider, theme as antdTheme, Form, Input, Select, InputNumber, notification, Spin } from 'antd';
import { useTheme } from '@/hooks/useTheme';
import { useAdDetails, useUpdateAd } from '@/hooks/useItems';
import { AiPriceAssist } from '@/components/AiAssist/AiPriceAssist';
import { AiDescriptionAssist } from '@/components/AiAssist/AiDescriptionAssist';
import { CATEGORY_MAP, PARAM_LABELS, VALUE_LABELS } from '@/utils/constants';
import './AdEdit.scss';

const categoryOptions = Object.entries(CATEGORY_MAP).map(([value, label]) => ({ value, label }));
const getSelectOptions = (keys: string[]) => keys.map(key => ({ value: key, label: VALUE_LABELS[key] || key }));

const transmissionOptions = getSelectOptions(['automatic', 'manual']);
const realEstateTypeOptions = getSelectOptions(['flat', 'house', 'room']);
const electronicsTypeOptions = getSelectOptions(['phone', 'laptop', 'misc']);
const conditionOptions = getSelectOptions(['new', 'used']);

export function AdEdit() {
	const { id } = useParams();
	const navigate = useNavigate();
	const adId = Number(id);
	const isInvalidId = isNaN(adId);

	const { theme: appTheme } = useTheme();
	const [form] = Form.useForm();

	const { data: ad, isLoading, isError } = useAdDetails(adId);
	const { mutateAsync: updateAd, isPending: isUpdating } = useUpdateAd();

	const [submittable, setSubmittable] = useState(false);

	const values = Form.useWatch([], form);
	const selectedCategory = Form.useWatch('category', form);
	const params = Form.useWatch('params', form) || {};

	const draftKey = `ad_draft_${adId}`;

	useEffect(() => {
		if (ad && !isLoading) {
			const draft = localStorage.getItem(draftKey);
			if (draft) {
				form.setFieldsValue(JSON.parse(draft));
			} else {
				form.setFieldsValue({
					...ad,
					params: ad.params || {}
				});
			}
		}
	}, [ad, isLoading, form, draftKey]);

	useEffect(() => {
		form.validateFields({ validateOnly: true })
			.then(() => setSubmittable(true))
			.catch(() => setSubmittable(false));
	}, [values, form]);

	const handleValuesChange = (_changedValues: any, allValues: any) => {
		if (_changedValues.category) {
			form.setFieldValue('params', {});
		}
		localStorage.setItem(draftKey, JSON.stringify(allValues));
	};

	const onFinish = async (formData: any) => {
		try {
			const cleanedData = { ...formData };

			if (cleanedData.description === '' || cleanedData.description === null) {
				delete cleanedData.description;
			}

			if (cleanedData.params) {
				const cleanedParams: Record<string, any> = {};

				for (const [key, value] of Object.entries(cleanedData.params)) {
					if (value !== undefined && value !== null && value !== '') {
						cleanedParams[key] = value;
					}
				}
				cleanedData.params = cleanedParams;
			}

			await updateAd({ id: adId, data: cleanedData });

			localStorage.removeItem(draftKey);
			notification.success({
				title: 'Изменения сохранены',
				placement: 'topRight',
			});
			navigate(`/ads/${adId}`);
		} catch (error) {
			notification.error({
				title: 'Ошибка сохранения',
				description: 'При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже.',
				placement: 'topRight',
			});
		}
	};

	const handleCancel = () => {
		localStorage.removeItem(draftKey);
		navigate(`/ads/${adId}`);
	};

	const getWarningStatus = (paramName: string) => {
		return !params[paramName] ? 'warning' : '';
	};

	const getAdContext = () => {
		const currentValues = form.getFieldsValue();
		let context = `Категория: ${CATEGORY_MAP[currentValues.category] || currentValues.category}\nНазвание: ${currentValues.title || 'Нет'}\n`;
		if (currentValues.params) {
			context += Object.entries(currentValues.params)
				.filter(([_, v]) => v)
				.map(([k, v]) => `${PARAM_LABELS[k] || k}: ${VALUE_LABELS[v as string] || v}`)
				.join('\n');
		}
		return context;
	};

	const handleApplyDesc = (newDesc: string) => {
		form.setFieldValue('description', newDesc);
		handleValuesChange({}, form.getFieldsValue());
	};

	if (isInvalidId) return (
		<div className="ad-edit">
			<div className="ad-edit__container">
				<div className='ad-edit__notfound'>Ошибка</div>
				<Link to={`/ads${id}`}>
					<Button>
						Вернуться к объявлению
					</Button>
				</Link>
			</div>
		</div>
	)
	return (
		<ConfigProvider
			theme={{
				algorithm: appTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
			}}
		>
			<div className="ad-edit">
				<div className="ad-edit__container">
					<h1 className="ad-edit__title">Редактирование объявления</h1>
					{isLoading ? (
						<div className="ad-edit__loading"><Spin size="large" /></div>
					) : (
						<Form
							form={form}
							layout="vertical"
							onFinish={onFinish}
							onValuesChange={handleValuesChange}
							className="ad-edit__form"
							validateTrigger={['onBlur', 'onChange']}
						>
							<div className="ad-edit__field">
								<h2 className="ad-edit__field-title">Категория</h2>
								<div className="ad-edit__field-input ad-edit__field-input--select-category">
									<Form.Item
										name="category"
										rules={[{ required: true }]}
									>
										<Select options={categoryOptions} placeholder="Выберите категорию" />
									</Form.Item>
								</div>
							</div>
							<div className="ad-edit__field">
								<h2 className="ad-edit__field-title"> <span>*</span> Название</h2>
								<div className="ad-edit__field-input">
									<Form.Item
										name="title"
										rules={[{ required: true, message: 'Название должно быть заполнено' }]}
									>
										<Input placeholder="Название объявления" allowClear />
									</Form.Item>
								</div>
							</div>
							<div className="ad-edit__field">
								<h2 className="ad-edit__field-title"><span>*</span> Цена</h2>
								<div className="ad-edit__field-wrapper">
									<div className="ad-edit__field-input">
										<Form.Item
											name="price"
											rules={[{ required: true, message: 'Цена должна быть заполнена' }]}
											className="ad-edit__price-input"
										>
											<InputNumber
												min={0}
												style={{ width: '100%' }}
												formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
												placeholder="0"
											/>
										</Form.Item>
									</div>
									<AiPriceAssist getContext={getAdContext} />
								</div>
							</div>
							<div className="ad-edit__field">
								<h2 className="ad-edit__field-title">Характеристики</h2>
								<div className="ad-edit__characteristics">
									{selectedCategory === 'auto' && (
										<>
											<Form.Item label={PARAM_LABELS.brand} name={['params', 'brand']} validateStatus={getWarningStatus('brand')}>
												<Input placeholder="Например: Toyota" allowClear />
											</Form.Item>
											<Form.Item label={PARAM_LABELS.model} name={['params', 'model']} validateStatus={getWarningStatus('model')}>
												<Input placeholder="Например: Camry" allowClear />
											</Form.Item>
											<Form.Item label={PARAM_LABELS.yearOfManufacture} name={['params', 'yearOfManufacture']} validateStatus={getWarningStatus('yearOfManufacture')}>
												<InputNumber min={1900} max={new Date().getFullYear()} style={{ width: '100%' }} placeholder="Год" />
											</Form.Item>
											<Form.Item label={PARAM_LABELS.transmission} name={['params', 'transmission']} validateStatus={getWarningStatus('transmission')}>
												<Select options={transmissionOptions} placeholder="Выберите КПП" allowClear />
											</Form.Item>
											<Form.Item label={PARAM_LABELS.mileage} name={['params', 'mileage']} validateStatus={getWarningStatus('mileage')}>
												<InputNumber min={0} style={{ width: '100%' }} placeholder="Пробег в км" />
											</Form.Item>
											<Form.Item label={PARAM_LABELS.enginePower} name={['params', 'enginePower']} validateStatus={getWarningStatus('enginePower')}>
												<InputNumber min={0} style={{ width: '100%' }} placeholder="Мощность, л.с." />
											</Form.Item>
										</>
									)}
									{selectedCategory === 'real_estate' && (
										<>
											<Form.Item label={PARAM_LABELS.type} name={['params', 'type']} validateStatus={getWarningStatus('type')}>
												<Select options={realEstateTypeOptions} placeholder="Тип объекта" allowClear />
											</Form.Item>
											<Form.Item label={PARAM_LABELS.address} name={['params', 'address']} validateStatus={getWarningStatus('address')}>
												<Input placeholder="Город, улица, дом" allowClear />
											</Form.Item>
											<Form.Item label={PARAM_LABELS.area} name={['params', 'area']} validateStatus={getWarningStatus('area')}>
												<InputNumber min={0} style={{ width: '100%' }} placeholder="Площадь, кв.м" />
											</Form.Item>
											<Form.Item label={PARAM_LABELS.floor} name={['params', 'floor']} validateStatus={getWarningStatus('floor')}>
												<InputNumber style={{ width: '100%' }} placeholder="Этаж" />
											</Form.Item>
										</>
									)}
									{selectedCategory === 'electronics' && (
										<>
											<Form.Item label={PARAM_LABELS.type} name={['params', 'type']} validateStatus={getWarningStatus('type')}>
												<Select options={electronicsTypeOptions} placeholder="Тип устройства" allowClear />
											</Form.Item>
											<Form.Item label={PARAM_LABELS.brand} name={['params', 'brand']} validateStatus={getWarningStatus('brand')}>
												<Input placeholder="Например: Apple" allowClear />
											</Form.Item>
											<Form.Item label={PARAM_LABELS.model} name={['params', 'model']} validateStatus={getWarningStatus('model')}>
												<Input placeholder="Например: iPhone 15" allowClear />
											</Form.Item>
											<Form.Item label={PARAM_LABELS.color} name={['params', 'color']} validateStatus={getWarningStatus('color')}>
												<Input placeholder="Цвет" allowClear />
											</Form.Item>
											<Form.Item label={PARAM_LABELS.condition} name={['params', 'condition']} validateStatus={getWarningStatus('condition')}>
												<Select options={conditionOptions} placeholder="Состояние" allowClear />
											</Form.Item>
										</>
									)}
								</div>
							</div>
							<div className="ad-edit__description">
								<h2 className="ad-edit__field-title">Описание</h2>
								<Form.Item name="description" className="ad-edit__description-item">
									<Input.TextArea
										rows={3}
										showCount
										maxLength={1000}
										placeholder="Опишите ваш товар подробно..."
										allowClear
									/>
								</Form.Item>
								<div className="ad-edit__description-button">
									<AiDescriptionAssist getContext={getAdContext} currentDescription={values?.description} onApply={handleApplyDesc} />
								</div>
							</div>
							<div className="ad-edit__buttons">
								<Button
									type="primary"
									htmlType="submit"
									disabled={!submittable}
									loading={isUpdating}
								>
									Сохранить
								</Button>
								<Button color="default" variant="filled" onClick={handleCancel}>
									Отменить
								</Button>
							</div>
						</Form>
					)}
				</div>
			</div>
		</ConfigProvider>
	)
}