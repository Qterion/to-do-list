# Generated by Django 5.0 on 2023-12-29 01:30

import taggit.managers
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('taggit', '0006_rename_taggeditem_content_type_object_id_taggit_tagg_content_8fc721_idx'),
        ('todo', '0002_alter_todo_tags'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='tags',
            field=taggit.managers.TaggableManager(help_text='A comma-separated list of tags.', through='taggit.TaggedItem', to='taggit.Tag', verbose_name='Tags'),
        ),
    ]
