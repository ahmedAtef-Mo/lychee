# -*- coding: utf-8 -*-
{
    'name': "pl_pos_product_bulider",
    'summary': """
    """,
    'description': """
    """,
   'author': 'Plementus',
    'website': 'https://www.plementus.com',

    'contributors': [
        '',
    ],
    'version': '0.1',
    'depends': ['mrp', 'point_of_sale'],
    'data': [
        'security/ir.model.access.csv',
        'views/extra_component_views.xml',
        'views/mrp_bom_views.xml',
    ],
    'assets': {
        'point_of_sale.assets': [
            'pl_pos_product_bulider/static/src/js/models.js',
        ],
        'web.assets_qweb': [
            'pl_pos_product_bulider/static/src/xml/**/*',
        ],
    },
    'assets': {
        'point_of_sale.assets': [
            'pl_pos_product_bulider/static/src/css/pos.css',
            'pl_pos_product_bulider/static/src/js/pos.js',
            # 'pos_coupons/static/src/js/pos.js',
        ],
        'web.assets_qweb': [
            'pl_pos_product_bulider/static/src/xml/**/*',

        ],
    }
}