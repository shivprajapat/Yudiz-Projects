from common_app import modules as module

def send_verification_otp(**kwargs):
	try:
		kwargs["email"] = kwargs["email"].lower()

		if module.Admin.objects.filter(email=kwargs["email"]).exists():
			return  module.Response({"message": "Admin already exists with the following email.", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
			
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

		if module.Admin.objects.filter(email=kwargs["email"]).exists():
			return  module.Response({"message": "Admin already exists with the following email.", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
		
		admin = kwargs['serializer_class'](data=kwargs)
		if admin.is_valid():
			admin.save()
			return module.Response({"message": "success", "data": admin.data}, status=module.status.HTTP_201_CREATED)
		else:
			return module.Response({"message": admin.errors, "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
	except Exception as e:
			return module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

def login(**kwargs):
	try:
		kwargs["email"] = kwargs["email"].lower()

		if not module.Admin.objects.filter(email=kwargs["email"]).exists():
			return  module.Response({"message": "No account associated with the following email address.", "data": None}, status=module.status.HTTP_404_NOT_FOUND)

		admin = module.Admin.objects.get(email=kwargs["email"])

		valid_admin = module.check_password(kwargs["password"], admin.password)
		if valid_admin:
			admin = kwargs['serializer_class'](admin)
			return module.Response({"message": "success", "data": admin.data}, status=module.status.HTTP_200_OK)
		else:
			return module.Response({"message": "Invalid Credentials", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
	except Exception as e:
		return module.Response({"message": str(e), "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

def send_reset_password_otp(**kwargs):
	try:
		kwargs["email"] = kwargs["email"].lower()

		if not module.Admin.objects.filter(email=kwargs["email"]).exists():
			return  module.Response({"message": "No account associated with the following email address.", "data": None}, status=module.status.HTTP_404_NOT_FOUND)
		
		response = module.send_otp(email=kwargs["email"], otp_type="reset_password")
		if response["message"] == "success":
			admin = module.Admin.objects.get(email=kwargs["email"])
			admin.otp = response["data"]["otp"]
			admin.save()
			return  module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
		else:
			return  module.Response(response, status=module.status.HTTP_500_INTERNAL_SERVER_ERROR)
	except Exception as e:
		return module.Response({"message": str(e), "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

def reset_password(**kwargs):
	try:
		kwargs["email"] = kwargs["email"].lower()

		if not module.Admin.objects.filter(email=kwargs["email"]).exists():
			return  module.Response({"message": "No account associated with the following email address.", "data": None}, status=module.status.HTTP_404_NOT_FOUND)
		
		admin = module.Admin.objects.get(email=kwargs["email"])

		valid_otp = admin.otp and admin.otp == kwargs["otp"]
		if not valid_otp:
			return  module.Response({"message": "Invalid OTP", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
		
		# resetting the otp blank the moment it gets valid
		admin.otp = ""
		admin.save()

		try:
			module.password_validation.validate_password(kwargs['password']) # Password validation: weather it is weak or strong
		except Exception as e:
			return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
		
		kwargs['password'] = module.make_password(kwargs['password']) # Hashing password
				
		admin = kwargs['serializer_class'](data=kwargs, instance=admin ,partial=True)
		if admin.is_valid():
			admin.save()
			return module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
		else:
			return module.Response({"message": admin.errors, "status": None}, status=module.status.HTTP_400_BAD_REQUEST)
	except Exception as e:
		return module.Response({"message": str(e), "status": None}, status=module.status.HTTP_400_BAD_REQUEST)

def update_password(**kwargs):
	try:
		admin = module.Admin.objects.get(email=kwargs["email"])
		valid_admin = module.check_password(kwargs["old_password"], admin.password)
		
		if not valid_admin:
			return module.Response({"message": "Invalid Old Password", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
		
		if kwargs["old_password"] == kwargs["new_password"]:
			return module.Response({"message": "New password cannot be same as old password.", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
		
		try:
			module.password_validation.validate_password(kwargs['new_password']) # Password validation: weather it is weak or strong
		except Exception as e:
			return module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
		kwargs['password'] = module.make_password(kwargs['new_password']) # Hashing password
		
		admin = kwargs['serializer_class'](data=kwargs, instance=admin)
		if admin.is_valid():
			admin.save()
			return module.Response({"message": "success", "data": None}, status=module.status.HTTP_200_OK)
		else:
			return module.Response({"message": admin.errors, "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
	except Exception as e:
		return module.Response({"message": str(e), "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

def get_admin(**kwargs):
	try:
		admin = module.Admin.objects.get(email=kwargs["email"])
		admin = kwargs["serializer_class"](admin)
		return module.Response({"message": "success", "data": admin.data}, status=module.status.HTTP_200_OK)
	except Exception as e:
		return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)

def update_admin_profile(**kwargs):
	try:
		admin = module.Admin.objects.get(email=kwargs["email"])
		admin = kwargs["serializer_class"](data = kwargs, instance=admin, partial=True)
		if admin.is_valid():
			admin.save()
			return module.Response({"message": "success", "data": admin.data}, status=module.status.HTTP_200_OK)
		else:
			return module.Response({"message": admin.errors, "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
	except Exception as e:
		return  module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)