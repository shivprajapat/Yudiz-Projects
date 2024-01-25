from common_app import modules as module

def update_user_profile(**kwargs):
	try:
		user = module.User.objects.get(email=kwargs["email"])
		kwargs["user"] = user.id
		
		# activity priority saving
		if kwargs.get('activity_priority'):
			if module.UserPriority.objects.filter(user_id=user.id).exists():
				user_priority = module.UserPriority.objects.get(user_id=user.id)
				user_priority = module.UserPrioritySerializer(data=kwargs, instance=user_priority, partial=True)
				if user_priority.is_valid():
					user_priority.save()
				else:
					return module.Response({"message": user_priority.errors, "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
			else:
				user_priority = module.UserPrioritySerializer(data=kwargs)
				if user_priority.is_valid():
					user_priority.save()
				else:
					return module.Response({"message": user_priority.errors, "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
				
		# to update user name
		if kwargs.get('name'):
			user.name = kwargs['name']
			user.save()

		if kwargs.get("children_info") is not None:
			kwargs["children_info"] = str(kwargs["children_info"])
		
		if module.UserProfile.objects.filter(user_id=user.id).exists():
			user_profile = module.UserProfile.objects.get(user_id=user.id)
			user_profile = kwargs['serializer_class'](data=kwargs, instance=user_profile, partial=True)
		else:
			user_profile = kwargs['serializer_class'](data=kwargs)
		if user_profile.is_valid():
			user_profile.save()
			return module.Response({"message": "success", "data": user_profile.data}, status=module.status.HTTP_200_OK)
		else:
			return module.Response({"message": user_profile.errors, "data": None}, status=module.status.HTTP_400_BAD_REQUEST)
	except Exception as e:
			return module.Response({"message": f"{e}", "data": None}, status=module.status.HTTP_400_BAD_REQUEST)