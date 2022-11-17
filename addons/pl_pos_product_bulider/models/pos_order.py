from odoo import fields, models, api

class PosOrderLineExtraComponents(models.Model):
    _name = 'pos.order.line.extra.components'
    order_line = fields.Many2one('pos.order.line')
    component_line_ids = fields.One2many('pos.order.line.extra.components.line','component_id')

class PosOrderLineExtraComponentsLines(models.Model):
    _name = 'pos.order.line.extra.components.line'
    component_id = fields.Many2one('pos.order.line.extra.components')
    product_id = fields.Many2one('product.product')
    quantity = fields.Integer()

class PosOrderLine(models.Model):
    _inherit = 'pos.order.line'
    extra_components = fields.One2many('pos.order.line.extra.components','order_line')
