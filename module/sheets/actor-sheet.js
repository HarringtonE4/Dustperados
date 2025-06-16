// Dustperados/module/sheets/actor-sheet.js

export class DustperadosActorSheet extends foundry.appv1.sheets.ActorSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["dustperados", "sheet", "actor"],
            template: "systems/dustperados/templates/actor-sheet.html",
            width: 720,
            height: 800,
        });
    }

    /**
     * Prepare data for the sheet.
     * This is the new V13-compliant way of getting data. Note the 'async' keyword.
     * @override
     */
    async getData(options) {
        // This calls the parent class's method and waits for it to finish.
        const context = await super.getData(options);

        // In modern Foundry, super.getData() already populates context.actor and context.system.
        // No extra lines are needed here to add system data.
        
        console.log("Dustperados | Actor Sheet Data (after getData):", context);
        
        // All of the actor's data is now available in the context object for the HTML template.
        return context;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        if (!this.isEditable) return;

        // --- Action Bar (Luck/Jinx) Button Listeners ---
        html.find('.action-bar-btn').on('click', this._onActionBarClick.bind(this));

        // --- Item Management Listeners ---
        html.find('.item-edit').on('click', this._onItemEdit.bind(this));
        html.find('.item-delete').on('click', this._onItemDelete.bind(this));
        
        // Note: Drag/Drop logic can often be handled by the default sheet now,
        // but your custom implementation is fine.
    }

    /**
     * Handle clicks on the Action Bar +/- buttons.
     */
    async _onActionBarClick(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const action = button.dataset.action;

        // It's safer to get the data directly from the actor object.
        const luckjinxData = this.actor.system.condition.luckjinx;
        const currentValue = luckjinxData.value;
        const min = luckjinxData.min;
        const max = luckjinxData.max;

        let newValue;
        if (action === "increase-luck") {
            newValue = Math.min(currentValue + 1, max);
        } else if (action === "decrease-luck") {
            newValue = Math.max(currentValue - 1, min);
        } else {
            return;
        }
        
        // Update the actor
        return this.actor.update({ 'system.condition.luckjinx.value': newValue });
    }

    /**
     * Handle editing an existing Item.
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
     */
    _onItemDelete(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const itemId = element.closest(".item").dataset.itemId;
        const item = this.actor.items.get(itemId);

        // Show a confirmation dialog
        Dialog.confirm({
            title: `Delete ${item.name}`,
            content: `<p>Are you sure you want to delete the item <strong>${item.name}</strong>?</p>`,
            yes: () => item.delete(),
            no: () => {},
            defaultYes: false
        });
    }
    
    // Your drag-and-drop handler methods (_onDragStart, _onDrop, etc.) are fine and do not need changes.
}