import { Select as RSelect } from '@radix-ui/themes';

function Select({
	items,
	value = '',
	valueKey = 'value',
	labelKey = 'label',
	onChange,
}: {
	items: Array<Record<string, any>>;
	value?: string;
	valueKey?: string;
	labelKey?: string;
	onChange: (value: string) => void;
}) {
	return (
		<RSelect.Root defaultValue={value} onValueChange={onChange}>
			<RSelect.Trigger placeholder="Seleccione..." radius="large" />
			<RSelect.Content position="popper">
				{items?.map((item) => (
					<RSelect.Item key={item[valueKey]} value={item[valueKey]}>
						{item[labelKey]}
					</RSelect.Item>
				))}
			</RSelect.Content>
		</RSelect.Root>
	);
}

export default Select;
