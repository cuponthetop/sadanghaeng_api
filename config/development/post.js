"use strict";

module.exports = {
  maxAge: 365,
  maxPage: 10000,
  maxPerPage: 30,
  searchFields: ['title', 'text'],
  filterTypes: ['hot', 'new'],
  sortTypes: ['asc', 'desc'],
  defaultSort: 'desc',
  defaultPerPage: 10,
  defaultAge: 7,
  hotThreshold: 10
};