import { DustperadosActorSheet } from "./sheets/actor-sheet.js";
import { DustperadosItemSheet } from "./sheets/item-sheet.js";

/* -------------------------------------------- */
/* Foundry VTT Initialization                  */
/* -------------------------------------------- */
Hooks.once("init", async function() {
    console.log("Dustperados | Initializing Dustperados System");

    // Define special status effects for Luck/Jinx that can be controlled by code.
    CONFIG.specialStatusEffects = {
        "luck": { id: 'luck', label: 'Luck', icon: 'icons/svg/star.svg' },
        "jinx": { id: 'jinx', label: 'Jinx', icon: 'icons/svg/cursed.svg' }
    };
});

/* -------------------------------------------- */
/* Foundry VTT Ready                           */
/* -------------------------------------------- */
Hooks.once("ready", async function() {
    console.log("Dustperados | System Ready");

    // Unregister default sheets and register custom ones.
    DocumentSheetConfig.unregisterSheet(Actor, "core", ActorSheet);
    DocumentSheetConfig.registerSheet(Actor, "dustperados", DustperadosActorSheet, {
        types: ["character"],
        makeDefault: true,
        label: "Dustperados Character Sheet"
    });

    DocumentSheetConfig.unregisterSheet(Item, "core", ItemSheet);
    DocumentSheetConfig.registerSheet(Item, "dustperados", DustperadosItemSheet, {
        types: ["weapon", "equipment"],
        makeDefault: true,
        label: "Dustperados Item Sheet"
    });
});

/* -------------------------------------------- */
/* Force Data Model Application                */
/* -------------------------------------------- */
/**
 * This hook runs just BEFORE a new Actor is created.
 * It manually merges the default data from the template.json,
 * guaranteeing that new characters are never created with an empty system object.
 */
Hooks.on("preCreateActor", (document, data, options, userId) => {
    // This logic only applies to the 'character' type.
    if (document.type === "character") {
        // Get the blueprint for a character from the system's template.json.
        const template = game.system.template.Actor.character;
        
        // The data that is about to be created for the new actor.
        const source = document.toObject();

        // Merge the blueprint into the creation data.
        const mergedData = foundry.utils.mergeObject(template, source.system);
        
        // Update the creation data with the complete, merged data.
        document.updateSource({ system: mergedData });
    }
});
