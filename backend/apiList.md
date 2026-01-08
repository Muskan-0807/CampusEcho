# CampusEcho - API List

Base URL :`/api`

## 🔐 Authentication

POST `/auth/register` 
POST `/auth/login`
POST `/auth/logout`

## 👤 Profile

GET  `/profile`
PUT  `/profile`
PUT  `/profile/change-password`

## 📝 Issues

POST   `/issues`  
GET    `/issues`  
GET    `/issues/my`  

PATCH  `/issues/:id/status`  
DELETE `/issues/:id`  

## 💬 Issue Interactions (Student Only)

POST `/issues/:id/comment`  
POST `/issues/:id/agree`  
POST `/issues/:id/disagree`

## 🔐 Access Control

- **Students**
  - Create issues
  - Comment
  - Agree / Disagree
- **Admin**
  - Update status
  - Respond officially
  - Delete issues

