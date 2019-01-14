htt#p://www.dreamsyssoft.com/python-scripting-tutorial/create-simple-rest-web-service-with-python.php
#########################
#        script-1       #
#########################
# hello = 'Hello'
# python = 'Python!'
# print hello, python

#########################
#        script-2       #
#########################
# import sys
# name = sys.argv[1]
# age = int(sys.argv[2])
# diff = 100 - age
# print 'Hello', name + ', you will be 100 in', diff, 'years!'

#########################
#        script-3       #
#########################
# import sys
# validPassword = 'secret' #this is our password.
# inputPassword = raw_input('Please Enter Password: ')
# if inputPassword == validPassword:
#     print 'You have access!'
# else:
#     print 'Access denied!'
#     sys.exit(0)
# print 'Welcome!'

#########################
#        script-4       #
#########################
# import sys
# if len(sys.argv) > 1:
#     name = sys.argv[1]
# else:
#     name = raw_input('Enter Name:')
# if len(sys.argv) > 2:
#     age = int(sys.argv[2])
# else:
#     age = int(raw_input('Enter Age:'))
# sayHello = 'Hello ' + name + ','
# if age == 100:
#     sayAge = 'You are already 100 years old!'
# elif age < 100:
#     sayAge = 'You will be 100 in ' + str(100 - age) + ' years!'
# else:
#     sayAge = 'You turned 100 ' + str(age - 100) + ' years ago!'
# print sayHello, sayAge

#########################
#        script-5       #
#########################
# import sys
# import optparse
#
# parser = optparse.OptionParser()
# parser.add_option('-n', '--name', dest='name', help='Your Name')
# parser.add_option('-a', '--age', dest='age', help='Your Age', type=int)
#
# (options, args) = parser.parse_args()
#
# if options.name is None:
#     options.name = raw_input('Enter Name:')
#
# if options.age is None:
#     options.age = int(raw_input('Enter Age:'))
#
# sayHello = 'Hello ' + options.name + ','
#
# if options.age == 100:
#     sayAge = 'You are already 100 years old!'
# elif options.age < 100:
#     sayAge = 'You will be 100 in ' + str(100 - options.age) + ' years!'
# else:
#     sayAge = 'You turned 100 ' + str(options.age - 100) + ' years ago!'
#
# print sayHello, sayAge
#####################################################################
#  usage: years.py [options]                                        #
#                                                                   #
# options:                                                          #
#   -h, --help            show this help message and exit           #
#   -n NAME, --name=NAME  Your Name                                 #
#   -a AGE, --age=AGE     Your Age                                  #
#####################################################################

#########################
#        script-6       #
#########################
#guess the number game
# import random
#
# answer = random.randint(1, 5)
# print answer
# num = 0
# dict = {1:'10', 2:'20', 3:'30', 4: '40', 5: '50'}
# max_range = 5
# min_range = 1
#
# for i in range(min_range, max_range):
#     while num != answer:
#         num = int(raw_input('Please choice ane number [1, 2, 3, 4, 5]: '))
#         left = max_range-i
#
#         if num in dict:
#             print 'Wrong !',dict[num], '\n' 'left chance is :', left
#
# print 'Correct!'

#########################
#        script-7       #
#########################
# import time
# counter = 0
# while 1:
#     time.sleep(1)
#     counter += 1
#     print 'Script has been looping for', counter, 'seconds...'

#########################
#        script-8       #
#########################
# userInput = raw_input('Enter a list of numbers between 1 and 100, separated by spaces: ')
# nums = userInput.split()
#
# for strNum in nums:
#     if not strNum.isdigit():
#         print 'Not a Number:', strNum
#     elif int(strNum) < 1:
#         print 'Number is less than 1:', strNum
#     elif int(strNum) > 100:
#         print 'Number is greater than 100:', strNum
#     else:
#         print 'Number is valid:', strNum

#########################
#        script-9       #
#########################
# import sys
# logLevel = int(sys.argv[1])
#
# def logit(level, msg):
#     if level >= logLevel:
#         print 'MSG' + str(level) + ':', msg
#
# def getUser():
#     logit(2, 'Entering Function getUser()...')
#     user = raw_input('Enter User Name: ')
#     logit(1, 'Leaving Function getUser()...')
#     return user
#
# logit(2, 'Starting Script...')
# logit(3, 'User Entered: ' + getUser())
# logit(3, 'Ending Script.')

#########################
#        script-10      #
#########################

# def fact(n):
#     if n > 1:
#         return n * fact(n - 1)
#     else:
#         return 1
#
# num = int(raw_input('Enter a number: '))
# print str(num) + '! =', fact(num)

#########################
#        script-11      #
#########################
# import sys
# class User:
#     name = ""
#     age = 0
#     height = 0
#     weight = 0
#
#     def display(self):
#         print ''
#         print 'User Information:'
#         print 'User Name  :', self.name
#         print 'User Age   :', self.age
#         print 'User Height:', self.height
#         print 'User Weight:', self.weight
#
#     def loadFromInput(self):
#         self.name = raw_input('Enter User Name: ')
#         self.age = int(raw_input('Enter Age: '))
#         self.height = float(raw_input('Enter Height (in feet): '))
#         self.weight = int(raw_input('Enter Weight: '))
#
#     def save(self):
#         base_url = "/home/adminpc/Desktop/detail/"
#         file_name = self.name +".info"
#         url = base_url + file_name
#         f = open(url, 'w')
#         f.write(self.name + '\n')
#         f.write(str(self.age) + '\n')
#         f.write(str(self.height) + '\n')
#         f.write(str(self.weight) + '\n')
#         f.close()
#
#     def loadFromFile(self, name):
#         base_url = "/home/adminpc/Desktop/detail/"
#         file_name = name + ".info"
#         url = base_url + file_name
#         f = open(url, 'r')
#         self.name = f.readline().rstrip()
#         self.age = int(f.readline())
#         self.height = float(f.readline())
#         self.weight = int(f.readline())
#
# theUser = None
# try:
#     name = sys.argv[1]
# except:
#     pass
# if len(sys.argv) > 1 and sys.argv[1] == name:
#     theUser = User()
#     theUser.loadFromFile(name)
# else:
#     theUser = User()
#     theUser.loadFromInput()
#     theUser.save()
#
# theUser.display()

