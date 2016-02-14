"use strict";

/**
 * @apiDefine UnknownError
 * @apiError UnknownError (1) Unknown Error has occured! We are doomed!
 */

/**
 * @apiDefine InsufficientParameter
 * @apiError InsufficientParameter (10) Supplied parameters were not sufficient forhandling request
 */

/**
 * @apiDefine UserNotFound
 * @apiError UserNotFound (101) Requested User was not found on DB
 */

/**
 * @apiDefine UserUpdateFailed
 * @apiError UserUpdateFailed (102) User update failed
 */

/**
 * @apiDefine UserTokenMismatch
 * @apiError UserTokenMismatch (103) provided token mismatch
 */

/**
 * @apiDefine UserTokenAlreadyExpired
 * @apiError UserTokenAlreadyExpired (104) provided token is already expired
 */

/**
 * @apiDefine UserAlreadyVerified
 * @apiError UserAlreadyVerified (105) user already verified oneself
 */

/**
 * @apiDefine UserPermissionNotAllowed
 * @apiError UserPermissionNotAllowed (106) permission current user posesses is not enough to perform selected action
 */

/**
 * @apiDefine UserAuthRequired
 * @apiError UserAuthRequired (111) user authentication is required
 */

/**
 * @apiDefine UserAlreadyLoggedIn
 * @apiError UserAlreadyLoggedIn (112) user is trying to login but this userwas already logged in as an user
 */

/**
 * @apiDefine UserLoggingOutWhenNotLoggedIn
 * @apiError UserLoggingOutWhenNotLoggedIn (113) user is trying to logout but this useris not logged in as any user
 */

/**
 * @apiDefine UserCredentialsNotMatch
 * @apiError UserCredentialsNotMatch (114) provided user credential is not correct
 */

/**
 * @apiDefine UserNotVerified
 * @apiError UserNotVerified (115) provided user is not yet verified
 */

/**
 * @apiDefine UserEmailAlreadyInUse
 * @apiError UserEmailAlreadyInUse (116) provided user email is already in use
 */

/**
 * @apiDefine CantReportSelf
 * @apiError CantReportSelf (117) user cannot report oneself
 */

/**
 * @apiDefine UserRemovalFailed
 * @apiError UserRemovalFailed (119) user removal failed
 */

/**
 * @apiDefine UnivNotFound
 * @apiError UnivNotFound (201) Requested University is not found
 */

/**
 * @apiDefine UnivUpdateFailed
 * @apiError UnivUpdateFailed (202) University update failed
 */

/**
 * @apiDefine UnivRemovalFailed
 * @apiError UnivRemovalFailed (203) University removal failed
 */

/**
 * @apiDefine NotAcceptedEmailAddress
 * @apiError NotAcceptedEmailAddress (204) none of universities we support accepts provided email domain
 */

/**
 * @apiDefine MultipleAcceptedEmailAddress
 * @apiError MultipleAcceptedEmailAddress (205) many of universities we support accepts provided email domain
 */

/**
 * @apiDefine UserNotInThisUniversity
 * @apiError UserNotInThisUniversity (206) current user is not member of requested university
 */

/**
 * @apiDefine InvalidEmailAddress
 * @apiError InvalidEmailAddress (207) not valid email address
 */

/**
 * @apiDefine InvalidEmailDomain
 * @apiError InvalidEmailDomain (208) not valid email domain
 */

/**
 * @apiDefine UnivAlreadyExisting
 * @apiError UnivAlreadyExisting (209) university with given name is already existing
 */

/**
 * @apiDefine InvalidPageNumberRequested
 * @apiError InvalidPageNumberRequested (250) requested page number is invalid
 */

/**
 * @apiDefine InvalidSortRequested
 * @apiError InvalidSortRequested (251) requested sort type is invalid
 */

/**
 * @apiDefine InvalidFilterRequested
 * @apiError InvalidFilterRequested (252) requested filter type is invalid
 */

/**
 * @apiDefine InvalidSearchFieldRequested
 * @apiError InvalidSearchFieldRequested (253) one of requested search field type is invalid
 */

/**
 * @apiDefine InvalidAgeRequested
 * @apiError InvalidAgeRequested (254) requested post age range is invalid
 */

/**
 * @apiDefine EmptyQueryStringRequested
 * @apiError EmptyQueryStringRequested (255) requested query string is empty
 */

/**
 * @apiDefine PostNotFound
 * @apiError PostNotFound (400) Requested Post was not found on DB
 */

/**
 * @apiDefine CommentsOnPostGottenFailed
 * @apiError CommentsOnPostGottenFailed (401) fail to get comments on the post
 */

/**
 * @apiDefine VotesOnPostGottenFailed
 * @apiError VotesOnPostGottenFailed (402) fail to get votes on the post
 */

/**
 * @apiDefine CommentNotFound
 * @apiError CommentNotFound (500) Requested comment was not found on DB
 */

/**
 * @apiDefine CommentRemovalFailed
 * @apiError CommentRemovalFailed (501) fail to remove the comment
 */

/**
 * @apiDefine CommentUpdateFailed
 * @apiError CommentUpdateFailed (502) fail to update the comment
 */

/**
 * @apiDefine AlreadyReported
 * @apiError AlreadyReported (600) user can only get reported once
 */

/**
 * @apiDefine RateLimitExceeded
 * @apiError RateLimitExceeded (40004) Too many requests, please try again later.
 */

