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
