define({ "api": [
  {
    "type": "get",
    "url": "/users/:id",
    "title": "Request User information",
    "name": "GetUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>Firstname of the User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users/login",
    "title": "Request Login session",
    "name": "Login",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "email",
            "optional": false,
            "field": "email",
            "description": "<p>User's unique ID (email address).</p>"
          },
          {
            "group": "Parameter",
            "type": "password",
            "optional": false,
            "field": "password",
            "description": "<p>User's password.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": \"0\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserCredentialsNotMatch",
            "description": ""
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAlreadyLoggedIn",
            "description": ""
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotVerified",
            "description": ""
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"status\": \"114\",\n  \"value\":\n  {\n     \"message\": \"provided user credential is not correct\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users/logout",
    "title": "Request Logout from session",
    "name": "Logout",
    "group": "User",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n  \"status\": \"0\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserLoggingOutWhenNotLoggedIn",
            "description": ""
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"status\": \"113\",\n  \"value\":\n  {\n     \"message\": \"user is trying to logout but this user is not logged in as any user\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/user.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "/users/register",
    "title": "Register new User",
    "name": "RegisterUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's email address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User's password.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>Firstname of the User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/user.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "/users/:id",
    "title": "Update User information",
    "name": "UpdateUser",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": "id",
            "description": "<p>User's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "User",
            "description": "<p>'s new nickname.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": "<p>Firstname of the User.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/user.js",
    "groupTitle": "User"
  }
] });