#########################
#        script-12      #
#########################

# strUsers = 'rpulley  ,    jsmith, svai,  jsatriani    ,ymalmsteen    '
# arrUsers = strUsers.split(',')
#
# for user in arrUsers:
#     trimUser = user.strip()
#     trimUserR = user.rstrip()
#     trimUserL = user.lstrip()
#
#     firstInitial = trimUser[:1]
#     lastInitial = trimUser[1:2]
#     lastName = trimUser[1:]

    # print 'User : \'' + user + '\''
    # print 'LTrim: \'' + trimUserL + '\''
    # print 'RTrim: \'' + trimUserR + '\''
    # print ' Trim: \'' + trimUser + '\''
    #
    # print 'First Initial:', firstInitial.upper()
    # print 'Last Initial: ', lastInitial.upper()
    # print 'Last Name:', firstInitial.upper(), lastName
    #
    # print ''

#########################
#        script-13      #
#########################
# import sys
#
# # User class
# class User:
#     name = ""
#     age = 0
#     height = 0
#     weight = 0
#
#     def save(self, f):
#         f.write(self.name + '\n')
#         f.write(str(self.age) + '\n')
#         f.write(str(self.height) + '\n')
#         f.write(str(self.weight) + '\n')
#
#     def loadFromFile(self, f):
#         self.name = f.readline().rstrip()
#         self.age = int(f.readline())
#         self.height = float(f.readline())
#         self.weight = int(f.readline())
#
#     def loadFromInput(self):
#         self.name = raw_input('Enter User Name (Q to exit): ')
#         if self.name == 'Q':
#             return
#         self.age = int(raw_input('Enter Age: '))
#         self.height = float(raw_input('Enter Height (in feet): '))
#         self.weight = int(raw_input('Enter Weight: '))
#
#     def display(self):
#         print ''
#         print 'User Information:'
#         print 'User Name  :', self.name
#         print 'User Age   :', self.age
#         print 'User Height:', self.height
#         print 'User Weight:', self.weight
#
# # main program code
# users = []
# def createUsers():
#     while 1:
#         u = User()
#         u.loadFromInput()
#         if u.name == 'Q':
#             break
#         users.append(u)
#
# def saveUsers():
#     base_url = "/home/adminpc/Desktop/detail/"
#     file_name = 'users.info'
#     url = base_url + file_name
#     f = open(url, 'w')
#     f.write(str(len(users)) + '\n')
#     for u in users:
#         u.save(f)
#     f.close()
#
# def readUsers():
#     base_url = "/home/adminpc/Desktop/detail/"
#     file_name = 'users.info'
#     url = base_url + file_name
#     f = open(url, 'r')
#     num = int(f.readline())
#     for i in range(num):
#         u = User()
#         u.loadFromFile(f)
#         users.append(u)
#     f.close()
#
# def displayUsers():
#     for u in users:
#         u.display()
#
# if len(sys.argv) > 1 and sys.argv[1] == 'READ':
#     readUsers()
# else:
#     createUsers()
#     saveUsers()
#
# displayUsers()
#########################
#        script-14      #
#########################
# import urllib
#
# properties = {}
#
# properties['protocol'] = 'http'
# properties['host'] = 'www.google.com'
# properties['port'] = '80'
# properties['path'] = '/trends/'
#
# # the properties in this map represent the URL:
# # http://www.google.com:80/trends/
#
# url = properties['protocol'] + '://' + \
#       properties['host'] + ':' + \
#       properties['port'] + \
#       properties['path']
#
# print 'Reading URL', url
#
# response = urllib.urlopen(url)
#
# print response.read()

#########################
#        script-15      #
#########################
# from enum import Enum
# class Gender(Enum):
#     MALE = 0
#     FEMALE = 1
#     UNSPECIFIED = 2
#
# class User:
#     name = ""
#     age = 0
#     gender = Gender.UNSPECIFIED
#
#     def display(self):
#         if (self.gender == Gender.MALE):
#             print self.name, 'is a male'
#         elif (self.gender == Gender.FEMALE):
#             print self.name, 'is a female'
#         else:
#             print self.name, 'did not specify a gender'
#
#
# # user1 = User()
# # user1.name = 'Mike'
# # user1.gender = Gender.MALE
#
# user2 = User()
# user2.name = 'Sally'
# user2.gender = Gender.FEMALE
#
# user2.display()

import web
import xml.etree.ElementTree as ET

tree = ET.parse('user_data.xml')
root = tree.getroot()

urls = (
    '/users', 'list_users',
    '/users/(.*)', 'get_user'
)

app = web.application(urls, globals())

class list_users:
    def GET(self):
        output = 'users:[';
        for child in root:
            print 'child', child.tag, child.attrib
            output += str(child.attrib) + ','
        output += ']';
        return output

class get_user:
    def GET(self, user):
        for child in root:
            if child.attrib['id'] == user:
                return str(child.attrib)

if __name__ == "__main__":
    app.run()