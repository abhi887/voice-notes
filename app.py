from flask import Flask,render_template,request,jsonify,redirect
from flask_cors import CORS, cross_origin
from boxsdk import OAuth2,Client
from datetime import datetime,date
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session,sessionmaker,Session

app=Flask(__name__)
CORS(app)
app.static_folder='static'
app.template_folder='templates'

# Postgres creds
DATABASE_URL="postgres://iaurlzwcbfssqk:cdfd062ef3dbb380db2dcbf3a89c77e1035635548a97243af8a2b2abb07386ad@ec2-50-17-21-170.compute-1.amazonaws.com:5432/d59ehmsort29h0"
engine=create_engine(DATABASE_URL)
db=scoped_session(sessionmaker(engine))

# Box-api configs
auth=OAuth2(access_token='nmM2wkCLb1vTwtCw006M7Lo8wjemjUTp',client_id='u4rry5nr3plw3tmkgq3iwcgwyc9via1g',client_secret='')
client=Client(auth)

@app.route("/")
def index():
    # return ("setup successful !")
    tmp = [i for i in client.folder(0).get_items()]
    for i in tmp:
        print(i.id)
        print(client.file(i.id).get().get_embed_url())
        # print(dir(client.file(i.id).get()))
    # return jsonify([i for i in tmp])
    return jsonify(client.folder(0).get_items())


@app.route("/addnote",methods=["POST","GET"])
def addnote():
    blob=request.form.get("blob")
    user=request.form.get("user")
    name=request.form.get("name")
    # print(f"form = {[i for i in request.form.keys()]}")
    print(f"blob = {blob}")
    
    fileName =  date.today().strftime("%d_%m_%y") + "-" + datetime.now().time().strftime("%H_%M_%S") + ".mp3"
    
    
    tempNote = open(fileName,'w')
    tempNote.write(blob)
    tempNote.close()

    # print("error in creating file")
    # return jsonify("error in creating file")


    noteid = client.folder(0).upload(fileName)

    # print("error in uploading file")
    # return jsonify("error in uploading file")


    db.execute(f"insert into vnotes values({noteid.id},{name},{user})")

    # print("error in creating record")
    # return jsonify("error in creating record")

    # print()
    return jsonfiy("File uploded !")


    # try:
    #     tempNote = open(fileName)
    #     tempNote.write(blob)
    #     tempNote.close()
    # except:
    #     print("error in creating file")
    #     return jsonify("error in creating file")
    
    # try:
    #     noteid = client.folder(0).upload(fileName)
    # except:
    #     print("error in uploading file")
    #     return jsonify("error in uploading file")
    
    # try:
    #     db.execute(f"insert into vnotes values({noteid},{name},{user})")
    # except:
    #     print("error in creating record")
    #     return jsonify("error in creating record")

    # # print()
    # return jsonfiy("File uploded !")
