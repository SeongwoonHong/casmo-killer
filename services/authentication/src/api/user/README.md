`/user` Routes
----
### `GET /`

- This endpoint searches users by provided query string and returns the list of users.
  
* **Available Request Query String**
    - `exclude_value` - {string} _(required)_ - comma separated values to specify which field to exclude from the response body.
    - `search_value` - {string} _(required)_ - value to search for in `search_field` column in the user db.
    - `search_field` - {string} _(required)_ - specifies which column to search for. if not specified, it will default to `id`.
    - `return_fields` - {string} _(required)_ - comma separated values to specify which field to include in the response body. if not specified, it will default to `id,avatar,email,display_name,strategy`,
    
* **Sample Request**
- The following request will return a list of user information for users whose `display_name` is either `random_user` or `new_user`, excluding `id` field from each user record in the response.
    ```
    GET /user?exclude_fields=id&return_fields=display_name,id&search_field=display_name&search_value=random_user,new_user
    ```
* **Sample Response**

    ```
    HTTP/1.1 200 OK
    Status: 200 OK
    Content-Type: application/json
    
    {
        "success": true,
        "users": [
            {
                "avatar": "https://cdn.pixabay.com/photo/2018/04/20/17/18/cat-3336579__340.jpg",
                "display_name": "random_user",
                "email": "random_user@email.com",
                "strategy": "local"
            },
            {
                "avatar": "https://cdn.pixabay.com/photo/2018/04/20/17/18/cat-3336579__340.jpg",
                "display_name": "new_user",
                "email": "new_user@email.com",
                "strategy": "local"
            }
        ]
    }
    ```

### `PATCH /:user_id`

- Calling this endpoint will update user information in the database and re-authenticate the user with this new information. You must be authenticated before calling this endpoint.
- if a different email is provided, a user has to grab a verification code from a verification email sent by the service and make another request to verify the new email address. This verification code is also required as part of the request payload to this endpoint to update the email address.

* **Request Headers**
    - `x-csrf-token` - {string} _(required)_  - csrf token.
    - `x-auth-token` - {string} _(required)_  - a user's access token.

* **Request Parameters**
    - `user_id` - {string} _(required)_  - uuid for a given user.

* **Request Payload**
    - `avatar` - {string} - a url to or a base64 encoded data of user's profile picture.
    - `display_name` - {string} _(required)_ - a display name for the new user.
    - `email` - {string} _(required)_ - a email address for the new user (`null` if it's a social user).
    - `password` - {string} _(required)_ - a password for the new user (`null` if it's a social user).
    - `strategy` - {string} _(required)_ - user's auth strategy.
    - `token` - {string} _(required)_ - a verification code that was sent to the user's email address to verify the new email.

* **Response:**
    - upon successful refresh, a response will be returned, containing user data in the body and access token in the header.

* **Sample Request**
    ```
    POST /token/refresh
    x-auth-token: <access-token>

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
