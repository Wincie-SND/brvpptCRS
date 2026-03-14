class User:
    def __init__(self, userID, userName, userPassword, contactNum):
        self.__userID = userID
        self.__userName = userName
        self.__userPassword = userPassword
        self.__contactNum = contactNum

    #Getters
    def get_userID(self):
        return self.__userID

    def get_userName(self):
        return self.__userName

    def get_contact_number(self):
        return self.__contactNum

    #Setters
    def new_contact_number(self, new_contactNum):
        self.__contactNum = new_contactNum

    def new_password(self, newPassword):
        self.__userPassword = newPassword

    def get_info(self):
        return {"User ID": self.__userID,
              "Username": self.__userName,
              "Contact Number": self.__contactNum
        }

class Admin(User):
    def __init__(self, userID, userName, userPassword, contactNum):
        super().__init__(userID, userName, userPassword, contactNum)
        self.role  = "admin"

class Client(User):
    def __init__(self, userID, userName, userPassword, contactNum):
        super().__init__(userID, userName, userPassword, contactNum)
        self.role = "client"

users = []
admins = []
clients = []