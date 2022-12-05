from odoo import fields, models, api


class PosLineExtraLine(models.Model):
    _name = 'pos.line.extra.line'

    name = fields.Char(related='product_id.name', store=True)
    order_line = fields.Many2one('pos.order.line')
    product_id = fields.Many2one('product.product')
    quantity = fields.Integer()
    price_unit = fields.Float('Unit Price', required=True, digits='Product Price', default=0.0)
    price_subtotal = fields.Float(string='Subtotal w/o Tax', digits=0,
                                  readonly=True, required=True)
    price_subtotal_incl = fields.Float(string='Subtotal', digits=0,
                                       readonly=True, required=True)

class PosOrderLine(models.Model):
    _inherit = 'pos.order.line'

    extra_product_lines = fields.One2many('pos.line.extra.line', 'order_line')



