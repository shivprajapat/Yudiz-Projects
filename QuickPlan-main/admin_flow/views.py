from django.shortcuts import redirect, render
from django.contrib import messages
from django.views.decorators.cache import cache_control
from django.contrib.sites.shortcuts import get_current_site
from common_app import modules as module
from admin_flow import auth
from rest_framework.views import APIView
from common_app.models import Activity
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from common_app.models import FAQ, CMS
import pandas as pd
import os
from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import resolve_url
import time
from django.http import HttpResponseRedirect
import json

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def login(request):
    if "user" in request.session and module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("index")
    user_email = request.GET.get('userEmail')
    user_password = request.GET.get('userPassword')
    
    if request.method == "POST":
        email_ = request.POST.get("loginUsername")
        email = email_.lower() if email_ else email_
        password = request.POST.get("loginPassword")

        if module.Admin.objects.filter(email=email).exists():
            admin = module.Admin.objects.get(email=email)
            valid_admin = module.check_password(password, admin.password)
            if valid_admin:
                request.session["user"] = email
                return redirect("index")
        messages.error(request, "Invalid Credentials.")
        return redirect(f"{resolve_url('login')}?userEmail={email_}&userPassword={password}")        
    return render(request, "login.html", {"user_email":user_email, "user_password":user_password})

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def index(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    admin = module.Admin.objects.get(email=request.session["user"])
    dashboard = {"registerd_users":module.User.objects.all().count(), "activities_count": Activity.objects.all().count(), 
                 "active_users":module.User.objects.filter(active_status=True).count(), "inactive_users":module.User.objects.filter(active_status=False).count(), 
                 "active_activities":Activity.objects.filter(active_status=True).count(), "inactive_activities":Activity.objects.filter(active_status=False).count()}
    try:
        dashboard["active_users_per"] = (dashboard["active_users"] / dashboard["registerd_users"]) * 100
        dashboard["inactive_users_per"] = (dashboard["inactive_users"] / dashboard["registerd_users"]) * 100
    except:
        dashboard["active_users_per"] = 0
        dashboard["inactive_users_per"] = 0

    try:
        dashboard["active_activities_per"] = (dashboard["active_activities"] / dashboard["activities_count"]) * 100
        dashboard["inactive_activities_per"] = (dashboard["inactive_activities"] / dashboard["activities_count"]) * 100
    except:
        dashboard["active_activities_per"] = 0
        dashboard["inactive_activities_per"] = 0

    return render(request, "index.html", {"admin":admin, "dashboard":dashboard})

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def logout(request):
    if "user" in request.session and module.Admin.objects.filter(email=request.session["user"]).exists():
       del request.session["user"]
    return redirect("login")

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def forgot_password(request):
    if "user" in request.session and module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("index")
    
    entered_email = request.GET.get('email')
    sent = request.GET.get("sent")

    if request.method == "POST":
        email_ = request.POST.get("registerEmail")
        email = email_.lower() if email_ else email_

        if not module.Admin.objects.filter(email=email).exists():
            messages.error(request, "No account associated with the given email address.")
            return redirect(f"{resolve_url('forgot-password')}?email={email_}")
        
        try:
            otp = module.get_random_int()
            token = module.generate_token(payload={"email": email, "otp": otp})
            subject = "Reset Password - QuickPlan"
            base_url = get_current_site(request)
            link = f"https://{base_url}{resolve_url('verify-token')}?token={token}"
            to = [f"{email}",]
            
            admin = module.Admin.objects.get(email=email)
            admin.otp = otp
            admin.save()
            
            # create the email, and attach the HTML version as well.
            html_content = module.render_to_string('reset_email.html', {'admin_name':admin.name, "reset_link":link}) # render with dynamic value
            text_content = module.strip_tags(html_content) # Strip the html tag. So people can see the pure text at least.
            msg = module.EmailMultiAlternatives(subject, text_content, module.settings.EMAIL_HOST_USER, to)
            msg.attach_alternative(html_content, "text/html")
            msg.send()

            # module.send_mail(subject, message, module.settings.EMAIL_HOST_USER, to)
            messages.success(request, "Reset Link has been sent successfully!")
            return redirect(f"{resolve_url('forgot-password')}?email={email_}&sent=true")
        except Exception as e:
            messages.error(request, "Sorry, We coudn't process your request at this moment.")
            return redirect(f"{resolve_url('forgot-password')}?email={email_}")
    return render(request, "forgot-pass.html", {"entered_email":entered_email, "sent":sent})

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def verify_token(request):
    if "user" in request.session and module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("index")
    
    token = request.GET.get("token")
    if token:
        try:
            payload = module.decode_token(token=token)
            if module.Admin.objects.filter(email=payload["email"]).exists():
                admin = module.Admin.objects.get(email=payload["email"])
                if admin.otp == str(payload["otp"]):
                    request.session["reset_password_account"] = payload["email"]
                    return redirect("reset-password")
        except Exception as e:
            pass
    messages.error(request, "Invalid Verification Link.")
    return redirect("forgot-password")

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def reset_password(request):
    if "user" in request.session and module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("index")
    
    if "reset_password_account" not in request.session:
        return redirect("login")
    
    password_ = request.GET.get('password')
    confirm_password_ = request.GET.get('confirmPassword')

    if request.method == "POST":
        password =  request.POST.get("Password")
        confirm_password = request.POST.get("confirmPassword")
        
        if password != confirm_password:
            messages.error(request, "Password doesn't match.")
            return redirect(f"{resolve_url('reset-password')}?password={password}&confirmPassword={confirm_password}")
        try:
            module.password_validation.validate_password(password) # Password validation: weather it is weak or strong
        except:
            messages.error(request, "Your password is too weak.")
            return redirect(f"{resolve_url('reset-password')}?password={password}&confirmPassword={confirm_password}")
        
        password = module.make_password(password)
        admin = module.Admin.objects.get(email=request.session["reset_password_account"])
        admin.password = password
        admin.otp = ""
        admin.save()
        request.session["user"] = admin.email
        messages.success(request, "Password has been reset!")
        return redirect("index")
    return render(request, "reset-pass.html", {"password":password_, "confirm_password":confirm_password_})

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def my_account(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    admin = module.Admin.objects.get(email=request.session["user"])
    return render(request, "my-account.html", {"admin":admin})

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def edit_profile(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    admin = module.Admin.objects.get(email=request.session["user"])

    if request.method == "POST":
        email = request.POST.get("email")
        name = request.POST.get("name")
        email = email.lower() if email else email
        name = name if name else ""
        image = request.FILES.get("image")
        
        try: 
            module.validate_email(email) # Email validation: regex validation for email
        except Exception as e:
            messages.error(request, "Invalid email address.")
            return  redirect("edit-profile")

        if module.Admin.objects.filter(email=email).exists() and request.session["user"] != email:
            messages.error(request, "Email address is already in use.")
            return redirect("edit-profile")
        
        #validating image format
        valid_extensions = ["jpg","jpeg","png"]
        if image and image.name.split(".")[-1].lower() not in valid_extensions:
            messages.error(request, "Invalid image format.")
            return redirect("edit-profile")
        elif image and image.name.split(".")[-1].lower() in valid_extensions:
            img_name = image.name.replace(" ","_")
            img_name = f"{admin.id}-{img_name}"
            image_uploaded = module.upload_to_s3(name= img_name, image= image)
            if not image_uploaded:
                messages.error(request, "Unable to upload image.")
                return redirect('index')
            admin.profile_pic = image_uploaded

        admin.name = name
        admin.email = email
        admin.save()
        request.session["user"] = admin.email

        messages.success(request, "Profile updated successfully.")
        return redirect("index")
    return render(request, "edit-profile.html", {"admin":admin})

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def customer_management(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    admin = module.Admin.objects.get(email=request.session["user"])
    
    search = request.GET.get("search")
    if search:
        users = module.User.objects.filter(name__contains=search).order_by('-id')
    else:
        users = module.User.objects.all().order_by('-id')
    
    try:
        size = request.GET["size"].strip()
        if size and size.isdigit():
            page_size = int(size)
            if page_size == 0:
                page_size = 10
        else:
            page_size = 10
    except:
        page_size = 10
    
    paginator = Paginator(users, page_size)
    users_page = paginator.page(1) # default page number
    
    if request.GET.get('page'):
        try:
            page_no = int(request.GET['page'])
            if page_no > paginator.num_pages:
                users_page = paginator.page(paginator.num_pages)
            elif page_no < 1:
                users_page = paginator.page(1)
            else:
                users_page = paginator.page(page_no)
        except:
            messages.error(request, "Invalid page.")
            return redirect('customer-management')

    users = module.UserSerializer(users_page, many=True).data
    return render(request, "customer-management.html", {"admin":admin, "users":users, "users_page":users_page, "search":search, "page_size":page_size})

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def update_user_status(request, id):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    try:
        user = module.User.objects.get(id=id)
        if user.active_status:
            user.active_status = False
        else:
            user.active_status = True
        user.save()
    except Exception as e:
        messages.error(request, "Invalid user.")

    search = request.GET.get("search")
    if search:
        return redirect(f"{resolve_url('customer-management')}?page={request.GET.get('page')}&search={search}&size={request.GET.get('size')}")
    else:
        return redirect(f"{resolve_url('customer-management')}?page={request.GET.get('page')}&size={request.GET.get('size')}")

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def delete_user(request, id):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    try:
        user = module.User.objects.get(id=id)
        user.delete()
        messages.success(request, "User deleted successfully!")
    except Exception as e:
        messages.error(request, "Invalid user.")
    search = request.GET.get("search")
    if search:
        return redirect(f"{resolve_url('customer-management')}?page={request.GET.get('page')}&search={search}&size={request.GET.get('size')}")
    else:
        return redirect(f"{resolve_url('customer-management')}?page={request.GET.get('page')}&size={request.GET.get('size')}")

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def customer_detail(request, id):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    admin = module.Admin.objects.get(email=request.session["user"])
    try:
        user = module.User.objects.get(id=id)
        user = module.UserSerializer(user).data
        return render(request, "customer-detail.html", {"admin":admin, "user":user})
    except Exception as e:
        messages.error(request, "Invalid user.")
    return redirect("customer-management")

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def activity_management(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    
    if request.method == "POST":
        activity_sheet = request.FILES.get("acitivity_csv")
        
        if not activity_sheet or (activity_sheet and activity_sheet.name.split(".")[-1].lower() != "csv"):
            messages.error(request, "Invalid CSV.")
            return redirect('activity-management')
        
        sheet_name = activity_sheet.name.replace(" ","_")

        fs = FileSystemStorage()
        fs.save(sheet_name, activity_sheet)
        abs_file_path = f"media/{sheet_name}"

        data_frame = pd.read_csv(abs_file_path, encoding= 'unicode_escape', keep_default_na=False)

        # deleting previous activities as new ones will be saved
        previous_activities = Activity.objects.all()
        previous_activities.delete()
        
        def is_valid_time_format_str(str_input):
            try:
                str_input = str_input.replace("24:00","23:59")
                counter = 0
                def is_valid_time_format(time_str):
                    try:
                        time.strptime(time_str, '%H:%M')
                        return True
                    except ValueError:
                        return False
                for time_str in str_input.strip().split("-"):
                    if is_valid_time_format(time_str.strip()):
                        counter+=1
                if counter == 2:
                    return True
                else:
                    return False
            except:
                return False
            
        media_gallary = module.MediaGallary.objects.all()
        
        for row in data_frame.itertuples():
            try:
                activity_time = {
                    "Monday":[time_str.replace(" ","").replace("24:00","23:59") for time_str in row.monday.strip().split(",") if is_valid_time_format_str(time_str.strip())] if row.monday.strip() != "-" else [],
                    "Tuesday":[time_str.replace(" ","").replace("24:00","23:59") for time_str in row.tuesday.strip().split(",") if is_valid_time_format_str(time_str.strip())] if row.tuesday.strip() != "-" else [],
                    "Wednesday":[time_str.replace(" ","").replace("24:00","23:59") for time_str in row.wednesday.strip().split(",") if is_valid_time_format_str(time_str.strip())] if row.wednesday.strip() != "-" else [],
                    "Thursday":[time_str.replace(" ","").replace("24:00","23:59") for time_str in row.thursday.strip().split(",") if is_valid_time_format_str(time_str.strip())] if row.thursday.strip() != "-" else [],
                    "Friday":[time_str.replace(" ","").replace("24:00","23:59") for time_str in row.friday.strip().split(",") if is_valid_time_format_str(time_str.strip())] if row.friday.strip() != "-" else [],
                    "Saturday":[time_str.replace(" ","").replace("24:00","23:59") for time_str in row.saturday.strip().split(",") if is_valid_time_format_str(time_str.strip())] if row.saturday.strip() != "-" else [],
                    "Sunday":[time_str.replace(" ","").replace("24:00","23:59") for time_str in row.sunday.strip().split(",") if is_valid_time_format_str(time_str.strip())] if row.sunday.strip() != "-" else []
                }
                try:
                    if row.thumbnail_image.strip().lower().startswith('http'):
                        thumbnail_image = row.thumbnail_image.strip()
                    else:
                        thumbnail_image = media_gallary.get(name=row.thumbnail_image.strip()).img_url
                except:
                    thumbnail_image = row.thumbnail_image.strip()
                try:
                    if row.thumbnail_image_2.strip().lower().startswith('http'):
                        thumbnail_image_2 = row.thumbnail_image_2.strip()
                    else:
                        thumbnail_image_2 = media_gallary.get(name=row.thumbnail_image_2.strip()).img_url
                except:
                    thumbnail_image_2 = row.thumbnail_image_2.strip()
                restaurant_type_choices = {"w":"Walk-in", "r":"Reservation"}
                restaurant_type = restaurant_type_choices[row.restaurant_type.lower()] if row.restaurant_type.lower() == "w" or row.restaurant_type.lower() == "r" else ""
                new_activity = Activity.objects.create(activity_name=row.activity_name, thumbnail_image=thumbnail_image, thumbnail_image_2=thumbnail_image_2, activity_amount=row.activity_amount, 
                                                       activity_type=row.activity_type, activity_mood=row.activity_mood, activity_time=activity_time, relationship_status=row.relationship_status, 
                                                       resident_permit=row.resident_permit, address=row.address, latitude=row.latitude, longitude=row.longitude, age_limit=int(row.age), 
                                                       group_amount=int(row.group_amount), restaurant_type=restaurant_type, instagram=row.instagram, restaurant_menu=row.restaurant_menu, 
                                                       booking_reference=row.booking_reference, activity_description=row.activity_description)
                new_activity.save()
            except Exception as e:
                print("Exception while creating activity record in the Activity table:", e)
        os.remove(abs_file_path) # removing csv file as there is no further need
        messages.success(request, "CSV uploaded successfully.")
        return redirect('activity-management')
    
    admin = module.Admin.objects.get(email=request.session["user"])

    search = request.GET.get("search")
    if search:
        activities = Activity.objects.filter(Q(activity_name__contains=search) | Q(activity_type__contains=search) | Q(activity_mood__contains=search) | Q(address__contains=search)).order_by('-id')
    else:
        activities = Activity.objects.all().order_by('-id')
    
    try:
        size = request.GET["size"].strip()
        if size and size.isdigit():
            page_size = int(size)
            if page_size == 0:
                page_size = 10
        else:
            page_size = 10
    except:
        page_size = 10

    paginator = Paginator(activities, page_size)
    activity_page = paginator.page(1) # default page number
    
    if request.GET.get('page'):
        try:
            page_no = int(request.GET['page'])
            if page_no > paginator.num_pages:
                activity_page = paginator.page(paginator.num_pages)
            elif page_no < 1:
                activity_page = paginator.page(1)
            else:
                activity_page = paginator.page(page_no)
        except:
            messages.error(request, "Invalid page.")
            return redirect('activity-management')
    return render(request, "activity-management.html", {"admin":admin, "activities":activity_page, "search":search, "page_size":page_size})

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def delete_activity(request, id):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    try:
        activity = Activity.objects.get(id=id)
        activity.delete()
        messages.success(request, "Activity deleted successfully!")
    except Exception as e:
        messages.error(request, "Invalid activity.")
    search = request.GET.get("search")
    if search:
        return redirect(f"{resolve_url('activity-management')}?page={request.GET.get('page')}&search={search}&size={request.GET.get('size')}")
    else:
        return redirect(f"{resolve_url('activity-management')}?page={request.GET.get('page')}&size={request.GET.get('size')}")

# update_activity_status
@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def update_activity_status(request, id):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    try:
        activity = Activity.objects.get(id=id)
        if activity.active_status:
            activity.active_status = False
        else:
            activity.active_status = True
        activity.save()
    except Exception as e:
        messages.error(request, "Invalid activity.")
    search = request.GET.get("search")
    if search:
        return redirect(f"{resolve_url('activity-management')}?page={request.GET.get('page')}&search={search}&size={request.GET.get('size')}")
    else:
        return redirect(f"{resolve_url('activity-management')}?page={request.GET.get('page')}&size={request.GET.get('size')}")

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def activity_detail(request, id):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    admin = module.Admin.objects.get(email=request.session["user"])
    try:
        activity = Activity.objects.get(id=id)
    except Exception as e:
        messages.error(request, "Invalid activity.")
        return redirect("activity-management")
    
    media_gallary =  module.MediaGallary.objects.all().order_by('-id')
    serialized_media_gallry = module.MediaSerializer(media_gallary, many=True)
    return render(request, "activity-detail.html", {"admin":admin, "activity":activity, "media_gallary":media_gallary, "json_media_gallary":json.dumps(serialized_media_gallry.data)})

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def faq(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    admin = module.Admin.objects.get(email=request.session["user"])
    search = request.GET.get("search")
    if search:
        faqs = FAQ.objects.filter(question__contains=search).order_by('-id')
    else:
        faqs = FAQ.objects.all().order_by('-id')

    try:
        size = request.GET["size"].strip()
        if size and size.isdigit():
            page_size = int(size)
            if page_size == 0:
                page_size = 10
        else:
            page_size = 10
    except:
        page_size = 10

    paginator = Paginator(faqs, page_size)
    faqs_page = paginator.page(1) # default page number
    
    if request.GET.get('page'):
        try:
            page_no = int(request.GET['page'])
            if page_no > paginator.num_pages:
                faqs_page = paginator.page(paginator.num_pages)
            elif page_no < 1:
                faqs_page = paginator.page(1)
            else:
                faqs_page = paginator.page(page_no)
        except:
            messages.error(request, "Invalid page.")
            return redirect('faq')
    return render(request, "faqs.html", {"admin":admin, "faqs":faqs_page, "search":search, "page_size":page_size})

@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def delete_faq(request, id):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    try:
        faq = FAQ.objects.get(id=id)
        faq.delete()
        messages.success(request, "FAQ deleted successfully!")
    except Exception as e:
        messages.error(request, "Invalid FAQ.")
    search = request.GET.get("search")
    if search:
        return redirect(f"{resolve_url('faq')}?page={request.GET.get('page')}&search={search}&size={request.GET.get('size')}")
    else:
        return redirect(f"{resolve_url('faq')}?page={request.GET.get('page')}&size={request.GET.get('size')}")

def edit_faq(request, id):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    
    admin = module.Admin.objects.get(email=request.session["user"])
    faq = FAQ.objects.filter(id=id)
    if not faq.exists():
        messages.error(request, "Invalid FAQ.")
        return redirect(f"{resolve_url('faq')}?page={request.GET['page']}")
    
    if request.method == "POST":
        question = request.POST.get("question")
        answer = request.POST.get("answer")

        if not question or not answer:
            messages.error(request, "Invalid data.")
            return redirect(f"{resolve_url('faq')}?page={request.GET['page']}")

        faq.update(question=question, answer=answer)
        messages.success(request, "FAQ updated successfully!")
        return redirect(f"{resolve_url('faq')}?page={request.GET['page']}")
    return render(request, "edit-faq.html", {"admin":admin, "faq":FAQ.objects.get(id=id)})

def add_faq(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    
    admin = module.Admin.objects.get(email=request.session["user"])
    if request.method == "POST":
        question = request.POST.get("question")
        answer = request.POST.get("answer")

        if not question or not answer:
            messages.error(request, "Invalid data.")
            return redirect('faq')
        faq = FAQ.objects.create(question=question, answer=answer)
        faq.save()
        messages.success(request, "FAQ added successfully!")
        return redirect('faq')
    return render(request, "add-faq.html", {"admin":admin})

def faq_detail(request, id):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    
    admin = module.Admin.objects.get(email=request.session["user"])
    try:
        faq = FAQ.objects.get(id=id)
    except:
        messages.error(request, "Invalid FAQ.")
        return redirect('faq')
    return render(request, "faq-detail.html", {"admin":admin, "faq":faq})

def cms(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    admin = module.Admin.objects.get(email=request.session["user"])
    cms  = CMS.objects.first()
    return render(request, "cms-management.html", {"admin":admin, "cms":cms})

def edit_about_us(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    
    admin = module.Admin.objects.get(email=request.session["user"])
    cms  = CMS.objects.first()
    if request.method == "POST":
        about_us = request.POST.get("about_us")
        about_us_img = request.FILES.get("about_us_img")

        if not about_us:
            messages.error(request, "Invalid data.")
            return redirect("cms")
        
        #validating image format
        valid_extensions = ["jpg","jpeg","png"]
        if about_us_img and about_us_img.name.split(".")[-1].lower() not in valid_extensions:
            messages.error(request, "Invalid image format.")
            return redirect("cms")
        elif about_us_img and about_us_img.name.split(".")[-1].lower() in valid_extensions:
            img_name = about_us_img.name.replace(" ","_")
            img_name = f"about_us_img_{img_name}"
            image_uploaded = module.upload_to_s3(name= img_name, image= about_us_img)
            if not image_uploaded:
                messages.error(request, "Unable to upload image.")
                return redirect('cms')
            cms.about_us_img = image_uploaded

        cms.about_us = about_us
        cms.save()

        messages.success(request, "CMS updated successfully!")
        return redirect("cms")
    
    return render(request, "edit-about-us.html", {"admin":admin, "cms":cms})

def view_about_us(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    
    admin = module.Admin.objects.get(email=request.session["user"])
    cms  = CMS.objects.first()
    return render(request, "view-about-us.html", {"admin":admin, "cms":cms})

def edit_term_and_condition(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    
    admin = module.Admin.objects.get(email=request.session["user"])
    cms  = CMS.objects.first()

    if request.method == "POST":
        t_and_c = request.POST.get("term_and_condition")
        if not t_and_c:
            messages.error(request, "Invalid data.")
            return redirect("cms")
        cms.term_and_condition = t_and_c
        cms.save()
        messages.success(request, "T&C updated successfully!")
        return redirect("cms")
    return render(request, "edit-term-and-condition.html", {"admin":admin, "cms":cms})

def view_term_and_condition(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    
    admin = module.Admin.objects.get(email=request.session["user"])
    cms  = CMS.objects.first()
    return render(request, "view-term-and-condition.html", {"admin":admin, "cms":cms})

def edit_privacy_policy(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    
    admin = module.Admin.objects.get(email=request.session["user"])
    cms  = CMS.objects.first()

    if request.method == "POST":
        privacy_policy = request.POST.get("privacy_policy")
        if not privacy_policy:
            messages.error(request, "Invalid data.")
            return redirect("cms")
        cms.privacy_policy = privacy_policy
        cms.save()
        messages.success(request, "Privacy Policy updated successfully!")
        return redirect("cms")
    return render(request, "edit-privacy-policy.html", {"admin":admin, "cms":cms})

def view_privacy_policy(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    
    admin = module.Admin.objects.get(email=request.session["user"])
    cms  = CMS.objects.first()
    return render(request, "view-privacy-policy.html", {"admin":admin, "cms":cms})

def change_password(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    
    admin = module.Admin.objects.get(email=request.session["user"])

    current_password_ = request.GET.get("currentPassword") 
    new_password_ = request.GET.get("newPassword")
    confirm_password_ = request.GET.get("confirmPassword")

    if request.method == "POST":
        current_password = request.POST.get("current-password")
        new_password = request.POST.get("new-password")
        confirm_password = request.POST.get("confirm-password")

        valid_admin = module.check_password(current_password, admin.password)
        if not valid_admin:
            messages.error(request, "Invalid current password.")
            return redirect(f"{resolve_url('change-password')}?currentPassword={current_password}&newPassword={new_password}&confirmPassword={confirm_password}")
        if new_password != confirm_password:
            messages.error(request, "Password doesn't match.")
            return redirect(f"{resolve_url('change-password')}?currentPassword={current_password}&newPassword={new_password}&confirmPassword={confirm_password}")
        try:
            module.password_validation.validate_password(new_password) # Password validation: weather it is weak or strong
        except:
            messages.error(request, "Password is too weak.")
            return redirect(f"{resolve_url('change-password')}?currentPassword={current_password}&newPassword={new_password}&confirmPassword={confirm_password}")
        
        if new_password ==  current_password:
            messages.error(request, "New password cannot be same as current password.")
            return redirect(f"{resolve_url('change-password')}?currentPassword={current_password}&newPassword={new_password}&confirmPassword={confirm_password}")
        
        new_password = module.make_password(new_password) # Hashing password
        admin.password = new_password
        admin.save()
        
        messages.success(request, "Password changed successfully!")
        return redirect("index")
    return render(request, "change-password.html", {"admin":admin, "current_password":current_password_, "new_password":new_password_, "confirm_password":confirm_password_})

def media_gallary(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    
    admin = module.Admin.objects.get(email=request.session["user"])
    search = request.GET.get("search")

    if search:
        media_gallary = module.MediaGallary.objects.filter(name__contains=search).order_by('-id')
    else:
        media_gallary =  module.MediaGallary.objects.all().order_by('-id')

    try:
        size = request.GET["size"].strip()
        if size and size.isdigit():
            page_size = int(size)
            if page_size == 0:
                page_size = 10
        else:
            page_size = 10
    except:
        page_size = 10
    
    paginator = Paginator(media_gallary, page_size)
    media_gallary_page = paginator.page(1) # default page number
    
    if request.GET.get('page'):
        try:
            page_no = int(request.GET['page'])
            if page_no > paginator.num_pages:
                media_gallary_page = paginator.page(paginator.num_pages)
            elif page_no < 1:
                media_gallary_page = paginator.page(1)
            else:
                media_gallary_page = paginator.page(page_no)
        except:
            messages.error(request, "Invalid Media.")
            return redirect('media-gallary')
    return render(request, "media-gallary.html", {"admin":admin, "media_gallary":media_gallary_page, "search":search, "page_size":page_size})

def delete_media(request, id):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    try:
        media = module.MediaGallary.objects.get(id=id)
        module.delete_from_s3(media.name)
        media.delete()
        messages.success(request, "Media deleted successfully!")
    except Exception as e:
        messages.error(request, "Invalid Media.")
    search = request.GET.get("search")
    if search:
        return redirect(f"{resolve_url('media-gallary')}?page={request.GET.get('page')}&search={search}&size={request.GET.get('size')}")
    else:
        return redirect(f"{resolve_url('media-gallary')}?page={request.GET.get('page')}&size={request.GET.get('size')}")

def save_media(request):
    if request.method == "POST":
        images = request.FILES.getlist('images')
        valid_extensions = ["jpg","jpeg","png"]
        last_media = module.MediaGallary.objects.last()
        last_media_counter = 1 if not last_media else last_media.id + 1
        
        for image in images:
            #validating image format and uploading to s3
            if image and image.name.split(".")[-1].lower() in valid_extensions:
                img_name = f"media_{last_media_counter}.{image.name.split('.')[-1].lower()}"
                image_uploaded = module.upload_to_s3(name= img_name, image= image)
                if not image_uploaded:
                    print(f"Unable to upload image: {img_name}")
                else:
                    img = module.MediaGallary.objects.create(name=img_name, img_url=image_uploaded)
                    img.save()
                    last_media_counter+=1

        messages.success(request, "Media uploaded successfully!")
    return redirect("media-gallary")

def delete_multiple_faqs(request):
    if request.method == "POST":
        try:
            faq_array = request.POST["faq-array"]
            faq_array = [int(faq_id.strip()) for faq_id in faq_array.split(',')]
            faqs = FAQ.objects.filter(id__in=faq_array)
            faqs.delete()
            messages.success(request, "FAQs deleted successfully!")
        except Exception as e:
            print("Exception in function:delete_multiple_faqs:",e)
            messages.error(request,"Please select atleast one option to delete." )

    search = request.POST.get("search")
    if search:
        return redirect(f"{resolve_url('faq')}?page={request.POST.get('page')}&search={search}&size={request.POST.get('size')}")
    else:
        return redirect(f"{resolve_url('faq')}?page={request.POST.get('page')}&size={request.POST.get('size')}")

def delete_multiple_users(request):
    if request.method == "POST":
        try:
            users_array = request.POST["users-array"]
            users_array = [int(user_id.strip()) for user_id in users_array.split(',')]
            users = module.User.objects.filter(id__in=users_array)
            users.delete()
            messages.success(request, "Users deleted successfully!")
        except Exception as e:
            print("Exception in function:delete_multiple_users:",e)
            messages.error(request,"Please select atleast one option to delete." )

    search = request.POST.get("search")
    if search:
        return redirect(f"{resolve_url('customer-management')}?page={request.POST.get('page')}&search={search}&size={request.POST.get('size')}")
    else:
        return redirect(f"{resolve_url('customer-management')}?page={request.POST.get('page')}&size={request.POST.get('size')}")

def delete_multiple_activities(request):
    if request.method == "POST":
        try:
            activities_array = request.POST["activities-array"]
            activities_array = [int(activity_id.strip()) for activity_id in activities_array.split(',')]
            activities = Activity.objects.filter(id__in=activities_array)
            activities.delete()
            messages.success(request, "Activities deleted successfully!")
        except Exception as e:
            print("Exception in function:delete_multiple_activities:",e)
            messages.error(request,"Please select atleast one option to delete." )

    search = request.POST.get("search")
    if search:
        return redirect(f"{resolve_url('activity-management')}?page={request.POST.get('page')}&search={search}&size={request.POST.get('size')}")
    else:
        return redirect(f"{resolve_url('activity-management')}?page={request.POST.get('page')}&size={request.POST.get('size')}")

def delete_multiple_media(request):
    if request.method == "POST":
        try:
            media_array = request.POST["media-array"]
            media_array = [int(media_id.strip()) for media_id in media_array.split(',')]
            media = module.MediaGallary.objects.filter(id__in=media_array)
            for media_ in media:
                module.delete_from_s3(media_.name)
            media.delete()
            messages.success(request, "Media deleted successfully!")
        except Exception as e:
            print("Exception in function:delete_multiple_media:",e)
            messages.error(request,"Please select atleast one option to delete." )
            
    search = request.POST.get("search")
    if search:
        return redirect(f"{resolve_url('media-gallary')}?page={request.POST.get('page')}&search={search}&size={request.POST.get('size')}")
    else:
        return redirect(f"{resolve_url('media-gallary')}?page={request.POST.get('page')}&size={request.POST.get('size')}")

def upload_media(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    admin = module.Admin.objects.get(email=request.session["user"])
    return render(request, "upload-media.html", {"admin":admin})

def upload_activity_image(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    
    if request.method == "POST":
        activity_id = request.POST["activity_id"]
        image = request.FILES["image"]
        image_no = request.POST["image_no"]
        
        try:
            activity = Activity.objects.get(id=int(activity_id))
        except:
            messages.error(request, "Invalid Activity.")
            return redirect("activity-management")
        
        last_media = module.MediaGallary.objects.last()
        last_media_counter = 1 if not last_media else last_media.id + 1

        #validating image format
        valid_extensions = ["jpg","jpeg","png"]
        if image and image.name.split(".")[-1].lower() not in valid_extensions:
            messages.error(request, "Invalid Image Format.")
        elif image and image.name.split(".")[-1].lower() in valid_extensions:
            img_name = image.name.replace(" ","_")
            img_name = f"media_{last_media_counter}.{image.name.split('.')[-1].lower()}"
            image_uploaded = module.upload_to_s3(name= img_name, image=image)
            if not image_uploaded:
                messages.error(request, "Unable to upload image.")
        
            if image_no == "1":
                activity.thumbnail_image = image_uploaded
            elif image_no == "2":
                activity.thumbnail_image_2 = image_uploaded
            activity.save()

            img = module.MediaGallary.objects.create(name=img_name, img_url=image_uploaded)
            img.save()

        return HttpResponseRedirect('/admin/activity-detail/%d'%int(activity_id))
    
def link_media_image_to_activity(request):
    if "user" not in request.session or not module.Admin.objects.filter(email=request.session["user"]).exists():
        return redirect("login")
    
    activity_id = request.POST["activity_id"]
    media_id = request.POST["media_id"]
    image_no = request.POST["image_no"]

    try:
        activity = Activity.objects.get(id=int(activity_id))
    except:
        messages.error(request, "Invalid Activity.")
        return redirect("activity-management")
    
    try:
        media = module.MediaGallary.objects.get(id=int(media_id))
    except:
        messages.error(request, "Invalid Media.")
        return HttpResponseRedirect('/admin/activity-detail/%d'%int(activity_id))
    
    if image_no == "1":
        activity.thumbnail_image = media.img_url
    elif image_no == "2":
        activity.thumbnail_image_2 = media.img_url
    activity.save()

    return HttpResponseRedirect('/admin/activity-detail/%d'%int(activity_id))