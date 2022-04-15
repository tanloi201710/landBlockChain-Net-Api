/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Split extends Contract {

    async createSplitRequest(ctx, land, userId, numOfLands, areaOfLands, time) {
        console.info('============= START : Create split request ===========')
        const splitRequest = {
            Land: land,
            TimeStart: time,
            TimeEnd: "-/-/-",
            UserRequest: userId,
            NumOfLands: numOfLands,
            AreaOfLands: areaOfLands,
            ConfirmFromUser: false,
            ConfirmFromAdmin: false,
            DataProcessed: [],
            docType: 'split'
        }

        let resultString = await this.checkLengthSplitRequest(ctx)
        let result = JSON.parse(resultString)

        await ctx.stub.putState(`SPLIT${result.length + 1}`, Buffer.from(JSON.stringify(splitRequest)))
        console.info('============= END : Create split request ===========')
    }

    async createSplitRequestFromCo(ctx, land, userId, userRequest, numOfLands, areaOfLands, time) {
        console.info('============= START : Create split request Co ===========')

        const arrayRequest = userRequest.split(',')

        let arrayObj = []

        for (let i = 0; i < arrayRequest.length; i++) {
            let object = {}
            if (arrayRequest[i] == userId) {
                object[arrayRequest[i]] = true
                arrayObj.push(object)
            } else {
                object[arrayRequest[i]] = false
                arrayObj.push(object)
            }
        }

        const splitRequest = {
            Land: land,
            TimeStart: time,
            TimeEnd: "-/-/-",
            UserRequest: arrayObj,
            NumOfLands: numOfLands,
            AreaOfLands: areaOfLands,
            ConfirmFromAdmin: false,
            DataProcessed: [],
            docType: 'split'
        }

        let resultString = await this.checkLengthSplitRequest(ctx)
        let result = JSON.parse(resultString)

        await ctx.stub.putState(`SPLIT${result.length + 1}`, Buffer.from(JSON.stringify(splitRequest)))
        console.info('============= END : Create split request Co ===========')
    }

    async updateSplitRequest(ctx, key, role, dataProcessed = [], time) {

        console.info('============= START : Update split request ===========')

        const splitAsBytes = await ctx.stub.getState(key)
        if (!splitAsBytes || splitAsBytes.length === 0) {
            throw new Error(`${key} does not exist`)
        }

        let splitRequest = JSON.parse(splitAsBytes.toString())
        if (role == 'user') {
            splitRequest.ConfirmFromUser = true
        } else if (role == 'manager') {
            splitRequest.ConfirmFromAdmin = true
            splitRequest.DataProcessed = dataProcessed
            splitRequest.TimeEnd = time
        }

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(splitRequest)))
        console.info('============= END : Update split request ===========')
    }

    async updateSplitRequestFromCo(ctx, userId) {

        console.info('============= START : Update split request Co ===========')

        const splitAsBytes = await ctx.stub.getState(key)
        if (!splitAsBytes || splitAsBytes.length === 0) {
            throw new Error(`${key} does not exist`)
        }

        let splitRequest = JSON.parse(splitAsBytes.toString())

        for (let i = 0; i < splitRequest.UserRequest.length; i++) {
            if (Object.keys(splitRequest.UserRequest[i]) == userId) {
                splitRequest.UserRequest[i][userId] = true
            }
        }

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(splitRequest)))
        console.info('============= END : Update split request Co ===========')
    }

    async queryAllSplitRequest(ctx) {
        let queryString = {}
        queryString.selector = { "docType": "split" }
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
        let result = await this.getIteratorData(iterator)
        return JSON.stringify(result)
    }

    async queryOneSplitRequest(ctx, key) {
        const splitAsBytes = await ctx.stub.getState(key)
        if (!splitAsBytes || splitAsBytes.length === 0) {
            return 'Not found'
        }
        console.log(splitAsBytes.toString())
        return splitAsBytes.toString()
    }

    async queryOwnerSplitRequest(ctx, userId) {
        let queryString = {}
        queryString.selector = { "docType": "split", "UserRequest": userId }
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
        let result = await this.getIteratorData(iterator)

        let query1 = {}
        let query2 = {}
        query1[userId] = false
        query2[userId] = true
        let queryString2 = {}
        queryString2.selector = {
            "UserRequest": {
                "$or": [
                    {
                        "$elemMatch": {
                            "$eq": query1
                        }
                    },
                    {
                        "$elemMatch": {
                            "$eq": query2
                        }
                    }
                ]
            },
            "docType": "split"
        }

        let iterator2 = await ctx.stub.getQueryResult(JSON.stringify(queryString2))
        let result2 = await this.getIteratorData(iterator2)
        let allResult = [...result, ...result2]
        return JSON.stringify(allResult)
    }


    async checkLengthSplitRequest(ctx) {
        let queryString = {}
        queryString.selector = { "docType": "split" }
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
        let result = await this.getIteratorData(iterator)
        return JSON.stringify(result)
    }

    async getIteratorData(iterator) {

        let resultArray = []

        while (true) {
            let res = await iterator.next()
            let resJson = {}

            if (res.value && res.value.value.toString()) {
                console.log(`res value: ${res.value.value.toString('utf8')}`)
                resJson.key = res.value.key
                resJson.value = JSON.parse(res.value.value.toString('utf-8'))
                resultArray.push(resJson)
            }

            if (res.done) {
                await iterator.close()
                return resultArray
            }
        }
    }
}

module.exports = Split