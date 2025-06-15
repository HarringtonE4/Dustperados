// Dustperados/module/sheets/actor-sheet.js

export class DustperadosActorSheet extends ActorSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["dustperados", "sheet", "actor"],
            template: "systems/dustperados/templates/actor-sheet.html",
            width: 720,
            height: 800,
        });
    }

    /** @override */
    getData() {
        // The base method already provides the 'actor' object,
        // which contains 'system'. The template can access everything it needs.
        const context = super.getData();
        console.log("Dustperados | Actor Sheet Data (after getData):", context);
        return context;
    }
    
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        if (!this.options.editable) return;

        // --- Action Bar (Luck/Jinx) Button Listeners ---
        html.find('.action-bar-btn').click(this._onActionBarClick.bind(this));

        // --- Item Management Listeners ---
        html.find('.item-edit').click(this._onItemEdit.bind(this));
        html.find('.item-delete').click(this._onItemDelete.bind(this));

        /* --- Drag & Drop Listeners for Inventory --- */
        const inventoryList = html.find('#inventory-content-container')[0];
        if (inventoryList) {
            inventoryList.addEventListener("dragover", this._onDragOver.bind(this));
            inventoryList.addEventListener("dragleave", this._onDragLeave.bind(this));
            inventoryList.addEventListener("drop", this._onDrop.bind(this));
        }
        html.find("li.item").each((i, li) => {
            if (li.dataset.itemId) {
                li.addEventListener("dragstart", this._onDragStart.bind(this));
            }
        });
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
        Dialog.confirm({
            title: "Confirm Deletion",
            content: "Are you sure you want to delete this item?",
            yes: () => this.actor.deleteEmbeddedDocuments("Item", [itemId]),
            no: () => {}
        });
    }

    /* --- Drag & Drop Handlers --- */
    _onDragStart(event) {
        const li = event.currentTarget;
        const itemId = li.dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (!item) return;
        const dragData = { type: "Item", uuid: item.uuid };
        event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
        li.classList.add("dragging");
    }

    _onDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        event.currentTarget.classList.add("drag-over");
    }

    _onDragLeave(event) {
        event.currentTarget.classList.remove("drag-over");
    }

    async _onDrop(event) {
        event.preventDefault();
        event.currentTarget.classList.remove("drag-over");
        let data;
        try {
            data = JSON.parse(event.dataTransfer.getData("text/plain"));
        } catch (err) {
            return;
        }
        if (data.type === "Item") {
            const item = await Item.fromDropData(data);
            const actor = this.actor;
            if (actor.items.has(item.id)) {
                return ui.notifications.warn(`${item.name} is already in ${actor.name}'s inventory.`);
            }
            const itemData = item.toObject();
            await actor.createEmbeddedDocuments("Item", [itemData]);
            ui.notifications.info(`Added ${item.name} to ${actor.name}'s inventory.`);
        } else {
            ui.notifications.warn("Only Item documents can be added to the inventory.");
        }
    }

    /**
     * Handle clicks on the Action Bar +/- buttons.
     * @param {Event} event The originating click event
     * @private
     */
    async _onActionBarClick(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const action = button.dataset.action;
        const luckjinxdata = this.actor.system.condition.luckjinx;
        const currentValue = luckjinxdata.value;
        const min = luckjinxdata.min;
        const max = luckjinxdata.max;

        let newValue;
        if (action === "increase-luck") {
            newValue = Math.min(currentValue + 1, max);
        } else if (action === "decrease-luck") {
            newValue = Math.max(currentValue - 1, min);
        } else {
            return;
        }

        // Only update if the value has changed
        if (newValue !== currentValue) {
            await this.actor.update({ 'system.condition.luckjinx.value': newValue });
            // Note: We no longer call the _updateLuckJinxIcon method directly.
            // It will be handled automatically by the 'updateActor' hook.
        }
    }
    
    /**
     * This override is called every time the sheet is rendered.
     * We use it to ensure the token icon is correct when the sheet is opened.
     * @override
     */
        render(force = false, options = {}) {
        // DEFENSIVE CODING: Before trying to access luckjinx,
        if (this.actor.system?.condition?.luckjinx) {
            this._updateLuckJinxIcon(this.actor.system.condition.luckjinx.value);
        }
        return super.render(force, options);
    }

    /**
     * Automatically toggles the Luck or Jinx icon on the actor's token
     * by creating or removing an Active Effect.
     * @param {number} currentValue The new value of the luckjinx attribute
     * @private
     */
    async _updateLuckJinxIcon(currentValue) {
        // Define our Luck and Jinx effects.
        const luckEffectData = {
            id: 'luck',
            label: 'Luck',
            icon: 'icons/svg/star.svg',
            flags: { core: { statusId: 'luck' } }
        };
        const jinxEffectData = {
            id: 'jinx',
            label: 'Jinx',
            icon: 'icons/svg/cursed.svg',
            flags: { core: { statusId: 'jinx' } }
        };

        // Find existing effects on the actor
        const existingLuck = this.actor.effects.find(e => e.getFlag("core", "statusId") === 'luck');
        const existingJinx = this.actor.effects.find(e => e.getFlag("core", "statusId") === 'jinx');

        // Logic to add or remove effects
        if (currentValue > 0) {
            if (existingJinx) await existingJinx.delete();
            if (!existingLuck) await ActiveEffect.create(luckEffectData, { parent: this.actor });
        } else if (currentValue < 0) {
            if (existingLuck) await existingLuck.delete();
            if (!existingJinx) await ActiveEffect.create(jinxEffectData, { parent: this.actor });
        } else { // currentValue is 0
            if (existingLuck) await existingLuck.delete();
            if (existingJinx) await existingJinx.delete();
        }
    }
}