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
            page_number=request.GET.get('page',1)
            items_per_page=10
            paginator=Paginator(todos,items_per_page)
            serializer=TodoSerializer(paginator.page(page_number),many=True)

            return Response({
                    'data':serializer.data,
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
    
    def patch(self, request):
        try:
            data=request.data.copy()
            todo=Todo.objects.filter(id=data.get('id'))
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
        
    def delete(self, request):
        try:
            data=request.data.copy()
            todo=Todo.objects.filter(id=data.get('id'))
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
                }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
             print(e)
             return Response({
                    'data':{},
                    'message':"Something went wrong"
                }, status=status.HTTP_400_BAD_REQUEST)


class DetailTodo(generics.RetrieveUpdateAPIView):
    queryset=Todo.objects.all()
    serializer_class=TodoSerializer

class CreateTodo(generics.CreateAPIView):
    queryset=Todo.objects.all()
    serializer_class=TodoSerializer

class DeleteTodo(generics.DestroyAPIView):
    queryset=Todo.objects.all()
    serializer_class=TodoSerializer

