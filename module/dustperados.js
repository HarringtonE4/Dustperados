// Dustperados/module/dustperados.js

// Import the custom ActorSheet class
import { DustperadosActorSheet } from "./sheets/actor-sheet.js"; // Correct path to the new file

/**
 * Foundry VTT is initialized.
 * This hook is fired once Foundry has finished its initialization process.
 */
Hooks.once("init", async function() {
    console.log("Dustperados | Initializing Dustperados System");

    // Register our custom ActorSheet.
    // The "dustperados" scope is arbitrary but should be unique to your system.
    Actors.registerSheet("dustperados", DustperadosActorSheet, {
        types: ["character"], // Apply this sheet to "character" actors
        makeDefault: true,   // Make this the default sheet for new character actors
        label: "DUSTPERADOS.SheetTitleCharacter" // Localization key for the sheet title
    });

    // Optionally register for NPCs if you want them to use the same sheet
    Actors.registerSheet("dustperados", DustperadosActorSheet, {
        types: ["npc"],
        makeDefault: false, // Don't make it default for NPCs if they might get a different one later
        label: "DUSTPERADOS.SheetTitleNPC"
    });

    // You can also unregister the default Foundry sheet if you want to ensure only yours is used.
    // Actors.unregisterSheet("core", ActorSheet);
});