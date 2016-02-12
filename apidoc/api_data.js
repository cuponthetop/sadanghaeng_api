define({ "api": [
  {
    "type": "post",
    "url": "/comments/:cid/reportes",
    "title": "Report the comment",
    "name": "reportComment",
    "group": "Comment",
    "version": "0.0.0",
    "filename": "lib/route/v1/comment.js",
    "groupTitle": "Comment"
  },
  {
    "type": "get",
    "url": "/posts/:pid/comments",
    "title": "Request comments on the post",
    "name": "GetCommentsOnPost",
    "group": "Post",
    "version": "0.0.0",
    "filename": "lib/route/v1/post.js",
    "groupTitle": "Post"
  },
  {
    "type": "post",
    "url": "/posts/:pid/votes",
    "title": "Vote for the post",
    "name": "voteForPost",
    "group": "Post",
    "version": "0.0.0",
    "filename": "lib/route/v1/post.js",
    "groupTitle": "Post"
  },
  {
    "type": "get",
    "url": "/",
    "title": "Status Codes",
    "name": "StatusCodes",
    "group": "StatusCodes",
    "version": "0.0.0",
    "filename": "lib/route/status_all.js",
    "groupTitle": "StatusCodes",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnknownError",
            "description": "<p>(1) Unknown Error has occured! We are doomed!</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InsufficientParameter",
            "description": "<p>(10) Supplied parameters were not sufficient forhandling request</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>(101) Requested User was not found on DB</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserUpdateFailed",
            "description": "<p>(102) User update failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserTokenMismatch",
            "description": "<p>(103) provided token mismatch</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserTokenAlreadyExpired",
            "description": "<p>(104) provided token is already expired</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAlreadyVerified",
            "description": "<p>(105) user already verified oneself</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserPermissionNotAllowed",
            "description": "<p>(106) permission current user posesses is not enough to perform selected action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAuthRequired",
            "description": "<p>(111) user authentication is required</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAlreadyLoggedIn",
            "description": "<p>(112) user is trying to login but this userwas already logged in as an user</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserLoggingOutWhenNotLoggedIn",
            "description": "<p>(113) user is trying to logout but this useris not logged in as any user</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserCredentialsNotMatch",
            "description": "<p>(114) provided user credential is not correct</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotVerified",
            "description": "<p>(115) provided user is not yet verified</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserEmailAlreadyInUse",
            "description": "<p>(116) provided user email is already in use</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CantReportSelf",
            "description": "<p>(117) user cannot report oneself</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAlreadyReported",
            "description": "<p>(118) user can only get reported once</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserRemovalFailed",
            "description": "<p>(119) user removal failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnivNotFound",
            "description": "<p>(201) Requested University is not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnivUpdateFailed",
            "description": "<p>(202) University update failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnivRemovalFailed",
            "description": "<p>(203) University removal failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotAcceptedEmailAddress",
            "description": "<p>(204) none of universities we support accepts provided email domain</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "MultipleAcceptedEmailAddress",
            "description": "<p>(205) many of universities we support accepts provided email domain</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotInThisUniversity",
            "description": "<p>(206) current user is not member of requested university</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidEmailAddress",
            "description": "<p>(207) not valid email address</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidEmailDomain",
            "description": "<p>(208) not valid email domain</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnivAlreadyExisting",
            "description": "<p>(209) university with given name is already existing</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CommentsOnPostGottenFailed",
            "description": "<p>(401) fail to get comments on the post</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "VotesOnPostGottenFailed",
            "description": "<p>(402) fail to get votes on the post</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CommentRemovalFailed",
            "description": "<p>(500) fail to remove the comment</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CommentUpdateFailed",
            "description": "<p>(501) fail to update the comment</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "RateLimitExceeded",
            "description": "<p>(40004) Too many requests, please try again later.</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/universities",
    "title": "Create University Information",
    "name": "CreateUniversity",
    "group": "University",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>University's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "displayName",
            "description": "<p>University's displayName</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "emailDomainList",
            "description": ""
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
            "field": "value",
            "description": "<p>university id of newly created university</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/university.js",
    "groupTitle": "University",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnivUpdateFailed",
            "description": "<p>(202) University update failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAuthRequired",
            "description": "<p>(111) user authentication is required</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserPermissionNotAllowed",
            "description": "<p>(106) permission current user posesses is not enough to perform selected action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnivAlreadyExisting",
            "description": "<p>(209) university with given name is already existing</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidEmailDomain",
            "description": "<p>(208) not valid email domain</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "/universities/:univid",
    "title": "Destroy University",
    "name": "DestroyUniversity",
    "group": "University",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": ":univid",
            "description": "<p>University's unique ID</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/university.js",
    "groupTitle": "University",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAuthRequired",
            "description": "<p>(111) user authentication is required</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserPermissionNotAllowed",
            "description": "<p>(106) permission current user posesses is not enough to perform selected action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnivNotFound",
            "description": "<p>(201) Requested University is not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnivRemovalFailed",
            "description": "<p>(203) University removal failed</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/universities/:univid",
    "title": "Get University Information",
    "name": "GetUniversity",
    "group": "University",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": ":univid",
            "description": "<p>University's unique ID</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/university.js",
    "groupTitle": "University",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of request</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>University Information</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value._id",
            "description": "<p>University unique id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.name",
            "description": "<p>University name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.displayName",
            "description": "<p>How each students in this university will be represented</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "value.emailDomainList",
            "description": "<p>list of email domains (string after @) this university accepts</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAuthRequired",
            "description": "<p>(111) user authentication is required</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserPermissionNotAllowed",
            "description": "<p>(106) permission current user posesses is not enough to perform selected action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnivNotFound",
            "description": "<p>(201) Requested University is not found</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/universities/:univid/search",
    "title": "Search for posts in University",
    "name": "Search",
    "group": "University",
    "version": "0.0.0",
    "filename": "lib/route/v1/university.js",
    "groupTitle": "University"
  },
  {
    "type": "put",
    "url": "/universities/:univid",
    "title": "Update University Information",
    "name": "UpdateUniversity",
    "group": "University",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": ":univid",
            "description": "<p>University's unique ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>University's name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "displayName",
            "description": "<p>University's displayName</p>"
          },
          {
            "group": "Parameter",
            "type": "String[]",
            "optional": false,
            "field": "emailDomainList",
            "description": ""
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/university.js",
    "groupTitle": "University",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAuthRequired",
            "description": "<p>(111) user authentication is required</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserPermissionNotAllowed",
            "description": "<p>(106) permission current user posesses is not enough to perform selected action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnivNotFound",
            "description": "<p>(201) Requested University is not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UnivUpdateFailed",
            "description": "<p>(202) University update failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidEmailDomain",
            "description": "<p>(208) not valid email domain</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "/users/:userid",
    "title": "Destroy User information",
    "name": "DestroyUser",
    "group": "User",
    "permission": [
      {
        "name": "owner admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": ":userid",
            "description": "<p>User's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/user.js",
    "groupTitle": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of request</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>User Information</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value._id",
            "description": "<p>User unique id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.email",
            "description": "<p>User email address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.nickname",
            "description": "<p>User nickname</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "value.verified",
            "description": "<p>is verified User</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "value.admin",
            "description": "<p>is admin User</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.reset_token",
            "description": "<p>User password reset token</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "value.reset_token_expires",
            "description": "<p>password reset token expiration date</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.verify_token",
            "description": "<p>User verification token</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "value.verify_token_expires",
            "description": "<p>verification token expiration date</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.univID",
            "description": "<p>University ID User is in</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "value.memberSince",
            "description": "<p>When user registered</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "value.reportCounts",
            "description": "<p>The number of times this user was reported by other users</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAuthRequired",
            "description": "<p>(111) user authentication is required</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserPermissionNotAllowed",
            "description": "<p>(106) permission current user posesses is not enough to perform selected action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>(101) Requested User was not found on DB</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserRemovalFailed",
            "description": "<p>(119) user removal failed</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/users/reset_password",
    "title": "Generate reset token for password reset",
    "name": "GenerateResetToken",
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
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/user.js",
    "groupTitle": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidEmailAddress",
            "description": "<p>(207) not valid email address</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotVerified",
            "description": "<p>(115) provided user is not yet verified</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>(101) Requested User was not found on DB</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/users/verify",
    "title": "Generate verification token for User",
    "name": "GenerateVerificationToken",
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
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/user.js",
    "groupTitle": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidEmailAddress",
            "description": "<p>(207) not valid email address</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAlreadyVerified",
            "description": "<p>(105) user already verified oneself</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>(101) Requested User was not found on DB</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/users/:userid",
    "title": "Request User information",
    "name": "GetUser",
    "group": "User",
    "permission": [
      {
        "name": "owner"
      },
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": ":userid",
            "description": "<p>User's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/user.js",
    "groupTitle": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of request</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>User Information</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value._id",
            "description": "<p>User unique id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.email",
            "description": "<p>User email address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.nickname",
            "description": "<p>User nickname</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "value.verified",
            "description": "<p>is verified User</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "value.admin",
            "description": "<p>is admin User</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.reset_token",
            "description": "<p>User password reset token</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "value.reset_token_expires",
            "description": "<p>password reset token expiration date</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.verify_token",
            "description": "<p>User verification token</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "value.verify_token_expires",
            "description": "<p>verification token expiration date</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.univID",
            "description": "<p>University ID User is in</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "value.memberSince",
            "description": "<p>When user registered</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "value.reportCounts",
            "description": "<p>The number of times this user was reported by other users</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAuthRequired",
            "description": "<p>(111) user authentication is required</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserPermissionNotAllowed",
            "description": "<p>(106) permission current user posesses is not enough to perform selected action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>(101) Requested User was not found on DB</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotVerified",
            "description": "<p>(115) provided user is not yet verified</p>"
          }
        ]
      }
    }
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
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>User's unique ID (email address).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User's password.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"email\": \"test@test.com\",\n  \"password\": \"test\"\n}",
          "type": "json"
        }
      ]
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
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"status\": \"114\",\n  \"value\":\n  {\n     \"message\": \"provided user credential is not correct\"\n  }\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserCredentialsNotMatch",
            "description": "<p>(114) provided user credential is not correct</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAlreadyLoggedIn",
            "description": "<p>(112) user is trying to login but this userwas already logged in as an user</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotVerified",
            "description": "<p>(115) provided user is not yet verified</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>(101) Requested User was not found on DB</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidEmailAddress",
            "description": "<p>(207) not valid email address</p>"
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
      ],
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of request</p>"
          }
        ]
      }
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "{\n  \"status\": \"113\",\n  \"value\":\n  {\n     \"message\": \"user is trying to logout but this user is not logged in as any user\"\n  }\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserLoggingOutWhenNotLoggedIn",
            "description": "<p>(113) user is trying to logout but this useris not logged in as any user</p>"
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
            "field": "value",
            "description": "<p>user id of newly registered user.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of request</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/user.js",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserEmailAlreadyInUse",
            "description": "<p>(116) provided user email is already in use</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidEmailAddress",
            "description": "<p>(207) not valid email address</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/users/:userid/report",
    "title": "Report User",
    "name": "ReportUser",
    "group": "User",
    "permission": [
      {
        "name": "member"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": ":userid",
            "description": "<p>User's unique ID.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/user.js",
    "groupTitle": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAuthRequired",
            "description": "<p>(111) user authentication is required</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>(101) Requested User was not found on DB</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CantReportSelf",
            "description": "<p>(117) user cannot report oneself</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserUpdateFailed",
            "description": "<p>(102) User update failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotVerified",
            "description": "<p>(115) provided user is not yet verified</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/users/reset_password",
    "title": "Reset User's password",
    "name": "ResetPassword",
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
            "field": "resetToken",
            "description": "<p>password reset token</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "newPassword",
            "description": "<p>new password</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/user.js",
    "groupTitle": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidEmailAddress",
            "description": "<p>(207) not valid email address</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotVerified",
            "description": "<p>(115) provided user is not yet verified</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>(101) Requested User was not found on DB</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserTokenAlreadyExpired",
            "description": "<p>(104) provided token is already expired</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserTokenMismatch",
            "description": "<p>(103) provided token mismatch</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserUpdateFailed",
            "description": "<p>(102) User update failed</p>"
          }
        ]
      }
    }
  },
  {
    "type": "put",
    "url": "/users/:userid",
    "title": "Update User information",
    "name": "UpdateUser",
    "group": "User",
    "permission": [
      {
        "name": "owner"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "ObjectId",
            "optional": false,
            "field": ":userid",
            "description": "<p>User's unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "nickname",
            "description": "<p>User's new nickname.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User's new password.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/user.js",
    "groupTitle": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of request</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "value",
            "description": "<p>User Information</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value._id",
            "description": "<p>User unique id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.email",
            "description": "<p>User email address</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.nickname",
            "description": "<p>User nickname</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "value.verified",
            "description": "<p>is verified User</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "value.admin",
            "description": "<p>is admin User</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.reset_token",
            "description": "<p>User password reset token</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "value.reset_token_expires",
            "description": "<p>password reset token expiration date</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.verify_token",
            "description": "<p>User verification token</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "value.verify_token_expires",
            "description": "<p>verification token expiration date</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "value.univID",
            "description": "<p>University ID User is in</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "value.memberSince",
            "description": "<p>When user registered</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "value.reportCounts",
            "description": "<p>The number of times this user was reported by other users</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAuthRequired",
            "description": "<p>(111) user authentication is required</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserPermissionNotAllowed",
            "description": "<p>(106) permission current user posesses is not enough to perform selected action</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>(101) Requested User was not found on DB</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserUpdateFailed",
            "description": "<p>(102) User update failed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotVerified",
            "description": "<p>(115) provided user is not yet verified</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/users/register",
    "title": "Verify User's email address",
    "name": "VerifyUser",
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
            "field": "verifyToken",
            "description": "<p>verification token</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "lib/route/v1/user.js",
    "groupTitle": "User",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<p>status of request</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserAlreadyVerified",
            "description": "<p>(105) user already verified oneself</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InvalidEmailAddress",
            "description": "<p>(207) not valid email address</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserNotFound",
            "description": "<p>(101) Requested User was not found on DB</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserTokenAlreadyExpired",
            "description": "<p>(104) provided token is already expired</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserTokenMismatch",
            "description": "<p>(103) provided token mismatch</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserUpdateFailed",
            "description": "<p>(102) User update failed</p>"
          }
        ]
      }
    }
  }
] });
