from django.db import models
from django.contrib.auth.models import User
from taggit.managers import TaggableManager
class TimeStampMixin(models.Model):
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract=True

class Todo(TimeStampMixin):
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)
    title=models.CharField(max_length=200)
    description=models.TextField()
    completed=models.BooleanField(default=False)
    tags = TaggableManager(blank=True)
    def __str__(self):
        return self.title
    
    class Meta:
        ordering=['completed']

class TodoFile(models.Model):
    todo=models.ForeignKey(Todo, on_delete=models.CASCADE, related_name='files')
    file=models.FileField(upload_to='files/',blank=True, null=True, default='')
