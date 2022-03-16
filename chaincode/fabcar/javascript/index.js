/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabCar = require('./lib/fabcar');
const Transfer = require('./lib/transfer')
const Token = require('./lib/erc20Token')

module.exports.FabCar = FabCar;
module.exports.Transfer = Transfer;
module.exports.Token = Token;
module.exports.contracts = [ FabCar, Transfer, Token];
