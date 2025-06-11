// Dustperados/module/dustperados.js

import { DustperadosActorSheet } from "./sheets/actor-sheet.js";
import { DustperadosItemSheet } from "./sheets/item-sheet.js"; // NEW Import

/**
 * Foundry VTT is initialized.
 * This hook is fired once Foundry has finished its initialization process.
 */
Hooks.once("init", async function() {
    console.log("Dustperados | Initializing Dustperados System");

    // Register Actor Sheets
    Actors.registerSheet("dustperados", DustperadosActorSheet, {
        types: ["character"],
        makeDefault: true,
        label: "DUSTPERADOS.SheetTitleCharacter"
    });
    Actors.registerSheet("dustperados", DustperadosActorSheet, {
        types: ["npc"],
        makeDefault: false,
        label: "DUSTPERADOS.SheetTitleNPC"
    });

    // --- NEW: Register Item Sheets ---
    Items.registerSheet("dustperados", DustperadosItemSheet, {
        types: ["weapon", "equipment"], // Apply this sheet to specific item types
        makeDefault: true,   // Make this the default sheet for these item types
        label: "DUSTPERADOS.SheetTitleItem" // Localization key for the item sheet title
    });
    // You can register more specific sheets later, e.g.:
    // Items.registerSheet("dustperados", DustperadosWeaponSheet, { types: ["weapon"], makeDefault: true, label: "DUSTPERADOS.SheetTitleWeapon" });
    // --- END NEW ---

    // IMPORTANT: templatePaths for actor-inventory.html is REMOVED here.
    // If you add other partials in the future, list them here if you want to use loadTemplates:
    const templatePaths = [];
    await loadTemplates(templatePaths);
});