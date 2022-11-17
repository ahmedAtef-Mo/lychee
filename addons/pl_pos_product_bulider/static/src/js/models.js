odoo.define('pl_pos_product_bulider.models', function (require) {
"use strict";

    var models = require('point_of_sale.models');

    var _super_product = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
        initialize: function(session, attributes){
            var self = this;
            models.load_fields('product.product', ['bom_count']);
            _super_product.initialize.apply(this, arguments);
        }
    });
    models.Order = models.Order.extend({
        add_product: function(product, options){
        if(this._printed){
            this.destroy();
            return this.pos.get_order().add_product(product, options);
        }
        this.assert_editable();
        options = options || {};
        var line = new models.Orderline({}, {pos: this.pos, order: this, product: product});
        this.fix_tax_included_price(line);

        this.set_orderline_options(line, options);

        var to_merge_orderline;
        for (var i = 0; i < this.orderlines.length; i++) {
            if(this.orderlines.at(i).can_be_merged_with(line) && options.merge !== false){
                to_merge_orderline = this.orderlines.at(i);
            }
        }
        if (to_merge_orderline && product.bom_count == 0){
            to_merge_orderline.merge(line);
            this.select_orderline(to_merge_orderline);
        } else {
            this.orderlines.add(line);
            this.select_orderline(this.get_last_orderline());
        }

        if (options.draftPackLotLines) {
            this.selected_orderline.setPackLotLines(options.draftPackLotLines);
        }
        if (this.pos.config.iface_customer_facing_display) {
            this.pos.send_current_order_to_customer_facing_display();
        }
    },
    });
});
