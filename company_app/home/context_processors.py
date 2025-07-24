def is_cliente(request):
    userprofile = getattr(request.user, 'userprofile', None)
    role = getattr(userprofile, 'role', None)
    return {
        'is_cliente': role == 2,
        'is_empleado': role == 1,
        'is_admin': role == 0,
    }