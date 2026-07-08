import type { SpotlightSettings } from "./settings";

export class SpotlightRenderer {
	private baseDotsEl: HTMLDivElement;
	private litDotsEl: HTMLDivElement;
	private wrapperEl: HTMLElement;

	private targetX: number = 0;
	private targetY: number = 0;
	private currentX: number = 0;
	private currentY: number = 0;
	private currentAlpha: number = 0;

	private rafId: number | null = null;
	private mouseInside: boolean = false;
	private isDestroyed: boolean = false;
	private lastMoveTime: number = 0;

	private settings: SpotlightSettings;

	constructor(
		_app: any,
		wrapperEl: HTMLElement,
		settings: SpotlightSettings
	) {
		this.wrapperEl = wrapperEl;
		this.settings = { ...settings };

		this.baseDotsEl = document.createElement("div");
		this.baseDotsEl.className = "hover-highlight-dots";
		this.wrapperEl.appendChild(this.baseDotsEl);

		this.litDotsEl = document.createElement("div");
		this.litDotsEl.className = "hover-highlight-dots-lit";
		this.wrapperEl.appendChild(this.litDotsEl);

		this.bindEvents();
		this.applyDotStyle();

		if (this.settings.enabled) {
			this.start();
		}
	}

	private bindEvents(): void {
		this.wrapperEl.addEventListener("mousemove", this.onMouseMove);
		this.wrapperEl.addEventListener("mouseenter", this.onMouseEnter);
		this.wrapperEl.addEventListener("mouseleave", this.onMouseLeave);
	}

	private unbindEvents(): void {
		this.wrapperEl.removeEventListener("mousemove", this.onMouseMove);
		this.wrapperEl.removeEventListener("mouseenter", this.onMouseEnter);
		this.wrapperEl.removeEventListener("mouseleave", this.onMouseLeave);
	}

	private onMouseMove = (e: MouseEvent): void => {
		const rect = this.wrapperEl.getBoundingClientRect();
		this.targetX = e.clientX - rect.left;
		this.targetY = e.clientY - rect.top;
		this.lastMoveTime = performance.now();
	};

	private onMouseEnter = (): void => {
		this.mouseInside = true;
	};

	private onMouseLeave = (): void => {
		this.mouseInside = false;
	};

	private lerp(start: number, end: number, t: number): number {
		return start + (end - start) * t;
	}

	private applyDotStyle(): void {
		const gridStep = 10;
		const dotSize = 0.5;

		const base = `radial-gradient(circle, #555555 ${dotSize}px, transparent ${dotSize}px)`;
		const lit = `radial-gradient(circle, #ffffff ${dotSize}px, transparent ${dotSize}px)`;

		this.baseDotsEl.style.backgroundImage = base;
		this.baseDotsEl.style.backgroundSize = `${gridStep}px ${gridStep}px`;
		this.baseDotsEl.style.backgroundPosition = `${gridStep / 2}px ${gridStep / 2}px`;

		this.litDotsEl.style.backgroundImage = lit;
		this.litDotsEl.style.backgroundSize = `${gridStep}px ${gridStep}px`;
		this.litDotsEl.style.backgroundPosition = `${gridStep / 2}px ${gridStep / 2}px`;
	}

	private updateMask(): void {
		const r = this.settings.radius;
		const x = this.currentX;
		const y = this.currentY;
		const a = Math.min(this.currentAlpha, 1);

		const mask =
			`radial-gradient(circle ${r}px at ${x}px ${y}px, ` +
			`rgba(0,0,0,${a}) 0%, ` +
			`rgba(0,0,0,${a * 0.8}) 25%, ` +
			`rgba(0,0,0,${a * 0.4}) 55%, ` +
			`transparent 100%)`;

		this.litDotsEl.style.maskImage = mask;
		this.litDotsEl.style.webkitMaskImage = mask;
	}

	private clearMask(): void {
		const transparent = "linear-gradient(transparent, transparent)";
		this.litDotsEl.style.maskImage = transparent;
		this.litDotsEl.style.webkitMaskImage = transparent;
	}

	private animate = (): void => {
		if (this.isDestroyed) return;

		const lerpFactor = Math.min(1, (1 - this.settings.smoothness) * 0.5 + 0.02);
		this.currentX = this.lerp(this.currentX, this.targetX, lerpFactor);
		this.currentY = this.lerp(this.currentY, this.targetY, lerpFactor);

		const elapsed = performance.now() - this.lastMoveTime;
		const fadeMs = 800;
		this.currentAlpha = 1 - Math.min(elapsed / fadeMs, 1);

		if (this.currentAlpha > 0.01) {
			this.litDotsEl.style.opacity = "1";
			this.updateMask();
		} else {
			this.clearMask();
			this.litDotsEl.style.opacity = "0";
		}

		this.rafId = requestAnimationFrame(this.animate);
	};

	start(): void {
		if (this.rafId !== null) return;
		this.currentX = this.wrapperEl.clientWidth / 2;
		this.currentY = this.wrapperEl.clientHeight / 2;
		this.lastMoveTime = performance.now();
		this.baseDotsEl.style.display = "";
		this.litDotsEl.style.display = "";
		this.rafId = requestAnimationFrame(this.animate);
	}

	stop(): void {
		if (this.rafId !== null) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
		this.clearMask();
		this.baseDotsEl.style.display = "none";
		this.litDotsEl.style.display = "none";
	}

	applySettings(): void {
		this.applyDotStyle();
	}

	updateSettings(settings: SpotlightSettings): void {
		this.settings = { ...settings };
		this.applySettings();

		if (this.settings.enabled) {
			this.start();
		} else {
			this.stop();
		}
	}

	destroy(): void {
		this.isDestroyed = true;
		this.stop();
		this.unbindEvents();
		this.baseDotsEl.remove();
		this.litDotsEl.remove();
	}
}
