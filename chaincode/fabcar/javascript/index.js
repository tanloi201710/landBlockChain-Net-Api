/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const Land = require('./lib/land');
const Transfer = require('./lib/transfer')
const Token = require('./lib/erc20Token')

module.exports.Land = Land;
module.exports.Transfer = Transfer;
module.exports.Token = Token;
module.exports.contracts = [Land, Transfer, Token];
