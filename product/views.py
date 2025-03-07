from rest_framework import viewsets
from .models import Mango, Comment
from .serializers import MangoSerializer, CommentSerializer
from rest_framework import filters, pagination
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from category.models import Category
from . import serializers
from django.db.models import Q

# class MangoPagination(pagination.PageNumberPagination):
#     page_size = 6 #ek page e koita item thakbe
#     page_size_query_param = page_size
#     max_page_size = 100

# class MangoViewSet(viewsets.ModelViewSet):
#     queryset = Mango.objects.all()
#     serializer_class = MangoSerializer
#     permission_classes = [AllowAny]
#     filter_backends = [filters.SearchFilter]
#     search_fields = ['name', 'price', 'category__name']

#     def perform_create(self, serializer):
#         category_id = self.request.data.get('category')
#         if category_id:
#             category = Category.objects.get(id=category_id)
#             serializer.save(category=category)
#         else:
#             # Handle the case where category is missing (maybe throw an error or set default)
#             raise serializers.ValidationError('Category is required.')


class MangoAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        query = request.GET.get("search", "").strip()
        
        # Get all mangoes
        mangoes = Mango.objects.all()

        if query:
            mangoes = mangoes.filter(
                Q(name__icontains=query) |  # Search by name
                Q(category__name__icontains=query) |  # Search by category name
                Q(description__icontains=query)  # Search by description
            )

        serializer = MangoSerializer(mangoes, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        category_id = request.data.get('category')

        if category_id:
            try:
                category = Category.objects.get(id=category_id)
            except Category.DoesNotExist:
                return Response({"detail": "Category not found."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = MangoSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(category=category)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Category is required."}, status=status.HTTP_400_BAD_REQUEST)
    


class MangoDetailAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id, format=None):
        try:
            # Fetch the mango object by its ID
            mango = Mango.objects.get(id=id)
            
            # Serialize the mango data
            serializer = MangoSerializer(mango)
            
            # Return the serialized mango data as a JSON response
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Mango.DoesNotExist:
            # Return a 404 if the mango with the provided ID doesn't exist
            return Response({"detail": "Mango not found."}, status=status.HTTP_404_NOT_FOUND)



# class CommentViewSet(viewsets.ModelViewSet):
#     queryset = Comment.objects.all()
#     serializer_class = CommentSerializer
#     permission_classes = [AllowAny]

#     @action(detail=False, methods=['get'], url_path='comments_by_mango')
#     def comments_by_mango(self, request):
#         mango_id = request.query_params.get('mango_id', None)
        
#         if mango_id is not None:
#             comments = Comment.objects.filter(mango_id=mango_id)  
#             serializer = CommentSerializer(comments, many=True)
#             return Response(serializer.data)
#         else:
#             return Response({"detail": "Mango ID is required."}, status=400)
    
#     def perform_create(self, serializer):
#         user = self.request.user  
#         mango_id = self.request.data.get('mango')
#         if not mango_id:
#             raise ValidationError("Mango ID is required.")
#         serializer.save(user=user, mango_id=mango_id)

#     def get_queryset(self):
#         queryset = super().get_queryset()
#         mango_id = self.request.query_params.get('mango_id')
#         if mango_id:
#             queryset = queryset.filter(mango_id=mango_id)
#         return queryset


class CommentAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        mango_id = request.query_params.get('mango_id', None)
        
        if mango_id:
            comments = Comment.objects.filter(mango_id=mango_id)
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        else:
            return Response({"detail": "Mango ID is required."}, status=status.HTTP_400_BAD_REQUEST)
    def post(self, request, *args, **kwargs):
        user = request.user 
        mango_id = request.data.get('mango')  # Get the mango ID from request data

        if not mango_id:
            raise ValidationError("Mango ID is required.")  # Ensure mango ID is provided
        
        # Prepare data for serializer
        comment_data = {
            'body': request.data.get('body'),
            'rating': request.data.get('rating'),
            'mango': mango_id,
            'user': user.id,  # Associate the comment with the logged-in user
        }
        
        # Validate and save the comment using the serializer
        serializer = CommentSerializer(data=comment_data)
        if serializer.is_valid():
            serializer.save()  # Save the comment to the database
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        # Default queryset for comments (may not be used if the get method is overridden)
        queryset = Comment.objects.all()
        mango_id = self.request.query_params.get('mango_id')
        if mango_id:
            queryset = queryset.filter(mango_id=mango_id)
        return queryset


class AllCommentsAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        # Fetch all comments from the database
        comments = Comment.objects.all()
        
        # Serialize the comments
        serializer = CommentSerializer(comments, many=True)
        
        # Return the serialized comments as a response
        return Response(serializer.data)