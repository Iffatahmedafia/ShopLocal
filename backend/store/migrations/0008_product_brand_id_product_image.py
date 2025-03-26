# Generated by Django 5.1.6 on 2025-03-26 03:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0007_alter_customuser_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='brand_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='products', to='store.brand'),
        ),
        migrations.AddField(
            model_name='product',
            name='image',
            field=models.CharField(default='images/default.jpg', max_length=255),
        ),
    ]
