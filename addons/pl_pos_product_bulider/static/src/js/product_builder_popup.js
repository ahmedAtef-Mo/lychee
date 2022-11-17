odoo.define('pl_pos_product_bulider.product_builder_popup', function (require) {
    'use strict';

    const ProductScreen = require('point_of_sale.ProductScreen');
    const Registries = require('point_of_sale.Registries');
    const { Gui } = require("point_of_sale.Gui");

    const PosSaleProductScreen = (ProductScreen) =>
        class extends ProductScreen {
            get_image_url(product_id) {
            return window.location.origin + "/web/image?model=product.product&field=image_1920&id=" + product_id;
            }
             async _clickProduct(event) {
                const product = event.detail;
                if(product.bom_count > 0 ) {

                   let result = await super._clickProduct(event);
                   Gui.showPopup("QuantityWarningPopup", {
                        product: product,
                        product_image: this.get_image_url(product.id),
                   })

                }
                else {
                    await super._clickProduct(event);
                }
            }
        };

    Registries.Component.extend(ProductScreen, PosSaleProductScreen);

    return ProductScreen;
});
