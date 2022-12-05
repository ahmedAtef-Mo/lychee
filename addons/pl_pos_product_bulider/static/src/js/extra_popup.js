odoo.define("pl_pos_product_bulider.ProductQtyPopup", function (require) {
    "use strict";

    const { useState, useSubEnv } = owl.hooks;
    const AbstractAwaitablePopup = require("point_of_sale.AbstractAwaitablePopup");
    const Registries = require("point_of_sale.Registries");
    var models = require("point_of_sale.models");
    const { Gui } = require("point_of_sale.Gui");
    models.load_fields("product.product", ["qty_available", "image_1920", "type"]);
    const ProductScreen = require('point_of_sale.ProductScreen');


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
                else {
                    this.trigger('close-popup');
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
            selectedOrder.get_selected_orderline().set_quantity('remove');
            this.props.resolve({ confirmed: false, payload: null });
            this.trigger('close-popup');
        }
        next(){

        }
        put_order() {
            var self = this;
            var current_packages = this.packages;
            var selectedOrder = self.env.pos.get_order();
            var selectedOrderLine = selectedOrder.get_selected_orderline();
            var product_lines = []
//            console.log(this)
            self.product["is_added"] = true;
            for(var i = 0;i<current_packages.length;i++){
                for(var j = 0;j<current_packages[i].products.length;j++){
                    if (parseInt(current_packages[i].products[j].pos_amount) > 0){
//                        console.log('current_packages[i].products[j]', current_packages[i].products[j])
//                        product_options = self.env.pos._getAddProductOptions(current_packages[i].products[j]);
//                        console.log('product_options', self.env.pos)
                        product_lines.push({
                                'product_id': current_packages[i].products[j].id,
                                'quantity': current_packages[i].products[j].pos_amount,
                                'price_unit': 0,
                                'price_subtotal': 0,
                                'price_subtotal_incl': 0,
                            }
                        )
                    }

                }
            }
            if(selectedOrderLine){
                selectedOrderLine['extra_products'] = product_lines
            }
//            if(selectedOrder && selectedOrderLine) {
//
//                if(!self.env.pos['extra_products']) {
//                   self.env.pos['extra_products'] = {}
//                }
//
//                if(!self.env.pos['extra_products']['order_id'] || self.env.pos['extra_products']['order_id'] != selectedOrder.cid) {
//                    self.env.pos['extra_products']['product_lines'] = {}
//                    self.env.pos['extra_products']['order_id'] = selectedOrder.cid
//                }
//
//                self.env.pos['extra_products']['product_lines'] = product_lines
//            }
            selectedOrder.get_selected_orderline().set_quantity(1);
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
            var input = parent.find('.amount_input')
            var qty = input.val()
            this.validate_new_qty(package_id, product_id, qty)
        }
        validate_new_qty(pak_id, prod_id, new_qty) {
//            var package = this.packages.filter((package) => package.id == pak_id)
              var packages = []
              var current_packages = this.packages;
              for(var i = 0;i<current_packages.length;i++){
                     if(current_packages[i].id == pak_id) {
                        for(var j = 0;j<current_packages[i].products.length;j++){
                            if (current_packages[i].products[j].id == prod_id){
                                current_packages[i].products[j].pos_amount = new_qty;
                            }

                        }
					}
				}

        }

    }
    QuantityWarningPopup.template = "QuantityWarningPopup";

    Registries.Component.add(QuantityWarningPopup);

    return {
        QuantityWarningPopup,
    };
});