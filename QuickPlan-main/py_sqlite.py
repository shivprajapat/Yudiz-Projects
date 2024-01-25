import sqlite3
from faker import Faker
import random
import json

fake = Faker()

con = sqlite3.connect('db.sqlite3')

print("Opened database successfully")

def sql_fetch(con):
    cursorObj = con.cursor()
    cursorObj.execute('SELECT name from sqlite_master where type= "table"')
    print(cursorObj.fetchall())
# sql_fetch(con)

def print_activities():
    activity_list = con.execute("SELECT * from common_app_activity")
    names = [description[0] for description in activity_list.description]
    print("Fields Names: ", names, "\n")
    for activity in activity_list:
        print(activity, "\n")
# print_activities()

def add_fake_entiries(count):
    id_counter = 0
    ac_image_link = "https://wallpaperaccess.com/full/1771271.jpg"
    res_image_link = "https://images7.alphacoders.com/379/thumb-1920-379773.jpg"
    activity_type_list = ["activity", "restaurant"]
    resident_permit_list = ["tourist", "resident", "any"]
    relationship_status_list = ["S", "R", "P", "SR", "RP", "SRP", "SP"]
    mood_list = ['ASFR', 'AS', 'AF', 'AR', 'SF', 'SR', 'FR', 'SFR', 'AFR', 'ASR', 'ASF', 'A', 'S', 'F', 'R']
    price_list = [0,1,1,1,1]
    price_range = [100.0, 150.0, 200.0, 250.0, 300.0, 350.0, 400.0, 450.0, 500.0, 550.0, 600.0, 650.0, 700.0, 750.0, 800.0, 850.0, 900.0, 950.0, 1000.0]
    activity_time = json.dumps({"Monday": ["10:00-12:00","13:00-15:00","20:00-23:59"],"Tuesday": ["10:00-20:00"],"Wednesday": ["10:00-20:00"],"Thursday": ["10:00-20:00"],"Friday": ["10:00-20:00"],"Saturday": ["10:00-20:00"],"Sunday": ["10:00-20:00"]})
    for i in range(count):
        activity_type_ = random.choice(activity_type_list)
        image_link = ac_image_link if activity_type_ == "activity" else res_image_link
        id_counter+=1
        data = (id_counter, fake.name(), image_link, activity_type_, 0.0 if random.choice(price_list) == 0 else float(random.choice(price_range)), float(fake.latitude()), float(fake.longitude()), random.choice(resident_permit_list), random.choice(mood_list), fake.address(), True, activity_time, random.choice(relationship_status_list), 0)
        print(data)
        con.execute(f"INSERT INTO common_app_activity (id, activity_name, thumbnail_image, activity_type, activity_amount, latitude, longitude, resident_permit, activity_mood, address, active_status, activity_time, relationship_status, age_limit) \
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data);

con.execute("DELETE FROM common_app_activity;")
print("Records deleted successfully")

count=1000
add_fake_entiries(count)
print(f"{count} Records created successfully")



con.commit()
con.close()

