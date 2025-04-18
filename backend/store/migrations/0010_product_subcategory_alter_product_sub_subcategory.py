# Generated by Django 5.1.6 on 2025-04-12 00:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0009_rename_address_brand_store_address_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='subcategory',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='products', to='store.subcategory'),
        ),
        migrations.AlterField(
            model_name='product',
            name='sub_subcategory',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='products', to='store.subsubcategory'),
        ),
    ]
