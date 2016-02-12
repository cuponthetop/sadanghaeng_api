"use strict";

var codes = {
  Success: {
    code: 0,
    summary: 'success'
  },
  UnknownError: {
    code: 1,
    summary: 'Unknown Error has occured! We are doomed!'
  },
  InsufficientParameter: {
    code: 10,
    summary: 'Supplied parameters were not sufficient for' +
    'handling request'
  },

  /* ---------------------------User------------------------- */
  UserNotFound: {
    code: 101,
    summary: 'Requested User was not found on DB'
  },
  UserUpdateFailed: {
    code: 102,
    summary: 'User update failed'
  },
  UserTokenMismatch: {
    code: 103,
    summary: 'provided token mismatch'
  },
  UserTokenAlreadyExpired: {
    code: 104,
    summary: 'provided token is already expired'
  },
  UserAlreadyVerified: {
    code: 105,
    summary: 'user already verified oneself'
  },
  UserPermissionNotAllowed: {
    code: 106,
    summary: 'permission current user posesses is not enough to perform selected action'
  },

  UserAuthRequired: {
    code: 111,
    summary: 'user authentication is required'
  },
  UserAlreadyLoggedIn: {
    code: 112,
    summary: 'user is trying to login but this user' +
    'was already logged in as an user'
  },
  UserLoggingOutWhenNotLoggedIn: {
    code: 113,
    summary: 'user is trying to logout but this user' +
    'is not logged in as any user'
  },
  UserCredentialsNotMatch: {
    code: 114,
    summary: 'provided user credential is not correct'
  },
  UserNotVerified: {
    code: 115,
    summary: 'provided user is not yet verified'
  },
  UserEmailAlreadyInUse: {
    code: 116,
    summary: 'provided user email is already in use'
  },
  CantReportSelf: {
    code: 117,
    summary: 'user cannot report oneself'
  },
  UserAlreadyReported: {
    code: 118,
    summary: 'user can only get reported once'
  },

  /* ---------------------University-------------------------- */
  UnivNotFound: {
    code: 201,
    summary: 'Requested University is not found'
  },
  UnivUpdateFailed: {
    code: 202,
    summary: 'University update failed'
  },
  UnivRemovalFailed: {
    code:203,
    summary: 'University removal failed'
  },
  NotAcceptedEmailAddress: {
    code: 204,
    summary: 'none of universities we support accepts provided email domain'
  },
  MultipleAcceptedEmailAddress: {
    code: 205,
    summary: 'many of universities we support accepts provided email domain'
  },
  UserNotInThisUniversity: {
    code: 206,
    summary: 'current user is not member of requested university'
  },
  InvalidEmailAddress: {
    code: 207,
    summary: 'not valid email address'
  },
  InvalidEmailDomain: {
    code: 208,
    summary: 'not valid email domain'
  },
  UnivAlreadyExisting: {
    code: 209,
    summary: 'university with given name is already existing'
  },

  /* ---------------------Post-------------------------- */
  CommentsOnPostGottenFailed: {
    code: 401,
    summary: 'fail to get comments on the post'
  },
  VotesOnPostGottenFailed: {
    code: 402,
    summary: 'fail to get votes on the post'
  },

  /* ---------------------Comment-------------------------- */
  CommentRemovalFailed: {
    code: 500,
    summary: 'fail to remove the comment'
  },
  CommentUpdateFailed: {
    code: 501,
    summary: 'fail to update the comment'
  },

  RateLimitExceeded: {
    code: 40004,
    summary: 'Too many requests, please try again later.'
  }
};

if (typeof module !== "undefined") {
  module.exports.codes = codes;
  module.exports.getSummaryByCode = function (code) {
    code = parseInt(code, 10);
    for (var c in codes) {
      if (typeof codes[c].code !== "undefined" && codes[c].code === code) {
        return codes[c].summary;
      }
    }
    return 'An error occurred';
  };
}