import { DustperadosActorSheet } from "./sheets/actor-sheet.js";
import { DustperadosItemSheet } from "./sheets/item-sheet.js";
import { DUSTPERADOS } from "./config.js";


class DustperadosSystem {
    constructor() {
        console.log("Dustperados | System class constructed");
        // Any setup that needs to happen immediately can go here.
    }

    /**
     * A helper to register a new setting.
     * @param {string} key         The setting key.
     * @param {object} options     The setting options.
     */
    registerSetting(key, options) {
        game.settings.register("dustperados", key, options);
    }

    /**
     * Runs once when the system is initialized.
     */
    onInit() {
        console.log("Dustperados | Initializing Dustperados System (Init Hook)");

        // Add our custom config to the global CONFIG object
        CONFIG.DUSTPERADOS = DUSTPERADOS;
        CONFIG.statusEffects = DUSTPERADOS.statusEffects;
        
        // Pre-load HTML templates
        const templatePaths = [
            "systems/dustperados/templates/actor-sheet.html",
            "systems/dustperados/templates/item-sheet.html"
        ];
        foundry.applications.handlebars.loadTemplates(templatePaths);

        // Register sheets
        this._registerSheets();
    }

    /**
     * Runs once when the system is ready.
     */
    onReady() {
        console.log("Dustperados | System Ready (Ready Hook)");
        // Any logic that needs to run after all data is loaded can go here.
    }

    /**
     * Registers actor and item sheets for the system.
     * @private
     */
    _registerSheets() {
        // Unregister default sheets and register custom ones using V13 paths
        foundry.applications.apps.DocumentSheetConfig.unregisterSheet(Actor, "core", foundry.appv1.sheets.ActorSheet);
        foundry.applications.apps.DocumentSheetConfig.registerSheet(Actor, "dustperados", DustperadosActorSheet, {
            types: ["character"],
            makeDefault: true,
            label: "DUSTPERADOS.SheetTitleCharacter"
        });

        foundry.applications.apps.DocumentSheetConfig.unregisterSheet(Item, "core", foundry.appv1.sheets.ItemSheet);
        foundry.applications.apps.DocumentSheetConfig.registerSheet(Item, "dustperados", DustperadosItemSheet, {
            types: ["weapon", "equipment"],
            makeDefault: true,
            label: "DUSTPERADOS.SheetTitleItem"
        });
    }
}
