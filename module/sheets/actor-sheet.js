// Dustperados/module/sheets/actor-sheet.js

export class DustperadosActorSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["dustperados", "sheet", "actor"],
            template: "systems/dustperados/templates/actor-sheet.html",
            width: 720,
            height: 800,
            // Removed the 'tabs' definition since we're using a single-page layout
        });
    }

    /** @override */
    getData() {
        const data = super.getData();

        data.system = data.actor.system; 
        data.abilities = data.actor.system.abilities; 

        console.log("Dustperados | Actor Sheet Data (after getData):", data);

        return data;
    }

    // --- NEW: Helper methods for item management ---

    /**
     * Handle creating a new Item as a dynamic template.
     * @param {Event} event The originating click event
     * @private
     */
    _onItemCreate(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const type = element.dataset.type;
        if (!type) return;

        const itemData = {
            name: `New ${type.capitalize()}`,
            type: type,
            img: `icons/svg/${type}.svg`
        };

        // Create the new Item document as a child of the Actor, using game.items
        return game.items.create(itemData, {parent: this.actor}); // <-- UPDATED: game.items.create
    }

    /**
     * Handle editing an existing Item.
     * @param {Event} event The originating click event
     * @private
     */
    _onItemEdit(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);
        item.sheet.render(true);
    }

    /**
     * Handle deleting an existing Item.
     * @param {Event} event The originating click event
     * @private
     */
    _onItemDelete(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const itemId = element.closest(".item").dataset.itemId;
        // Ask for confirmation before deleting
        Dialog.confirm({ // Dialog is still a global, but typically handled by Foundry UI for systems.
            title: "Confirm Deletion",
            content: "Are you sure you want to delete this item?",
            yes: () => this.actor.deleteEmbeddedDocuments("Item", [itemId]),
            no: () => {}
        });
    }

    // --- END NEW helper methods ---
}
