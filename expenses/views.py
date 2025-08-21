from rest_framework import viewsets
from rest_framework.decorators import action
from .models import Expense
from .serializers import ExpenseSerializer
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# DRF API
@method_decorator(csrf_exempt, name='dispatch')
class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all().order_by("-date")
    serializer_class = ExpenseSerializer

# Minimal HTML UI
def expense_tracker_ui(request):
    return render(request, "index.html")


