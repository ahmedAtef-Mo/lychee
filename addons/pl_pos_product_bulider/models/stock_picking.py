from odoo import fields, models, api
from odoo.tools import groupby


class PosLineExtraLine(models.Model):
    _inherit = 'stock.picking'

    def _create_move_from_pos_order_lines(self, lines):
        #TODO price in pos.order.line
        pos_order_line = self.env['pos.order.line']
        for line in lines:
            pos_order = line.order_id
            if len(line.extra_product_lines) > 0:
                for extra_line in line.extra_product_lines:
                    lines |= pos_order_line.create({
                        'product_id': extra_line.product_id.id,
                        'qty': extra_line.quantity,
                        'price_unit': extra_line.price_unit,
                        'price_subtotal': extra_line.price_subtotal,
                        'price_subtotal_incl': extra_line.price_subtotal_incl,
                        'order_id': pos_order.id,
                        'full_product_name': extra_line.product_id.name,
                    })
        super(PosLineExtraLine, self)._create_move_from_pos_order_lines(lines)

