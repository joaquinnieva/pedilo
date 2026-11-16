import { Select as RSelect } from '@radix-ui/themes';

interface SelectProps {
	items: Array<Record<string, any>>;
	value?: string;
	valueKey?: string;
	labelKey?: string;
	placeholder?: string;
	onChange: (value: string) => void;
}

function Select({
	items,
	value = '',
	valueKey = 'value',
	labelKey = 'label',
	placeholder = 'Seleccione...',
	onChange,
}: SelectProps) {
	return (
		<RSelect.Root value={value || undefined} onValueChange={onChange}>
			<RSelect.Trigger placeholder={placeholder} radius="large" className="w-full" />
			<RSelect.Content position="popper">
				{items?.map((item) => (
					<RSelect.Item key={String(item[valueKey])} value={String(item[valueKey])}>
						{item[labelKey]}
					</RSelect.Item>
				))}
			</RSelect.Content>
		</RSelect.Root>
	);
}

export default Select;
