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
//    models.Orderline = models.Orderline.extend({
//        get_image_url: function (product_id) {
//            return window.location.origin + "/web/image?model=product.product&field=image_1920&id=" + product_id;
//        },
//    });
    class QuantityWarningPopup extends AbstractAwaitablePopup {

        get_image_url(product_id) {
            return window.location.origin + "/web/image?model=product.product&field=image_1920&id=" + product_id;
        }
        constructor() {
            var parameter = super(...arguments);
            this.product = parameter.props.product;
            this.packages = []
            this.current_package = {}
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
                    this.current_package = this.packages[0]
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
        get getCurrentPackage () {
            return this.current_package
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
            self.product["is_added"] = true;
            for(var i = 0;i<current_packages.length;i++){
                for(var j = 0;j<current_packages[i].products.length;j++){
                    if (parseInt(current_packages[i].products[j].pos_amount) > 0){
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
            selectedOrder.get_selected_orderline().set_quantity(1);
            this.trigger("close-popup");
        }
        min_amount(event) {
            let parent = $(event.currentTarget).closest('tr');
            let input = parent.find('.amount_input')
            let old_value = parseInt(input.val())
            if(old_value == 0) return
            input.val(old_value - 1)
            this.onchange_product_qty(event)
        }
        max_amount(event) {
             var parent = $(event.currentTarget).closest('tr');
             var package_id = parent.data('prod-id');
             var product_id = parent.data('pack-id');
             let input = parent.find('.amount_input')
             let old_value = parseInt(input.val())
             let is_valid = this.validate_new_qty(package_id, product_id)
             if(!is_valid) return
             input.val(old_value + 1)
             this.onchange_product_qty(event)
        }
        onchange_product_qty(event) {
            var parent = $(event.currentTarget).closest('tr');
            var package_id = parent.data('prod-id');
            var product_id = parent.data('pack-id');
            var input = parent.find('.amount_input')
            var qty = input.val()
            this.update_new_qty(package_id, product_id, qty)
        }
        validate_new_qty(pak_id, prod_id) {
            for(var i = 0;i<this.packages.length;i++){
                 if(this.packages[i].id == pak_id) {
                    this.packages[i].total_pos_amount = 1
                    for(var j = 0;j<this.packages[i].products.length;j++){
                        this.packages[i].total_pos_amount += parseInt(this.packages[i].products[j].pos_amount)
                    }
                    if(this.packages[i].total_pos_amount > this.packages[i].max_qty) return false
                    else return true
                }
			}
        }
        update_new_qty(pak_id, prod_id, new_qty) {
//            var package = this.packages.filter((package) => package.id == pak_id)
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
        show_package_category(id) {
//            this.current_package = this.packages.filter(pak => pak.id == id)[0]
//            this.render()
            // Declare all variables
              var i, tabcontent, tablinks;

              // Get all elements with class="tabcontent" and hide them
              tabcontent = document.getElementsByClassName("tabcontent");
              for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
              }

              // Get all elements with class="tablinks" and remove the class "active"
              tablinks = document.getElementsByClassName("tablinks");
              for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
              }

              // Show the current tab, and add an "active" class to the button that opened the tab
              console.log(document.getElementById('package_content-' + id))
              document.getElementById('package_content-' + id).style.display = "block";
              document.getElementById('tablinks-' + id).className += " active";
        }

    }
    QuantityWarningPopup.template = "QuantityWarningPopup";

    Registries.Component.add(QuantityWarningPopup);

    return {
        QuantityWarningPopup,
    };
});