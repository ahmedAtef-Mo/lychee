odoo.define("pl_pos_product_bulider.ProductQtyPopup", function (require) {
    "use strict";

    var core = require('web.core');

    var QWeb = core.qweb;
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

        get_image_url(product_id) {
            return window.location.origin + "/web/image?model=product.product&field=image_1920&id=" + product_id;
        }
        constructor() {
            var parameter = super(...arguments);
            this.product = parameter.props.product;
            this.packages = []
            useSubEnv({ attribute_components: [] });
        }
        mounted() {
            super.mounted();
            this.rpc({
               model: 'product.product',
                method: 'get_all_product_packages',
                args: [[this.product.id]],
            }).then((result)=>{
                if (result.length > 0) {
                    this.packages = result
                    this.render()
                }
            })
        }
        get getPackages () {
            return this.packages
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
        min_amount(event) {
            var parent = $(event.currentTarget).closest('tr');
            let input = parent.find('.amount_input')
            let old_value = parseInt(input.val())
            input.val(old_value - 1)
            this.onchange_product_qty(event)
        }
        max_amount(event) {
             var parent = $(event.currentTarget).closest('tr');
             let input = parent.find('.amount_input')
             let old_value = parseInt(input.val())
             input.val(old_value + 1)
             this.onchange_product_qty(event)
        }
        onchange_product_qty(event) {
            var parent = $(event.currentTarget).closest('tr');
            var package_id = parent.data('prod-id');
            var product_id = parent.data('pack-id');
            console.log(package_id, product_id)
            let input = parent.find('.amount_input')
            this.validate_new_qty(package_id, product_id, qty)
        }
        validate_new_qty(pak_id, prod_id, new_qty) {
//            var package = this.packages.filter((pack) => pack.id == pak_id)
//            var product = package.products.filter((product) => product.id == prod_id)
//            console.log(product)
        }

    }
    QuantityWarningPopup.template = "QuantityWarningPopup";

    Registries.Component.add(QuantityWarningPopup);

    return {
        QuantityWarningPopup,
    };
});