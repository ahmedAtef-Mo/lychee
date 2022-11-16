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
});
