function Separator({ children }: any) {
	return (
		<div className="w-full px-4 !h-14 flex items-center">
			<div className="w-full p-2 px-3 rounded-b-lg border-primary-500 bg-amber-800/10 border border-amber-400/20 shadow-sm h-full flex items-center backdrop-blur-xs">
				<h2 className="text-lg text-amber-400 font-medium title-font w-full">{children}</h2>
			</div>
		</div>
	);
}

export default Separator;
