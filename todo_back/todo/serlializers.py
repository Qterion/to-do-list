from importlib.resources import read_binary
from itertools import product
from rest_framework import serializers
from todo.models import Todo, TodoFile
from taggit.serializers import (TagListSerializerField, TaggitSerializer)
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class TodoFileSerializer(serializers.ModelSerializer):
    class Meta:
        model=TodoFile
        fields=['id','todo','file']

class TodoSerializer(TaggitSerializer,serializers.ModelSerializer):
    files=TodoFileSerializer(many=True, read_only=True)
    uploaded_files= serializers.ListField(
        child=serializers.FileField(max_length=100000, allow_empty_file=False, use_url=False),
        write_only=True,required=False
    )
    tags=TagListSerializerField(required=False)

    class Meta:
        model=Todo
        fields=['id','title','description','completed','tags','user','created_at','updated_at','files','uploaded_files']

    def create(self, validated_data):
        uploaded_files=validated_data.pop('uploaded_files',None)
        todo=Todo.objects.create(**validated_data)
        if uploaded_files is not None:
            for file in uploaded_files:
                newtodo_file=TodoFile.objects.create(todo=todo,file=file)
        return todo


   