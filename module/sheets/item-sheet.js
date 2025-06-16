// Dustperados/module/sheets/item-sheet.js

/**
 * Extend the basic ItemSheet with some improvements.
 * @extends {ItemSheet}
 */
export class DustperadosItemSheet extends foundry.appv1.sheets.ItemSheet {

    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["dustperados", "sheet", "item"],
            template: "systems/dustperados/templates/item-sheet.html", // Points to your new HTML
            width: 520,
            height: 480,
        });
    }

    /** @override */
    getData() {
        // Get the default sheet data
        const data = super.getData();

        // Add any custom data for your item sheet here if needed
        // For example, data.item is already available via super.getData()

        return data;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // --- IMPORTANT: Use the same HTML injection workaround here if your Item Sheet uses partials ---
        // If your item-sheet.html eventually uses partials like `{{> "item-details-partial"}}`,
        // you would implement the fetch and inject logic here, similar to actor-sheet.js.
        // For now, this basic item sheet doesn't use any partials, so no extra code is needed.
        // But keep this in mind for the future!
        // Example:
        /*
        const myPartialContainer = html.find("#my-partial-container");
        if (myPartialContainer.length > 0) {
            const partialPath = "systems/dustperados/templates/my-item-partial.html";
            fetch(partialPath)
                .then(response => response.text())
                .then(htmlContent => {
                    const compiledTemplate = Handlebars.compile(htmlContent);
                    const renderedHtml = compiledTemplate(this.getData()); // Pass item data
                    myPartialContainer.html(renderedHtml);
                })
                .catch(error => console.error("Error loading item partial:", error));
        }
        */
        // --- End HTML injection workaround reminder ---
    }
}