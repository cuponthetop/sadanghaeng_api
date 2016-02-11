"use strict";

/**
 * @apiDefine UnknownError
 * @apiError UnknownError Unknown Error has occurred.
 */

/**
 * @apiDefine InsufficientParameter
 * @apiError InsufficientParameter Parameters you supplied with this request is insufficient.
 */

/**
 * @apiDefine UserNotFound
 * @apiError UserNotFound requested User is not found in our database.
 */

/**
 * @apiDefine UserUpdateFailed
 * @apiError UserUpdateFailed Our database failed to update user information.
 */

/**
 * @apiDefine UserTokenMismatch
 * @apiError UserTokenMismatch Provided token for behavior does not match with our database hence not permitting operation.
 */

/**
 * @apiDefine UserTokenAlreadyExpired
 * @apiError UserTokenAlreadyExpired Provided token has already expired, generate new one and try again.
 */

/**
 * @apiDefine UserAlreadyVerified
 * @apiError UserAlreadyVerified User account you are trying to verify its email address has already done a verification.
 */

/**
 * @apiDefine UserPermissionNotAllowed
 * @apiError UserPermissionNotAllowed permission current user posesses is not enough to perform selected action
 */

/**
 * @apiDefine UserAuthRequired
 * @apiError UserAuthRequired Selected request requires a valid logged-in user session.
 */

/**
 * @apiDefine UserAlreadyLoggedIn
 * @apiError UserAlreadyLoggedIn User is trying to login, but the user was already logged in and had valid session.
 */

/**
 * @apiDefine UserLoggingOutWhenNotLoggedIn
 * @apiError UserLoggingOutWhenNotLoggedIn You are trying to logout when you are not logged in.
 */

/**
 * @apiDefine UserCredentialsNotMatch
 * @apiError UserCredentialsNotMatch Provided user credentials do not match to those on our database.
 */

/**
 * @apiDefine UserNotVerified
 * @apiError UserNotVerified User is trying to use not verified account.
 */

/**
 * @apiDefine UserEmailAlreadyInUse
 * @apiError UserEmailAlreadyInUse The email address you are trying to use is already in use.
 */

/**
 * @apiDefine UnivNotFound
 * @apiError UnivNotFound Requested University is not found
 */

/**
 * @apiDefine UnivUpdateFailed
 * @apiError UnivUpdateFailed University update failed
 */

/**
 * @apiDefine InvalidEmailAddress
 * @apiError InvalidEmailAddress not valid email address
 */

/**
 * @apiDefine NotAcceptedEmailAddress
 * @apiError NotAcceptedEmailAddress none of universities we support accepts provided email domain
 */

/**
 * @apiDefine MultipleAcceptedEmailAddress
 * @apiError MultipleAcceptedEmailAddress many of universities we support accepts provided email domain
 */

/**
 * @apiDefine UserNotInThisUniversity
 * @apiError UserNotInThisUniversity current user is not member of requested university
 */

/**
 * @apiDefine RateLimitExceeded
 * @apiError RateLimitExceeded You have sent too many requests in short time, please wait a while before sending more requests. 
 */