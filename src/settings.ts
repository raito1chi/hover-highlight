import { App, PluginSettingTab, Setting } from "obsidian";
import HoverHighlightPlugin from "./main";

export interface SpotlightSettings {
	enabled: boolean;
	radius: number;
	intensity: number;
	smoothness: number;
	fadeEnabled: boolean;
}

export const DEFAULT_SETTINGS: SpotlightSettings = {
	enabled: true,
	radius: 120,
	intensity: 0.5,
	smoothness: 0.12,
	fadeEnabled: true,
};

export class HoverHighlightSettingTab extends PluginSettingTab {
	plugin: HoverHighlightPlugin;

	constructor(app: App, plugin: HoverHighlightPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Enable glow")
			.setDesc("Toggle the dot glow effect on Canvas")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enabled)
					.onChange(async (value) => {
						this.plugin.settings.enabled = value;
						await this.plugin.saveSettings();
						this.plugin.updateSpotlight();
					})
			);

		new Setting(containerEl)
			.setName("Glow radius")
			.setDesc("Size of the glow in pixels (50–500)")
			.addSlider((slider) =>
				slider
					.setLimits(50, 500, 10)
					.setValue(this.plugin.settings.radius)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.radius = value;
						await this.plugin.saveSettings();
						this.plugin.updateSpotlight();
					})
			);

		new Setting(containerEl)
			.setName("Dot brightness")
			.setDesc("How bright the lit dots appear (0.01–1.0)")
			.addSlider((slider) =>
				slider
					.setLimits(1, 100, 1)
					.setValue(Math.round(this.plugin.settings.intensity * 100))
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.intensity = value / 100;
						await this.plugin.saveSettings();
						this.plugin.updateSpotlight();
					})
			);

		new Setting(containerEl)
			.setName("Smoothness")
			.setDesc("How smoothly the glow follows the cursor (lower = smoother)")
			.addSlider((slider) =>
				slider
					.setLimits(1, 50, 1)
					.setValue(Math.round(this.plugin.settings.smoothness * 100))
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.smoothness = value / 100;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Fade animation")
			.setDesc("Fade the glow out after cursor stops moving")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.fadeEnabled)
					.onChange(async (value) => {
						this.plugin.settings.fadeEnabled = value;
						await this.plugin.saveSettings();
						this.plugin.updateSpotlight();
					})
			);
	}
}
