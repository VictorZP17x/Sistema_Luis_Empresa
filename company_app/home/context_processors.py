def is_cliente(request):
    return {
        'is_cliente': hasattr(request.user, 'userprofile') and getattr(request.user.userprofile, 'role', None) == 2
    }