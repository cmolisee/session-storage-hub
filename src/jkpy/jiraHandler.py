class JiraHandler:
    def __init__(self, nxt=None):
        """set next handler"""
        self._next_handler=nxt;

    def handle(self, request):
        """call next handler"""
        if self._next_handler:
            self._next_handler.handle(request)
        return None
