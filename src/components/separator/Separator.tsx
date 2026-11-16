import type { ReactNode } from 'react';

function Separator({ children }: { children: ReactNode }) {
	return (
		<div className="w-full py-2 flex items-center">
			<div className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 shadow-sm flex items-center backdrop-blur-md">
				<h2 className="text-base sm:text-lg text-gray-100 font-semibold tracking-tight w-full">
					{children}
				</h2>
			</div>
		</div>
	);
}

export default Separator;
