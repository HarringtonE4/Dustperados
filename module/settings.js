export function registerSystemSettings() {
  // Example: Register a simple text setting
  game.settings.register("dustperados", "myTestSetting", {
    name: "DUSTPERADOS.SettingName", // Localized name
    hint: "DUSTPERADOS.SettingHint", // Localized hint
    scope: "world", // "world" for world-specific, "client" for user-specific
    config: true, // Show in Foundry's settings menu
    type: String,
    default: "Default Value"
  });

  // Example: Register a boolean setting
  game.settings.register("dustperados", "enableFancyFeature", {
    name: "DUSTPERADOS.EnableFancyFeature",
    hint: "DUSTPERADOS.EnableFancyFeatureHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  console.log("Dustperados | System settings registered.");
}
