from django.shortcuts import render
from rest_framework import generics
from .serlializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404
from taggit.models import Tag
from django.http import FileResponse

class ListTodo(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[JWTAuthentication]

    def get(self, request):
        try:
            todos=Todo.objects.filter(user=request.user)
            if request.GET.get('search'):
                search=request.GET.get('search')
                todos=todos.filter(Q(title__icontains=search) | Q(description__icontains=search))
            
            if request.GET.get('tag'):
                tag=request.GET.get('tag')
                
                todos=todos.filter(tags__name__in=[tag])
            
            user_tags = Tag.objects.filter(todo__user=request.user).distinct()

            
            tag_names = [tag.name for tag in user_tags]
            page_number=request.GET.get('page',1)
            items_per_page=10
            paginator=Paginator(todos,items_per_page)
            serializer=TodoSerializer(paginator.page(page_number),many=True)

            return Response({
                    'data':serializer.data,
                    'tags':tag_names,
                    'num_pages': paginator.num_pages,
                    'items_per_page':  items_per_page,
                    'message':"Blog fetched successfully"
                }, status=status.HTTP_200_OK)
        except Exception as e:
             print(e)
             return Response({
                    'data':{},
                    'message':"Something went wrong"
                }, status=status.HTTP_400_BAD_REQUEST) 
    def post(self, request):
        try:
            data=request.data.copy()
            data['user']=request.user.id
            serializer=TodoSerializer(data=data)
            if not serializer.is_valid():
                return Response({
                    'data':serializer.errors,
                    'message':"Something went wrong"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response({
                    'data':serializer.data,
                    'message':"Todo created successfully"
                }, status=status.HTTP_201_CREATED)
        

        except Exception as e:
             print(e)
             return Response({
                    'data':{},
                    'message':"Something went wrong"
                }, status=status.HTTP_400_BAD_REQUEST)          

class DetailTodo(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):
        try:
            # Retrieve a single todo item by its ID
            todo = Todo.objects.get(id=pk, user=request.user)
            serializer = TodoSerializer(todo)

            return Response({
                'data': serializer.data,
                'message': f"Todo with ID {pk} fetched successfully"
            }, status=status.HTTP_200_OK)
        except Todo.DoesNotExist:
            return Response({
                'data': {},
                'message': f"Todo with ID {pk} does not exist"
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response({
                'data': {},
                'message': "Something went wrong"
            }, status=status.HTTP_400_BAD_REQUEST)


class CreateTodo(APIView):
    permission_classes=[IsAuthenticated]
    authentication_classes=[JWTAuthentication]

    def post(self, request):
        try:
            data=request.data.copy()
            data['user']=request.user.id
            serializer=TodoSerializer(data=data)
            if not serializer.is_valid():
                return Response({
                    'data':serializer.errors,
                    'message':"Something went wrong"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response({
                    'data':serializer.data,
                    'message':"Todo created successfully"
                }, status=status.HTTP_201_CREATED)
        

        except Exception as e:
             print(e)
             return Response({
                    'data':{},
                    'message':"Something went wrong"
                }, status=status.HTTP_400_BAD_REQUEST)

class TodoPatchView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def patch(self, request, pk):
        try:
            data=request.data.copy()
            todo=Todo.objects.filter(id=pk)
            if not todo.exists():
                return Response({
                    'data':{},
                    'message':"This item does not exist"
                }, status=status.HTTP_400_BAD_REQUEST)

            if request.user!=todo[0].user:
                return Response({
                    'data':{},
                    'message':"Not authorized for this action"
                }, status=status.HTTP_400_BAD_REQUEST)
            serializer=TodoSerializer(todo[0],data=data, partial=True)
            if not serializer.is_valid():
                return Response({
                    'data':serializer.errors,
                    'message':"Something went wrong"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            return Response({
                    'data':serializer.data,
                    'message':"Todo updated successfully"
                }, status=status.HTTP_201_CREATED)
        except Exception as e:
             print(e)
             return Response({
                    'data':{},
                    'message':"Something went wrong"
                }, status=status.HTTP_400_BAD_REQUEST)

 

class DeleteTodo(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def delete(self, request,pk):
        try:
            data=request.data.copy()
            todo=Todo.objects.filter(id=pk)
            if not todo.exists():
                return Response({
                    'data':{},
                    'message':"This item does not exist"
                }, status=status.HTTP_400_BAD_REQUEST)

            if request.user!=todo[0].user:
                return Response({
                    'data':{},
                    'message':"Not authorized for this action"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            todo[0].delete()

            return Response({
                    'data':{},
                    'message':"Todo deleted successfully"
                }, status=status.HTTP_200_OK)
        
        except Exception as e:
             print(e)
             return Response({
                    'data':{},
                    'message':"Something went wrong"
                }, status=status.HTTP_400_BAD_REQUEST)

class DeleteTodoFile(APIView):
    def delete(self, request, file_id):
        try:
            # Get the TodoFile object
            todo_file = get_object_or_404(TodoFile, id=file_id)

            # Check if the user is the owner of the associated Todo
            if request.user != todo_file.todo.user:
                return Response({
                    'data': {},
                    'message': "Not authorized for this action"
                }, status=status.HTTP_400_BAD_REQUEST)

          
            todo_file.delete()

            return Response({
                'data': {},
                'message': "TodoFile deleted successfully"
            }, status=status.HTTP_200_OK)

        except TodoFile.DoesNotExist:
            return Response({
                'data': {},
                'message': "TodoFile does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            
            print(e)
            return Response({
                'data': {},
                'message': "Something went wrong"
            }, status=status.HTTP_400_BAD_REQUEST)
    

class DownloadTodoFile(APIView):
    def get(self, request, file_id):
        try:
            # Get the TodoFile object
            todo_file = get_object_or_404(TodoFile, id=file_id)

            # Check if the user is the owner of the associated Todo
            if request.user != todo_file.todo.user:
                return Response({
                    'data': {},
                    'message': "Not authorized for this action"
                }, status=status.HTTP_400_BAD_REQUEST)

            # Open the file and create a FileResponse
            file_path = todo_file.file.path
            response = FileResponse(open(file_path, 'rb'))

            # Set the Content-Disposition header to force download
            response['Content-Disposition'] = f'attachment; filename="{todo_file.file.name}"'

            return response

        except TodoFile.DoesNotExist:
            return Response({
                'data': {},
                'message': "TodoFile does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            print(e)
            return Response({
                'data': {},
                'message': "Something went wrong"
            }, status=status.HTTP_400_BAD_REQUEST)

