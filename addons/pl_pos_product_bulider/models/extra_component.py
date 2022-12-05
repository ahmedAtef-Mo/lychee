from odoo import api, fields, models, _
from odoo.exceptions import ValidationError


class ExtraComponent(models.Model):
    _name = "extra.component"
    _description = "BOM Extra Component"
    _rec_name = 'name'

    name = fields.Char('Package Name', required=True)
    max_qty = fields.Integer(string="Maximum Amount")
    min_qty = fields.Integer(string="Minimum Amount")
    description = fields.Text(string='Description')
    product_ids = fields.Many2many('product.product', string="Products")


class MrpBom(models.Model):
    _inherit = 'mrp.bom'

    extra_component_ids = fields.Many2many('extra.component',  string='Extra')
