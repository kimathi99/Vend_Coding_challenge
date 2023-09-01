from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Account,Test,Profile

admin.site.site_header = 'Vend'
admin.site.site_title = 'Vend'
admin.site.index_title = 'Admin panel'

class BaseAccountAdmin(UserAdmin):
    list_display = ('email', 'username', 'phone_number', 'date_joined', 'last_login', )
    search_fields = ('email', 'username')
    readonly_fields = ('date_joined', 'last_login',)

    filter_horizontal = []
    list_filter = ['is_superuser', 'is_active',]
    fieldsets = (
        (None, {
            'fields': ('username', 'email', 'phone_number', 'password', 'date_joined',)
        }),
        ('Group Permissions', {
            'classes': ('collapse',),
            'fields': ('groups', 'user_permissions',)
        }),
        ('Fundamental Permissions', {
            'classes': ('collapse',),
            'fields': ('is_active', 'is_superuser',)
        }),
       
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'phone_number', 'password1', 'password2',)
        }),
    )

class AccountAdmin(BaseAccountAdmin):
   def has_module_permission(self, request):
        if not request.user.is_superuser:
            return False
        return super().has_module_permission(request)
 

admin.site.register(Account, AccountAdmin)
admin.site.register(Test)
admin.site.register(Profile)