`/auth` Routes
----
### `POST /local/request`

- Calling this endpoint will send out an email to the user's email address with a verification code in it. This verification code, along with the user's email address that this code was sent to, is required when the user requests for a sign up.
  
* **Request Payload**
    - `email` - {string} _(required)_ - a new user's email address.

* **Response:**
    - `message` - {string} - a message confirming that a verification code was sent.

* **Sample Request**
    ```
    POST /local/request

    {
        "email": "user@email.com"
    }
    ```
* **Sample Response**

    ```
    HTTP/1.1 200 OK
    Status: 200 OK
    Content-Type: application/json
    
    {
        "success": true,
        "message": "Verification email has been sent to user@email.com"
    }
    ```

### `POST /local/verify`

- This endpoint checks whether a given verification code is valid for a given email address. Ideally, you should call this endpoint prior to submitting user registration form to confirm the user's email address. However, this endpoint is optional if you plan to do an error checking after submitting the registration form. 

* **Request Payload**
    - `code` - {string} _(required)_ - a verification code to check.
    - `email` - {string} _(required)_ - email address to check the verification code against.

* **Response:**
    - if successful, a response with an empty body and a status code of `204` will be returned.

* **Sample Request**
    ```
    POST /local/verify

    {
        "code": "vj19df8a9s",
        "email": "user@email.com"
    }
    ```
* **Sample Response**

	```
    HTTP/1.1 204 OK
    Status: 204 OK
    Content-Type: application/json
    
    {}
    ```

### `POST /local/register`

- Calling this endpoint with a new user's information will create a new local user record in the system and authenticates the new user.

* **Request Payload**
    - `avatar` - {string} - a url to or a base64 encoded data of user's profile picture.
    - `display_name` - {string} _(required)_ - a display name for the new user.
    - `email` - {string} _(required)_ - a email address for the new user.
    - `password` - {string} _(required)_ - a password for the new user.
    - `token` - {string} _(required)_ - a verification code that was sent to the user's email address.

* **Response:**
    - upon successful registration, a response will be returned, containing user data in the body and access token in the header.

* **Sample Request**
    ```
    POST /local/register

    {
        "avatar": "https://cdn.pixabay.com/photo/2018/04/20/17/18/cat-3336579__340.jpg",
        "display_name": "new_user",
        "email": "user@email.com",
        "password": "newpassword",
        "token": "vj19df8a9s"
    }
    ```
* **Sample Response**

    ```
    HTTP/1.1 200 OK
    Status: 200 OK
    Content-Type: application/json
    x-auth-token: <access-token>
    
    {
        "success": true,
        "user": {
            "avatar": "https://cdn.pixabay.com/photo/2018/04/20/17/18/cat-3336579__340.jpg",
            "display_name": "new_user",
            "email": "user@email.com",
            "id": "avads8f-12va8b8z-1238bz-g8888a",
            "strategy": "local"
        }
    }
    ```

### `POST /local/login`

- Given a user email and a matching password, this endpoint will authenticate a user.

* **Request Payload**
    - `email` - {string} _(required)_ - a email address for the user.
    - `password` - {string} _(required)_ - a password for the user.

* **Response:**
    - upon successful login, a response will be returned, containing user data in the body and access token in the `x-auth-token` header.

* **Sample Request**
    ```
    POST /local/login

    {
        "email": "user@email.com",
        "password": "newpassword"
    }
    ```
* **Sample Response**

    ```
    HTTP/1.1 200 OK
    Status: 200 OK
    Content-Type: application/json
    x-auth-token: <access-token>
 
    {
        "success": true,
        "user": {
            "avatar": "https://cdn.pixabay.com/photo/2018/04/20/17/18/cat-3336579__340.jpg",
            "display_name": "new_user",
            "email": "user@email.com",
            "id": "avads8f-12va8b8z-1238bz-g8888a",
            "strategy": "local"
        }
    }
    ```

### `POST /social/register`

- Calling this endpoint with a new user's information will create a new social user record in the system and authenticates the new user.

* **Request Payload**
    - `avatar` - {string} - a url to or a base64 encoded data of user's profile picture.
    - `display_name` - {string} _(required)_ - a display name for the new user.
    - `social_id` - {string} _(required)_ - a unique id for a user provided from social login provider.
    - `social_token` - {string} _(required)_ - an access token provided from social login provider.
    - `strategy` - {string} _(required)_ - a name of social login provider (e.g, google, facebook, or kakao).

* **Response:**
    - upon successful registration, a response will be returned, containing user data in the body and access token in the `x-auth-token` header.

* **Sample Request**
    ```
    POST /social/register

    {
        "avatar": "https://cdn.pixabay.com/photo/2018/04/20/17/18/cat-3336579__340.jpg",
        "display_name": "google_loginer",
        "social_id": "vz9s9f8a9sdf-asdf8vb-sbzx",
        "social_token": "zcxhnqpoi8990asd90as00",
        "strategy": "google"
    }
    ```
* **Sample Response**

    ```
    HTTP/1.1 200 OK
    Status: 200 OK
    Content-Type: application/json
    x-auth-token: <access-token>
 
    {
        "success": true,
        "user": {
            "avatar": "https://cdn.pixabay.com/photo/2018/04/20/17/18/cat-3336579__340.jpg",
            "display_name": "new_user",
            "email": null,
            "id": "avads8f-12va8b8z-1238bz-g8888a",
            "strategy": "google"
        }
    }
    ```

### `POST /social/login`

- Calling this endpoint with a new user's information will create a new social user record in the system and authenticates the new user.

* **Request Payload**
    - `avatar` - {string} - a url to or a base64 encoded data of user's profile picture.
    - `display_name` - {string} _(required)_ - a display name for the new user.
    - `social_id` - {string} _(required)_ - a unique id for a user provided from social login provider.
    - `social_token` - {string} _(required)_ - an access token provided from social login provider.
    - `strategy` - {string} _(required)_ - a name of social login provider (e.g, google, facebook, or kakao).

* **Response:**
    - Calling this endpoint with user id and access token from a socia login provider will either redirect the user to a registration page if no existing record for a user is found or log the user in if a record is found in the system.

* **Sample Request**
    ```
    POST /social/login

    {
        "social_id": "vz9s9f8a9sdf-asdf8vb-sbzx",
        "social_token": "zcxhnqpoi8990asd90as00"
    }
    ```
* **Sample Response**

    ```
    HTTP/1.1 200 OK
    Status: 200 OK
    Content-Type: application/json
    x-auth-token: <access-token>
 
    {
        "success": true,
        "user": {
            "avatar": "https://cdn.pixabay.com/photo/2018/04/20/17/18/cat-3336579__340.jpg",
            "display_name": "new_user",
            "email": null,
            "id": "avads8f-12va8b8z-1238bz-g8888a",
            "strategy": "google"
        }
    }
    ```
* **Sample Response if it's a new user**

    ```
    HTTP/1.1 200 OK
    Status: 200 OK
    Content-Type: application/json
    x-auth-token: <access-token>
 
    {
        "success": true,
        "should_register": true,
        "profile": {
            "avatar": "https://cdn.pixabay.com/photo/2018/04/20/17/18/cat-3336579__340.jpg",
            "display_name": "new_user",
            "email": null,
            "id": "avads8f-12va8b8z-1238bz-g8888a",
            "strategy": "google"
        }
    }
    ```
