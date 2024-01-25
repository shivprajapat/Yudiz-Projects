from common_app import modules as module
def verify_token(token_type):
    def verify_token_(function):
        def wrap(self, request, *args, **kwargs):
            token = request.headers.get("Authorization")
            try:
                payload = module.decode_token(token=token)
            except:
                return module.Response({"message": "Signature verification failed", "data": None}, status=module.status.HTTP_401_UNAUTHORIZED)
            
            if not token_type:
                valid_token = module.Admin.objects.filter(email=payload["email"]).exists() or module.User.objects.filter(email=payload["email"]).exists()
            elif token_type == "user":
                valid_token = module.User.objects.filter(email=payload["email"]).exists()
            elif token_type == "admin":
                valid_token = module.Admin.objects.filter(email=payload["email"]).exists()

            if not valid_token:
                return module.Response({"message": "Signature verification failed", "data": None}, status=module.status.HTTP_401_UNAUTHORIZED)
            
            request.data["email"] = payload["email"]
            return function(self, request, *args, **kwargs)
        return wrap
    return verify_token_
