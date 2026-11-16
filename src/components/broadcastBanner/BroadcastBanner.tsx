import { getDateString } from '@/functions/DateUtils';
import type { AppInfo } from '@/types';
import { ChevronDown, ChevronUp, Megaphone } from 'lucide-react';
import { useState } from 'react';
import { SpotlightCard } from '..';
import AnimatedContent from '../animatedContent/AnimatedContent';

function formatBannerDate(rawDate?: string): string {
	if (!rawDate) return '';
	const parsed = new Date(rawDate);
	if (Number.isNaN(parsed.getTime())) return '';
	return getDateString(parsed);
}

function BroadcastBanner({ info }: { info?: AppInfo }) {
	const [expanded, setExpanded] = useState(false);
	const message = info?.message?.trim() ?? '';

	if (!message) return null;

	const linesCount = message.split('\n').length;
	const isLong = message.length > 240 || linesCount > 4;
	const formattedDate = formatBannerDate(info?.date);

	return (
		<div className="w-full">
			<AnimatedContent distance={14} direction="vertical" duration={0.45} scale={0.98}>
				<SpotlightCard className="card-surface banner-glow p-3.5 sm:p-4 shadow-md">
					<div className="flex items-start gap-3">
						<div
							className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 megaphone-float"
							style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-hex)' }}
						>
							<Megaphone className="w-4 h-4" />
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex flex-wrap items-center justify-between gap-2 mb-1">
								<span className="text-xs font-semibold uppercase tracking-wider text-gray-300">
									Mensaje de difusión
								</span>
								{formattedDate && (
									<span className="text-[11px] text-gray-400">Actualizado: {formattedDate}</span>
								)}
							</div>

							<p
								className={`text-sm text-gray-100 whitespace-pre-line leading-relaxed transition-all duration-300 ${
									!expanded && isLong ? 'line-clamp-4' : ''
								}`}
							>
								{message}
							</p>

							{isLong && (
								<button
									type="button"
									onClick={() => setExpanded((prev) => !prev)}
									className="mt-2 inline-flex items-center gap-1 text-xs font-medium hover:underline cursor-pointer"
									style={{ color: 'var(--accent-hex)' }}
								>
									{expanded ? (
										<>
											<ChevronUp className="w-3.5 h-3.5" />
											Ver menos
										</>
									) : (
										<>
											<ChevronDown className="w-3.5 h-3.5" />
											Ver mensaje completo
										</>
									)}
								</button>
							)}
						</div>
					</div>
				</SpotlightCard>
			</AnimatedContent>
		</div>
	);
}

export default BroadcastBanner;
