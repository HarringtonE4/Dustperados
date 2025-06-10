// Dustperados/module/dustperados.js

import { DustperadosActorSheet } from "./sheets/actor-sheet.js";

/**
 * Foundry VTT is initialized.
 * This hook is fired once Foundry has finished its initialization process.
 */
Hooks.once("init", async function() { // Added 'async' keyword here
    console.log("Dustperados | Initializing Dustperados System");

    // Register our custom ActorSheet.
    Actors.registerSheet("dustperados", DustperadosActorSheet, {
        types: ["character"], // Apply this sheet to "character" actors
        makeDefault: true,   // Make this the default sheet for new character actors
        label: "DUSTPERADOS.SheetTitleCharacter" // Localization key for the sheet title
    });

    // Optionally register for NPCs if you want them to use the same sheet
    Actors.registerSheet("dustperados", DustperadosActorSheet, {
        types: ["npc"],
        makeDefault: false,
        label: "DUSTPERADOS.SheetTitleNPC"
    });

    // --- NEW: Load all Handlebars partials here ---
    // This tells Foundry about these partials, making them available by their simple name.
    const templatePaths = [
        "systems/dustperados/templates/actor-inventory.html"
        // Add paths to other partials here as you create them (e.g., actor-skills.html)
    ];
    await loadTemplates(templatePaths); // Make sure to await this call
    // --- END NEW ---
});