odoo.define("pl_pos_product_bulider.ProductQtyPopup", function (require) {
    "use strict";

    const { useState, useSubEnv } = owl.hooks;
    const PosComponent = require("point_of_sale.PosComponent");
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
    const Registries = require("point_of_sale.Registries");
    var DB = require("point_of_sale.DB");
    var utils = require("web.utils");
    var round_pr = utils.round_precision;
    var field_utils = require("web.field_utils");
    var models = require("point_of_sale.models");
    const { Gui } = require("point_of_sale.Gui");
    models.load_fields("product.product", ["qty_available", "image_1920", "type"]);
    const OrderWidget = require('point_of_sale.OrderWidget');

    var _super_orderline = models.Orderline.prototype;
    models.Orderline = models.Orderline.extend({
        get_image_url: function (product_id) {
            return window.location.origin + "/web/image?model=product.product&field=image_1920&id=" + product_id;
        },
    });
    class QuantityWarningPopup extends AbstractAwaitablePopup {
        constructor() {
            var parameter = super(...arguments);
            this.product = parameter.props.product;
            useSubEnv({ attribute_components: [] });
        }
        cancel() {
            var self = this;
            var selectedOrder = self.env.pos.get_order();
            var selectedOrderLine = selectedOrder.get_selected_orderline();
            self.product["is_added"] = true;
//            selectedOrderLine.price_extra = 30;
            selectedOrder.get_selected_orderline().set_quantity('remove');
            this.props.resolve({ confirmed: false, payload: null });
            this.trigger('close-popup');
        }
        next(){

        }
        put_order() {
            var self = this;
            var selectedOrder = self.env.pos.get_order();
            var selectedOrderLine = selectedOrder.get_selected_orderline();
            self.product["is_added"] = true;
            selectedOrderLine.price += 30;

//            selectedOrder.orderlines[1].price = 30

//            var self = this;
//            var selectedOrder = self.env.pos.get_order();
//            self.product["is_added"] = true;
//            selectedOrder.get_selected_orderline().set_quantity(1);
            this.trigger("close-popup");
        }
    }
    QuantityWarningPopup.template = "QuantityWarningPopup";

    Registries.Component.add(QuantityWarningPopup);

    return {
        QuantityWarningPopup,
    };
});