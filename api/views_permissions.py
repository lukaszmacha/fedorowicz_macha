from rest_framework import permissions

class ReadOnly(permissions.BasePermission):
    """
    Allows only for read - GET, HEAD, OPTIONS.
    """

    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS
