import { Plugin, ItemView, WorkspaceLeaf } from "obsidian";
import { DEFAULT_SETTINGS, HoverHighlightSettingTab, type SpotlightSettings } from "./settings";
import { SpotlightRenderer } from "./spotlight";

export default class HoverHighlightPlugin extends Plugin {
	settings: SpotlightSettings;
	private renderer: SpotlightRenderer | null = null;
	private activeCanvasLeaf: WorkspaceLeaf | null = null;

	async onload(): Promise<void> {
		await this.loadSettings();

		this.addSettingTab(new HoverHighlightSettingTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on("active-leaf-change", (leaf) => {
				this.handleLeafChange(leaf);
			})
		);

		this.registerEvent(
			this.app.workspace.on("layout-change", () => {
				this.handleLeafChange(this.app.workspace.activeLeaf);
			})
		);

		this.handleLeafChange(this.app.workspace.activeLeaf);
	}

	onunload(): void {
		this.destroyRenderer();
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	private handleLeafChange(leaf: WorkspaceLeaf | null): void {
		if (!leaf) return;

		const view = leaf.view;
		const viewType = view.getViewType();

		if (viewType === "canvas") {
			if (this.activeCanvasLeaf !== leaf) {
				this.activeCanvasLeaf = leaf;
				this.initRenderer(leaf);
			}
		} else {
			if (this.activeCanvasLeaf) {
				this.destroyRenderer();
				this.activeCanvasLeaf = null;
			}
		}
	}

	private initRenderer(leaf: WorkspaceLeaf): void {
		this.destroyRenderer();

		const view = leaf.view as any;
		if (!view || !view.canvas) return;

		const { wrapperEl } = view.canvas;

		this.renderer = new SpotlightRenderer(
			this.app,
			wrapperEl,
			this.settings
		);
	}

	private destroyRenderer(): void {
		if (this.renderer) {
			this.renderer.destroy();
			this.renderer = null;
		}
	}

	updateSpotlight(): void {
		if (this.renderer) {
			this.renderer.updateSettings(this.settings);
		} else {
			this.handleLeafChange(this.app.workspace.activeLeaf);
		}
	}
}
