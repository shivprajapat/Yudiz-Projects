from common_app import modules as module
from django.db.models import Q

def send_verification_otp(**kwargs):
	try:
		kwargs["email"] = kwargs["email"].lower()

		if module.User.objects.filter(email=kwargs["email"]).exists():
			return  module.Response({"message": "User already exists with the following email.", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
			
		response = module.send_otp(email=kwargs["email"], otp_type="verification")
		if response["message"] == "success":
			return  module.Response(response, status=module.status.HTTP_200_OK)
		else:
			return  module.Response(response, status=module.status.HTTP_500_INTERNAL_SERVER_ERROR)
	except Exception as e:
		return module.Response({"message": str(e), "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

def create(**kwargs):
	try:
		kwargs["email"] = kwargs["email"].lower()
		
		try:
			module.validate_email(kwargs["email"]) # Email validation: regex validation for email
			module.password_validation.validate_password(kwargs['password']) # Password validation: weather it is weak or strong
		except Exception as e:
			return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
		
		kwargs['password'] = module.make_password(kwargs['password']) # Hashing password

		if module.User.objects.filter(email=kwargs["email"]).exists():
			return  module.Response({"message": "User already exists with the following email.", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
		
		user = kwargs['serializer_class'](data=kwargs)
		if user.is_valid():
			user.save()
			return module.Response({"message": "success", "data": user.data}, status=module.status.HTTP_201_CREATED)
		else:
			return module.Response({"message": user.errors, "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
	except Exception as e:
			return module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

def validate(**kwargs):
	try:
		kwargs["email"] = kwargs["email"].lower()
		
		try:
			module.validate_email(kwargs["email"]) # Email validation: regex validation for email
			module.password_validation.validate_password(kwargs['password']) # Password validation: weather it is weak or strong
		except Exception as e:
			return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
		
		if module.User.objects.filter(email=kwargs["email"]).exists():
			return  module.Response({"message": "User already exists with the following email.", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
		
		return module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
	except Exception as e:
			return module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

def login(**kwargs):
	try:
		kwargs["email"] = kwargs["email"].lower()

		if not module.User.objects.filter(email=kwargs["email"]).exists():
			return  module.Response({"message": "No account associated with the following email address.", "data": None}, status=module.status.HTTP_404_NOT_FOUND)

		user = module.User.objects.get(email=kwargs["email"])

		valid_user = module.check_password(kwargs["password"], user.password)
		if valid_user:
			user = kwargs['serializer_class'](user)
			return module.Response({"message": "success", "data": user.data}, status=module.status.HTTP_200_OK)
		else:
			return module.Response({"message": "Invalid Credentials", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
	except Exception as e:
		return module.Response({"message": str(e), "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

def send_reset_password_otp(**kwargs):
	try:
		kwargs["email"] = kwargs["email"].lower()

		if not module.User.objects.filter(email=kwargs["email"]).exists():
			return  module.Response({"message": "No account associated with the following email address.", "data": None}, status=module.status.HTTP_404_NOT_FOUND)
		
		user = module.User.objects.get(email=kwargs["email"])
		response = module.send_otp(email=kwargs["email"], user_name=user.name, otp_type="reset_password")
		if response["message"] == "success":
			return  module.Response(response, status=module.status.HTTP_200_OK)
		else:
			return  module.Response(response, status=module.status.HTTP_500_INTERNAL_SERVER_ERROR)
	except Exception as e:
		return module.Response({"message": str(e), "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

def reset_password(**kwargs):
	try:
		kwargs["email"] = kwargs["email"].lower()

		if not module.User.objects.filter(email=kwargs["email"]).exists():
			return  module.Response({"message": "No account associated with the following email address.", "data": None}, status=module.status.HTTP_404_NOT_FOUND)
		
		try:
			module.password_validation.validate_password(kwargs['password']) # Password validation: weather it is weak or strong
		except Exception as e:
			return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
		
		kwargs['password'] = module.make_password(kwargs['password']) # Hashing password
		
		user = module.User.objects.get(email=kwargs["email"])
		
		user = kwargs['serializer_class'](data=kwargs, instance=user ,partial=True)
		if user.is_valid():
			user.save()
			return module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
		else:
			return module.Response({"message": user.errors, "status": None}, status=module.status.HTTP_400_BAD_REQUEST)
	except Exception as e:
		return module.Response({"message": str(e), "status": None}, status=module.status.HTTP_400_BAD_REQUEST)

def update_password(**kwargs):
	try:
		user = module.User.objects.get(email=kwargs["email"])
		valid_user = module.check_password(kwargs["old_password"], user.password)
		
		if not valid_user:
			return module.Response({"message": "Invalid Old Password", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
		
		if kwargs["old_password"] == kwargs["new_password"]:
			return module.Response({"message": "New password cannot be same as old password.", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
		
		try:
			module.password_validation.validate_password(kwargs['new_password']) # Password validation: weather it is weak or strong
		except Exception as e:
			return module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
		kwargs['password'] = module.make_password(kwargs['new_password']) # Hashing password
		
		user = kwargs['serializer_class'](data=kwargs, instance=user)
		if user.is_valid():
			user.save()
			return module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
		else:
			return module.Response({"message": user.errors, "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
	except Exception as e:
		return module.Response({"message": str(e), "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

def social_login(**kwargs):
	try:
		kwargs["email"] = kwargs["email"].lower()

		try:
			user = module.User.objects.get(Q(email=kwargs["email"]))
		except:
			user = module.User(email=kwargs["email"],social_token=kwargs["social_token"],login_type=kwargs["login_type"])
			user.name = kwargs['name'] if kwargs.get('name') else ""
			user.save()

		user.social_token = kwargs["social_token"]
		user.login_type = kwargs["login_type"]
		user.save()

		user = kwargs['serializer_class'](user)
		return module.Response({"message": "success", "data": user.data}, status=module.status.HTTP_200_OK)

	except Exception as e:
		return module.Response({"message": str(e), "data": None}, status=module.status.HTTP_400_BAD_REQUEST)