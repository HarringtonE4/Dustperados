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
        
        // IMPORTANT: Ensure actor.items are explicitly available for the HTML loop
        // .contents is used to get the raw array of embedded documents from the collection
        data.items = data.actor.items.contents; 

        console.log("Dustperados | Actor Sheet Data (after getData):", data);

        return data;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // If the actor is not editable, do nothing
        if (!this.options.editable) return;

        // --- Existing Item Management Listeners ---

        // Item Edit button listener
        html.find('.item-edit').click(this._onItemEdit.bind(this));

        // Item Delete button listener
        html.find('.item-delete').click(this._onItemDelete.bind(this));

        /* --- NEW: Drag & Drop Listeners for Inventory --- */

        // Get the inventory list element (this will be our drop zone)
        const inventoryList = html.find('#inventory-content-container')[0];

        if (inventoryList) {
            // Add event listeners for drag and drop onto the inventory container
            inventoryList.addEventListener("dragover", this._onDragOver.bind(this));
            inventoryList.addEventListener("dragleave", this._onDragLeave.bind(this));
            inventoryList.addEventListener("drop", this._onDrop.bind(this));
        }

        // Make existing items within the sheet draggable (for dragging *off* the sheet if desired)
        html.find("li.item").each((i, li) => {
            if (li.dataset.itemId) {
                // The HTML already has draggable="true" as per previous step, but this ensures the JS listener is added.
                li.addEventListener("dragstart", this._onDragStart.bind(this));
            }
        });
        /* --- END NEW Drag & Drop Listeners --- */
    }


    // --- Existing Helper methods for item management ---


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
        item.sheet.render(true); // Open the item's sheet
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

    /* --- NEW: Drag & Drop Handlers --- */

    /**
     * Handle a drag event for an item being dragged from the sheet.
     * This prepares the dataTransfer object.
     * @param {Event} event The originating drag event
     * @private
     */
    _onDragStart(event) {
        const li = event.currentTarget;
        const itemId = li.dataset.itemId;
        const item = this.actor.items.get(itemId);

        if (!item) return; // Should not happen if data-item-id is correctly set

        // Create the data transfer object for FoundryVTT
        const dragData = {
            type: "Item",
            uuid: item.uuid // Use UUID for consistent referencing
        };

        // Set the data on the dataTransfer object as JSON
        event.dataTransfer.setData("text/plain", JSON.stringify(dragData));

        // Add a visual class to the dragged item (optional, for CSS styling)
        li.classList.add("dragging");
    }

    /**
     * Handle dragover event on the inventory drop zone.
     * This prevents default behavior to allow the drop.
     * @param {Event} event The originating drag event
     * @private
     */
    _onDragOver(event) {
        event.preventDefault(); // Crucial: Allows the drop event to fire
        event.dataTransfer.dropEffect = "move"; // Sets the visual feedback for the cursor

        // Add a visual highlight to the drop target (the inventory container)
        event.currentTarget.classList.add("drag-over");
    }

    /**
     * Handle dragleave event on the inventory drop zone.
     * @param {Event} event The originating drag event
     * @private
     */
    _onDragLeave(event) {
        // Remove visual highlight from the drop target
        event.currentTarget.classList.remove("drag-over");
    }

    /**
     * Handle dropping of an item onto the character sheet's inventory.
     * @param {Event} event The originating drop event
     * @private
     */
    async _onDrop(event) {
        event.preventDefault(); // Prevent default browser handling (e.g., opening the dropped file)

        // Remove any drag-over visual feedback
        event.currentTarget.classList.remove("drag-over");

        // Parse the data transferred from the drag event
        let data;
        try {
            // TextEditor.get is a common Foundry utility to get data from a drag event,
            // but for a simple drop from the sidebar, direct JSON.parse is also common.
            // Using event.dataTransfer.getData("text/plain") directly here.
            data = JSON.parse(event.dataTransfer.getData("text/plain"));
        } catch (err) {
            console.error("DUSTPERADOS | Failed to parse drag data:", err);
            return; // Data is not valid JSON, ignore.
        }

        // Only process if the data is an 'Item' type
        if (data.type === "Item") {
            // Get the item document from the dropped data (e.g., from sidebar, compendium)
            const item = await Item.fromDropData(data);
            const actor = this.actor;

            // Prevent adding the same item if it's already an embedded document on this actor
            if (actor.items.has(item.id)) {
                ui.notifications.warn(`${item.name} is already in ${actor.name}'s inventory.`);
                return;
            }

            // Create an embedded document (a copy of the item) on the actor
            // This handles items from compendiums, other actors, or the items sidebar
            const itemData = item.toObject(); // Convert to plain object before embedding
            await actor.createEmbeddedDocuments("Item", [itemData]);
            
            ui.notifications.info(`Added ${item.name} to ${actor.name}'s inventory.`);
        } else {
            // Provide feedback if a non-item type is dropped
            ui.notifications.warn("Only Item documents can be added to the inventory.");
        }
    }
    /* --- END NEW Drag & Drop Handlers --- */
}
