// Dustperados/module/dustperados.js

import { DustperadosActorSheet } from "./sheets/actor-sheet.js";
import { DustperadosItemSheet } from "./sheets/item-sheet.js";

Hooks.once("init", async function() {
    console.log("Dustperados | Initializing Dustperados System");

    Actors.registerSheet("dustperados", DustperadosActorSheet, {
        types: ["character"],
        makeDefault: true,
        label: "DUSTPERADOS.Actor.Sheet.TitleCharacter" // UPDATED
    });
    Actors.registerSheet("dustperados", DustperadosActorSheet, {
        types: ["npc"],
        makeDefault: false,
        label: "DUSTPERADOS.Actor.Sheet.TitleNPC" // UPDATED
    });

    Items.registerSheet("dustperados", DustperadosItemSheet, {
        types: ["weapon", "equipment"],
        makeDefault: true,
        label: "DUSTPERADOS.Item.Sheet.Title" // UPDATED
    });

    const templatePaths = [];
    await loadTemplates(templatePaths);
});