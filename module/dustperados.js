// Dustperados/module/dustperados.js

import { DustperadosActorSheet } from "./sheets/actor-sheet.js";
import { DustperadosItemSheet } from "./sheets/item-sheet.js";

/**
 * Foundry VTT is initialized.
 * This hook is fired once Foundry has finished its initialization process.
 */
Hooks.once("init", async function() {
    console.log("Dustperados | Initializing Dustperados System (Init Hook)");

    const templatePaths = []; 
    await foundry.applications.handlebars.loadTemplates(templatePaths); 
});

/**
 * The game is fully ready.
 * This hook is fired once all other initialization is complete and the game is ready to be used.
 */
Hooks.once("ready", async function() {
    console.log("Dustperados | System Ready (Ready Hook)");

    // Correctly unregister default sheets and register custom ones

    // Unregister default Actor sheet
    // Use the global Actor class for unregisterSheet
    DocumentSheetConfig.unregisterSheet(Actor, "core", ActorSheet); 
    
    // Register your custom character sheet
    DocumentSheetConfig.registerSheet(Actor, "dustperados", DustperadosActorSheet, {
        types: ["character"],
        makeDefault: true,
        label: "DUSTPERADOS.SheetTitleCharacter"
    });
    // Register your custom NPC sheet
    DocumentSheetConfig.registerSheet(Actor, "dustperados", DustperadosActorSheet, {
        types: ["npc"],
        makeDefault: false, 
        label: "DUSTPERADOS.SheetTitleNPC"
    });


    // Unregister default Item sheet
    // Use the global Item class for unregisterSheet
    DocumentSheetConfig.unregisterSheet(Item, "core", ItemSheet); 

    // Register your custom item sheet for weapon and equipment types
    DocumentSheetConfig.registerSheet(Item, "dustperados", DustperadosItemSheet, {
        types: ["weapon", "equipment"],
        makeDefault: true,
        label: "DUSTPERADOS.SheetTitleItem"
    });

    // This hook fires BEFORE an Actor document is created
    Hooks.on("preCreateActor", (document, data, options, userId) => {
        console.log("Dustperados | preCreateActor Hook - Initial Data:", data);
        console.log("Dustperados | preCreateActor Hook - Actor System Data:", data.system);
    });
});
