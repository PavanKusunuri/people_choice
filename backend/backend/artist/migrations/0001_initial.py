# Generated by Django 5.0 on 2024-01-02 15:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('artist_category', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Artist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('current_location', models.CharField(max_length=100)),
                ('place_of_birth', models.CharField(max_length=100)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('T', 'Transgender')], max_length=1)),
                ('artist_category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='artist_category.artistcategory')),
            ],
        ),
    ]
