// Import the Foundry VTT API classes we'll be extending
import { ActorSheetV2 } from "@foundryvtt/core/applications/sheets";
import { ItemSheetV2 } from "@foundryvtt/core/applications/sheets";
import { registerSystemSettings } from "./settings.js"; // We'll create this file later

/**
 * Define the System class. This is where your system's core logic lives.
 * It's usually the first file loaded and sets up everything else.
 */
class Dustperados extends foundry.documents.applications.api.DocumentSheetV2 {
  /**
   * Define Foundry's `init` hook, which runs when the game is initialized.
   */
  static init() {
    console.log("Dustperados | Initializing Dustperados System");

    // Register our custom document classes (Actors, Items)
    CONFIG.Actor.documentClass = class DustperadosActor extends Actor {
      /**
       * Extend the base Actor document to add system-specific data and logic.
       */
      prepareData() {
        super.prepareData();
        // Example: Add some derived data or calculations here
        // For a new system, you'll define your actor data model in system.json
        // or a separate JSON schema file. For now, we'll keep it simple.
      }
    };

    CONFIG.Item.documentClass = class DustperadosItem extends Item {
      /**
       * Extend the base Item document.
       */
      prepareData() {
        super.prepareData();
      }
    };

    // Register our custom sheets
    Actors.registerSheet("dustperados", DustperadosActorSheet, {
      types: ["character", "npc"], // Define which actor types use this sheet
      makeDefault: true,
      label: "DUSTPERADOS.SheetActor"
    });

    Items.registerSheet("dustperados", DustperadosItemSheet, {
      types: ["weapon", "equipment"], // Define which item types use this sheet
      makeDefault: true,
      label: "DUSTPERADOS.SheetItem"
    });

    // Register system settings (we'll create settings.js next)
    registerSystemSettings();
  }

  /**
   * Define Foundry's `ready` hook, which runs when the game is fully loaded.
   */
  static ready() {
    console.log("Dustperados | Dustperados System is Ready!");
  }
}

/**
 * Extend the ActorSheetV2 class for your custom actor sheets.
 */
class DustperadosActorSheet extends ActorSheetV2 {
  /**
   * Define the default options for your actor sheet.
   */
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      classes: ["dustperados", "sheet", "actor"],
      template: "systems/dustperados/templates/actor-sheet.html",
      width: 600,
      height: 600
    };
  }

  /**
   * Prepare data for the actor sheet. This is where you organize and compute data
   * that will be available to your Handlebars template.
   */
  async getData(options) {
    const context = await super.getData(options);

    // Add actor-specific data to the context
    // This is where you would define the structure of your actor's data.
    // For now, we'll use a simple placeholder.
    context.systemData = context.actor.system; // Access data directly from the actor's system object

    // Example of adding some custom data
    context.myCustomValue = "Hello from Dustperados!";

    console.log("DustperadosActorSheet | Actor data:", context.systemData);

    return context;
  }
}

/**
 * Extend the ItemSheetV2 class for your custom item sheets.
 */
class DustperadosItemSheet extends ItemSheetV2 {
  /**
   * Define the default options for your item sheet.
   */
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      classes: ["dustperados", "sheet", "item"],
      template: "systems/dustperados/templates/item-sheet.html",
      width: 500,
      height: 400
    };
  }

  /**
   * Prepare data for the item sheet.
   */
  async getData(options) {
    const context = await super.getData(options);
    context.systemData = context.item.system;
    return context;
  }
}

// Register the system's hooks
Hooks.once("init", Dustperados.init);
Hooks.once("ready", Dustperados.ready);

// Export classes so they can be referenced in other files (if you split your JS)
export { DustperadosActor, DustperadosItem, DustperadosActorSheet, DustperadosItemSheet };
