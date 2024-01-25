from common_app import modules as module
import datetime
import boto3
from io import BytesIO
from PIL import Image

s3 = boto3.client("s3")

def generate_token(payload):
	 return module.jwt.encode(payload = payload, key = module.SECRET_KEY)

def decode_token(token):
	return module.jwt.decode(str(token), module.SECRET_KEY, algorithms="HS256")

def get_random_int():
    return module.random.randint(1111,9999)

def send_otp(email, user_name=None, otp_type=None):
    otp = get_random_int()

    subject = "Account Verification - QuickPlan" if otp_type == "verification" else "Reset Password - QuickPlan"
    to = [f"{email}",]
    
    try:
        # create the email, and attach the HTML version as well.
        html_content = module.render_to_string('otp_email.html', {'user_name':user_name, "otp":otp, "otp_type":otp_type}) # render with dynamic value
        text_content = module.strip_tags(html_content) # Strip the html tag. So people can see the pure text at least.
        msg = module.EmailMultiAlternatives(subject, text_content, module.settings.EMAIL_HOST_USER, to)
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        return {"message": "success", "data": {"otp":f"{otp}"}}
    except module.BadHeaderError:
        return {"message": "Invalid header found.", "data": None}

def get_current_time():
    return datetime.datetime.now() + datetime.timedelta(hours = 5.5) # adding time delta as the django is 5.5 hours ahead of server time

def upload_to_s3(name, image):
    file_name = name
    bucket_name = "quick-plan-bucket"

    # - - - - resize image
    img = Image.open(image)
    height = int(img.size[0]*0.35) if img.size[0] > 1000 else img.size[0]
    width = int(img.size[1]*0.35) if img.size[1] > 1000 else img.size[1]
    img = img.resize((height, width), Image.ANTIALIAS)

    img_format = image.name.split('.')[-1].upper()
    img_format = img_format if img_format != "JPG" else "JPEG"

    in_memory_file = BytesIO()
    img.save(in_memory_file, format=img_format)
    in_memory_file.seek(0)
    # - - - - - - - - -

    s3 = boto3.client('s3')
    try:
        s3.upload_fileobj(in_memory_file, bucket_name, file_name)
        return f"https://quick-plan-bucket.s3.eu-central-1.amazonaws.com/{file_name}"
    except Exception as e:
        print("Exception while uploading images to S3 bucket in function:upload_to_s3:", e)
        return False

def delete_from_s3(name):
     bucket_name = "quick-plan-bucket"
     try:
        client = boto3.client('s3')
        client.delete_object(Bucket= bucket_name, Key=name)
        return True
     except Exception as e:
        print("Exception while deleting images from S3 bucket in function:delete_from_s3:", e)
        return False
