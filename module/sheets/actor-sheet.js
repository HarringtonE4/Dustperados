// Dustperados/module/sheets/actor-sheet.js

/**
 * Extend the basic ActorSheet for Dustperados.
 * @extends {ActorSheet}
 */
export class DustperadosActorSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["dustperados", "sheet", "actor"],
            template: "systems/dustperados/templates/actor-sheet.html", // This is the path to your HTML template
            width: 600,
            height: 680, // Slightly increased height to accommodate new content
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    /** @override */
    getData() {
        // Retrieve the data for the actor document
        const data = super.getData();

        // Add actor system data to the template data.
        // This makes actor.system.abilities available as data.abilities in the HTML
        // and actor.system.hitLocations available as data.hitLocations
        data.system = data.actor.system;

        return data;
    }
}