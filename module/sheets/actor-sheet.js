// Dustperados/module/sheets/actor-sheet.js

export class DustperadosActorSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["dustperados", "sheet", "actor"],
            template: "systems/dustperados/templates/actor-sheet.html",
            width: 600,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html); // Call the base class's listeners

        // --- Inventory Partial Injection Code (keep this as is) ---
        const inventoryContainer = html.find("#inventory-content-container");
        if (inventoryContainer.length > 0) {
            const inventoryPath = "systems/dustperados/templates/actor-inventory.html";
            fetch(inventoryPath)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(htmlContent => {
                    const compiledTemplate = Handlebars.compile(htmlContent);
                    const renderedHtml = compiledTemplate(this.getData());
                    inventoryContainer.html(renderedHtml);

                    // --- NEW: Add event listeners specific to the INJECTED inventory HTML here ---
                    // We need to re-select elements *within* the now-injected content
                    const injectedInventory = inventoryContainer; // The container now holds the new content

                    // Item Create button
                    injectedInventory.find('.item-create').click(this._onItemCreate.bind(this));

                    // Item Edit button
                    injectedInventory.find('.item-edit').click(this._onItemEdit.bind(this));

                    // Item Delete button
                    injectedInventory.find('.item-delete').click(this._onItemDelete.bind(this));
                    // --- END NEW listeners for injected content ---

                })
                .catch(error => {
                    console.error(`Dustperados | Error loading inventory partial: ${error}`);
                    inventoryContainer.html(`<p style="color: red;">Error loading inventory: ${error.message}</p>`);
                });
        }
        // --- End Inventory Partial Injection Code ---

        // Any other listeners that apply to the main actor-sheet.html directly
        // (e.g., if you had buttons outside the inventory section) go here.
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