// Dustperados/module/dustperados.js

import { DustperadosActorSheet } from "./sheets/actor-sheet.js";
import { DustperadosItemSheet } from "./sheets/item-sheet.js";
import { DUSTPERADOS } from "./config.js";

// Add this right below your import statements
const DEFAULT_CHARACTER_DATA = {
    "description": { "type": "String", "label": "Description", "value": "" },
    "abilities": { "brawn": { "value": 0 }, "quickness": { "value": 0 }, "resolve": { "value": 0 }, "charm": { "value": 0 }, "wits": { "value": 0 } },
    "hitLocations": { "head": { "value": 0, "max": 0 }, "body": { "value": 0, "max": 0 }, "leftArm": { "value": 0, "max": 0 }, "rightArm": { "value": 0, "max": 0 }, "leftLeg": { "value": 0, "max": 0 }, "rightLeg": { "value": 0, "max": 0 }, "defense": { "value": 0 } },
    "damageStatus": { "graze": { "value": 0 }, "hit": { "value": 0 }, "crit": { "value": 0 } },
    "condition": { "luckjinx": { "value": 0, "max": 5, "min": -5 } }
};

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

// Register hooks to call the class methods
Hooks.once("init", () => {
    // Instantiate the system class inside the init hook
    game.dustperados = new DustperadosSystem();
    // Call the init method
    game.dustperados.onInit();
});

Hooks.once("ready", () => {
    // By the time the ready hook fires, game.dustperados is guaranteed to exist.
    game.dustperados.onReady();
});

// Replace your old preCreateActor hook with this one
Hooks.on("preCreateActor", (actor, data, options, userId) => {
    // --- DIAGNOSTIC TEST ---
    console.log("Dustperados | Firing preCreateActor hook.");

    // If the system data is missing when we try to create a character...
    if ( data.type === "character" && !data.system ) {
        console.log("Dustperados | --- System data is MISSING. Forcing default data. ---");

        // ...manually insert our default data model.
        // We use deepClone to make sure it's a fresh copy.
        actor.updateSource({
            "system": foundry.utils.deepClone(DEFAULT_CHARACTER_DATA)
        });
        console.log("Dustperados | --- Actor data has been manually injected. ---");
    }
});