// Dustperados/module/dustperados.js

import { DustperadosActorSheet } from "./sheets/actor-sheet.js";
import { DustperadosItemSheet } from "./sheets/item-sheet.js";

/**
 * Foundry VTT is initialized.
 * This hook is fired once Foundry has finished its initialization process.
 */
Hooks.once("init", async function() {
    console.log("Dustperados | Initializing Dustperados System");

    // Register Actor Sheets using game.actors
    game.actors.registerSheet("dustperados", DustperadosActorSheet, {
        types: ["character"],
        makeDefault: true,
        label: "DUSTPERADOS.SheetTitleCharacter"
    });
    game.actors.registerSheet("dustperados", DustperadosActorSheet, {
        types: ["npc"],
        makeDefault: false,
        label: "DUSTPERADOS.SheetTitleNPC"
    });

    // Register Item Sheets using game.items
    game.items.registerSheet("dustperados", DustperadosItemSheet, {
        types: ["weapon", "equipment"],
        makeDefault: true,
        label: "DUSTPERADOS.SheetTitleItem"
    });

    // We will keep this as an empty array for now as you don't have partials defined
    const templatePaths = []; 
    await foundry.applications.handlebars.loadTemplates(templatePaths); 
});

// This hook fires BEFORE an Actor document is created
Hooks.on("preCreateActor", (document, data, options, userId) => {
    console.log("Dustperados | preCreateActor Hook - Initial Data:", data);
    console.log("Dustperados | preCreateActor Hook - Actor System Data:", data.system);
});
