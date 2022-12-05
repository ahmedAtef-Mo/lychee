# -*- coding: utf-8 -*-

from functools import partial

from odoo import models, fields


class PosConfig(models.Model):
    _inherit = 'pos.config'

    analytic_account_id = fields.Many2one('account.analytic.account', 'Analytic Account')
    sequence_range = fields.Integer(
        string='Sequence Range',
        required=False)
    sequence_prefix = fields.Char(
        string='Sequence Prefix',
        required=False)
    sequence_last_count = fields.Integer(
        string='Sequence_last_count',
        default=0,
        readonly=True,
        required=False)

    def update_sequence_last_count(self, sequence_last_count):
        self.sequence_last_count = sequence_last_count
