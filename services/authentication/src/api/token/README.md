`/token` Routes
----
### `POST /token/csrf`

- This endpoint returns generates and returns a csrf token in the response `x-csrf-token` header. This token is required in all `POST` requests in this service. Make sure to include the token in `x-csrf-token` header in the request.

* **Sample Request**
    ```
    GET /token/csrf
    ```
* **Sample Response**

    ```
    HTTP/1.1 200 OK
    Status: 200 OK
    Content-Type: application/json
    x-auth-token: <csrf-token>
    
    {}
    ```

### `GET /token/secret/:key_id`

- This endpoint returns a public RSA key that is needed to verify a user's access token. You need to be authenticated to be able to call this endpoint.

* **Request Query Parameter**
    - `key_id` - {string} _(required)_ - a unique id for the public RSA key.

* **Sample Request**
    ```
    GET /token/secret/v9a8vx-q2312-vasd
    x-auth-token: <access-token>

    ```
* **Sample Response**

	```
    HTTP/1.1 204 OK
    Status: 204 OK
    Content-Type: application/json
 
    {
        "success": true,
        "public_key": <public RSA key>
    }
    ```

### `POST /token/refresh`

- A user that has already been authenticated can call this endpoint to refresh the access token.

* **Request Header**
    - `x-auth-token` - {string} - a user's access token.

* **Response:**
    - upon successful refresh, a response will be returned, containing user data in the body and access token in the header.
    - if an unauthorized request or a malformed request is made, all the authentications for the user will be revoked immediately.

* **Sample Request**
    ```
    POST /token/refresh
    x-auth-token: <access-token>

    {}
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
