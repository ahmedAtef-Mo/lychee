from odoo import fields, models, api


class ModelName(models.Model):
    _inherit = 'product.product'

    def get_all_product_packages(self):
        packages = self.env['mrp.bom'].search([('product_tmpl_id','=',self.product_tmpl_id.id)]).mapped('extra_component_ids')
        result = []
        for rec in packages:
            package={'name':rec.name,'max_qty':rec.max_qty,'min_qty':rec.min_qty,'products':rec.product_ids.read()}
            result.append(package)
        return result


