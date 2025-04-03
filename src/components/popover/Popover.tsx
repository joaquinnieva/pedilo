import { Popover } from '@radix-ui/themes';

function Popoverr({
	trigger,
	content,
	align = 'start',
}: { trigger: React.ReactNode; content: React.ReactNode; align?: 'start' | 'center' | 'end' }) {
	return (
		<Popover.Root>
			<Popover.Trigger>{trigger}</Popover.Trigger>
			<Popover.Content align={align}>{content}</Popover.Content>
		</Popover.Root>
	);
}

export default Popoverr;
