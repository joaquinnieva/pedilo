import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, { ReactNode, useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedContentProps {
	children: ReactNode;
	distance?: number;
	direction?: 'vertical' | 'horizontal';
	reverse?: boolean;
	duration?: number;
	ease?: string | ((progress: number) => number);
	initialOpacity?: number;
	animateOpacity?: boolean;
	scale?: number;
	threshold?: number;
	delay?: number;
	onComplete?: () => void;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
	children,
	distance = 100,
	direction = 'vertical',
	reverse = false,
	duration = 0.5,
	ease = 'power3.out',
	initialOpacity = 0,
	animateOpacity = true,
	scale = 1.05,
	threshold = 0.1,
	delay = 0,
	onComplete,
}) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const axis = direction === 'horizontal' ? 'x' : 'y';
		const offset = reverse ? -distance : distance;

		gsap.set(el, {
			[axis]: offset,
			scale,
			opacity: animateOpacity ? initialOpacity : 1,
		});

		gsap.to(el, {
			[axis]: 0,
			scale: 1,
			opacity: 1,
			duration,
			ease: 'expo.in',
			delay,
			onComplete,
		});
	}, [
		distance,
		direction,
		reverse,
		duration,
		ease,
		initialOpacity,
		animateOpacity,
		scale,
		threshold,
		delay,
		onComplete,
	]);

	return (
		<div ref={ref} className="w-full h-full">
			{children}
		</div>
	);
};

export default AnimatedContent;
