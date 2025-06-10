// Dustperados/module/sheets/actor-sheet.js

export class DustperadosActorSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["dustperados", "sheet", "actor"],
            template: "systems/dustperados/templates/actor-sheet.html",
            width: 720, // Increased width for the two-column layout
            height: 800, // Increased height for scrollability
            // Removed the 'tabs' definition since we're using a single-page layout
            // tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
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
        const type = element.dataset.type; // Get data-type from the button
        if (!type) return;

        // Prepare item data for creation
        const itemData = {
            name: `New ${type.capitalize()}`, // e.g., "New Gear"
            type: type, // Matches the type defined in your system.json (e.g., "gear", "weapon", "armor")
            img: `icons/svg/${type}.svg` // Basic icon based on type
        };

        // Create the new Item document as a child of the Actor
        return Item.create(itemData, {parent: this.actor});
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
        item.sheet.render(true); // Render the item's sheet
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
        Dialog.confirm({
            title: "Confirm Deletion",
            content: "Are you sure you want to delete this item?",
            yes: () => this.actor.deleteEmbeddedDocuments("Item", [itemId]),
            no: () => {}
        });
    }

    // --- END NEW helper methods ---
}