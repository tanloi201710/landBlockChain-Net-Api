/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

const StatusOwner = {
    Alone: "Một người",
    CoOwner: "Nhiều người"
}

const StatusLane = {
    NotApprovedYet: "Chưa duyệt",
    Transfering: "Đang chuyển",
    Done: "Đã duyệt"
}

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const lands = [
            {
                UserId: "phn@gmail.com",
                Owner: "Phạm Hiếu Nghĩa",
                ThuaDatSo: 931,
                ToBanDoSo: 3,
                CacSoThuaGiapRanh: '919, 905,803',
                DienTich: 393.1,
                ToaDoCacDinh: {
                    "D1": [406836.70, 1183891.04], "D2": [406836.75, 1183891.44],
                    "D3": [406836.80, 1183891.37], "D4": [406836.79, 1183891.40]
                },
                ChieuDaiCacCanh: { "C12": 20.5, "C23": 1.12, "C34": 7.53, "C41": 15.5 },
                HinhThucSuDung: "Sử dụng riêng",
                MucDichSuDung: "Đất đai nông thôn",
                ThoiHanSuDung: "Lâu dài",
                NguonGocSuDung: "Nhà nưóc giao đất có thu tiền sử dụng",
                ThoiGianDangKy: "09:12-11/11/2021",
                Status: "Chưa duyệt",
                ImageUrl: "",
                Transactions: [],
                Address: "P.12, Q.1, TP.HCM"

            },
            {
                UserId: "phn@gmail.com",
                Owner: "Phạm Hiếu Nghĩa",
                ThuaDatSo: 931,
                ToBanDoSo: 3,
                CacSoThuaGiapRanh: '919, 905,803',
                DienTich: 393.1,
                ToaDoCacDinh: {
                    "D1": [406836.70, 1183891.04], "D2": [406836.75, 1183891.44],
                    "D3": [406836.80, 1183891.37], "D4": [406836.79, 1183891.40]
                },
                ChieuDaiCacCanh: { "C12": 20.5, "C23": 1.12, "C34": 7.53, "C41": 15.5 },
                HinhThucSuDung: "Sử dụng riêng",
                MucDichSuDung: "Đất đai nông thôn",
                ThoiHanSuDung: "Lâu dài",
                NguonGocSuDung: "Nhà nưóc giao đất có thu tiền sử dụng",
                ThoiGianDangKy: "09:12-11/11/2021",
                Status: "Chưa duyệt",
                ImageUrl: "",
                Transactions: [],
                Address: "P.5, Q.Bình Tân, TP.HCM"

            },
            {
                UserId: "phn@gmail.com",
                Owner: "Phạm Hiếu Nghĩa",
                ThuaDatSo: 931,
                ToBanDoSo: 3,
                CacSoThuaGiapRanh: '919, 905,803',
                DienTich: 393.1,
                ToaDoCacDinh: {
                    "D1": [406836.70, 1183891.04], "D2": [406836.75, 1183891.44],
                    "D3": [406836.80, 1183891.37], "D4": [406836.79, 1183891.40]
                },
                ChieuDaiCacCanh: { "C12": 20.5, "C23": 1.12, "C34": 7.53, "C41": 15.5 },
                HinhThucSuDung: "Sử dụng riêng",
                MucDichSuDung: "Đất đai nông thôn",
                ThoiHanSuDung: "Lâu dài",
                NguonGocSuDung: "Nhà nưóc giao đất có thu tiền sử dụng",
                ThoiGianDangKy: "09:12-11/11/2021",
                Status: "Chưa duyệt",
                ImageUrl: "",
                Transactions: [],
                Address: "TP.HCM"

            },

            {
                UserId: ["phn@gmail.com", "ntt@gmail.com"],
                Owner: ["Phạm Hiếu Nghĩa", "Ngô Tấn Thành"],
                ThuaDatSo: 931,
                ToBanDoSo: 3,
                CacSoThuaGiapRanh: '919, 905,803',
                DienTich: 393.1,
                ToaDoCacDinh: {
                    "D1": [406836.70, 1183891.04], "D2": [406836.75, 1183891.44],
                    "D3": [406836.80, 1183891.37], "D4": [406836.79, 1183891.40]
                },
                ChieuDaiCacCanh: { "C12": 20.5, "C23": 1.12, "C34": 7.53, "C41": 15.5 },
                HinhThucSuDung: "Sử dụng riêng",
                MucDichSuDung: "Đất đai nông thôn",
                ThoiHanSuDung: "Lâu dài",
                NguonGocSuDung: "Nhà nưóc giao đất có thu tiền sử dụng",
                ThoiGianDangKy: "09:12-11/09/2021",
                Status: "Đang chuyển",
                ImageUrl: "",
                Transactions: [],
                Address: "Long Xuyên, An Giang"

            },
            {
                UserId: ["phn@gmail.com", "htl@gmail.com"],
                Owner: ["Phạm Hiếu Nghĩa", "Hồ Tấn Lợi"],
                ThuaDatSo: 931,
                ToBanDoSo: 3,
                CacSoThuaGiapRanh: '919, 905,803',
                DienTich: 393.1,
                ToaDoCacDinh: {
                    "D1": [406836.70, 1183891.04], "D2": [406836.75, 1183891.44],
                    "D3": [406836.80, 1183891.37], "D4": [406836.79, 1183891.40]
                },
                ChieuDaiCacCanh: { "C12": 20.5, "C23": 1.12, "C34": 7.53, "C41": 15.5 },
                HinhThucSuDung: "Sử dụng riêng",
                MucDichSuDung: "Đất đai nông thôn",
                ThoiHanSuDung: "Lâu dài",
                NguonGocSuDung: "Nhà nưóc giao đất có thu tiền sử dụng",
                ThoiGianDangKy: "09:12-11/09/2021",
                Status: "Chưa duyệt",
                ImageUrl: "",
                Transactions: [],
                Address: "Chợ Mới, An Giang"

            },
            {
                UserId: ["pnh@gmail.com", "htl@gmail.com"],
                Owner: ["Phạm Ngọc Hân", "Hồ Tấn Lợi"],
                ThuaDatSo: 931,
                ToBanDoSo: 3,
                CacSoThuaGiapRanh: '919, 905,803',
                DienTich: 393.1,
                ToaDoCacDinh: {
                    "D1": [406836.70, 1183891.04], "D2": [406836.75, 1183891.44],
                    "D3": [406836.80, 1183891.37], "D4": [406836.79, 1183891.40]
                },
                ChieuDaiCacCanh: { "C12": 20.5, "C23": 1.12, "C34": 7.53, "C41": 15.5 },
                HinhThucSuDung: "Sử dụng riêng",
                MucDichSuDung: "Đất đai nông thôn",
                ThoiHanSuDung: "Lâu dài",
                NguonGocSuDung: "Nhà nưóc giao đất có thu tiền sử dụng",
                ThoiGianDangKy: "09:12-11/09/2021",
                Status: "Chưa duyệt",
                ImageUrl: "",
                Transactions: [],
                Address: "Ninh Kiều, Cần Thơ"

            },
            {
                UserId: ["pnh@gmail.com", "htl@gmail.com"],
                Owner: ["Phạm Ngọc Hân", "Hồ Tấn Lợi"],
                ThuaDatSo: 931,
                ToBanDoSo: 3,
                CacSoThuaGiapRanh: '919, 905,803',
                DienTich: 393.1,
                ToaDoCacDinh: {
                    "D1": [406836.70, 1183891.04], "D2": [406836.75, 1183891.44],
                    "D3": [406836.80, 1183891.37], "D4": [406836.79, 1183891.40]
                },
                ChieuDaiCacCanh: { "C12": 20.5, "C23": 1.12, "C34": 7.53, "C41": 15.5 },
                HinhThucSuDung: "Sử dụng riêng",
                MucDichSuDung: "Đất đai nông thôn",
                ThoiHanSuDung: "Lâu dài",
                NguonGocSuDung: "Nhà nưóc giao đất có thu tiền sử dụng",
                ThoiGianDangKy: "09:12-11/09/2021",
                Status: "Chưa duyệt",
                ImageUrl: "",
                Transactions: [],
                Address: "Cái Răng, Cần Thơ"

            },
        ];

        for (let i = 0; i < lands.length; i++) {
            lands[i].docType = 'land';
            await ctx.stub.putState('LAND' + i, Buffer.from(JSON.stringify(lands[i])));
            console.info('Added <--> ', lands[i]);
        }

        const Transfers = [
            {
                TimeStart: "01/03/2021",
                TimeEnd: "10/03/2021",
                From: "ntt@gmail.com",
                To: "htl@gmail.com",
                ConfirmFromReceiver: false,
                ConfirmFromAdmin: false,
                Land: "LAND0"
            }
        ]
        for (let i = 0; i < Transfers.length; i++) {
            Transfers[i].docType = 'trans';
            await ctx.stub.putState('TRANS' + i, Buffer.from(JSON.stringify(Transfers[i])));
            console.info('Added <--> ', Transfers[i]);
        }

        const Tokens = [
            {
                Transfer: "",
                UserId: "",
                MoneyDetention: 200,
            }
        ]
        for (let i = 0; i < Tokens.length; i++) {
            Tokens[i].docType = 'token';
            await ctx.stub.putState('TOKENS' + i, Buffer.from(JSON.stringify(Tokens[i])));
            console.info('Added <--> ', Tokens[i]);
        }

        console.info('============= END : Initialize Ledger ===========');


    }

    async createLand(ctx, userId, owner, thuasodat,
        tobandoso, cacsothuagiapranh, dientich,
        toadocacdinh, chieudaicaccanh, hinhthucsudung,
        mucdichsudung, thoihansudung, nguongocsudung,
        thoigiandangky, url, address) {
        console.info('============= START : Create Land ===========');
        const land = {
            UserId: userId,
            Owner: owner,
            ThuaDatSo: thuasodat,
            ToBanDoSo: tobandoso,
            CacSoThuaGiapRanh: cacsothuagiapranh,
            DienTich: dientich,
            ToaDoCacDinh: toadocacdinh,
            ChieuDaiCacCanh: chieudaicaccanh,
            HinhThucSuDung: hinhthucsudung,
            MucDichSuDung: mucdichsudung,
            ThoiHanSuDung: thoihansudung,
            NguonGocSuDung: nguongocsudung,
            ThoiGianDangKy: thoigiandangky,
            Status: "Chưa duyệt",
            Transactions: [],
            docType: 'land',
            ImageUrl: url,
            Address: address,
        };
        let resultString = await this.checkLengthLand(ctx);
        let result = JSON.parse(resultString);
        await ctx.stub.putState(`LAND${result.length + 1}`, Buffer.from(JSON.stringify(land)));
        console.info('============= END : Create Land ===========');
    }

    async createLandCo(ctx, arrayOwner, arrayNameOwner, thuasodat, tobandoso, cacsothuagiapranh, dientich, toadocacdinh, chieudaicaccanh, hinhthucsudung, mucdichsudung, thoihansudung, nguongocsudung, thoigiandangky, url, address) {
        console.info('============= START : Create Land ===========');
        // let arrayOwnerResult = arrayOwner.split(',')
        // let arrayNameResult = arrayNameOwner.split(',')
        console.log(arrayOwner, arrayNameOwner)
        const land = {
            // ID:id,
            UserId: arrayOwner,
            Owner: arrayNameOwner,
            ThuaDatSo: thuasodat,
            ToBanDoSo: tobandoso,
            CacSoThuaGiapRanh: cacsothuagiapranh,
            DienTich: dientich,
            ToaDoCacDinh: JSON.parse(toadocacdinh),
            ChieuDaiCacCanh: JSON.parse(chieudaicaccanh),
            HinhThucSuDung: hinhthucsudung,
            MucDichSuDung: mucdichsudung,
            ThoiHanSuDung: thoihansudung,
            NguonGocSuDung: nguongocsudung,
            ThoiGianDangKy: thoigiandangky,
            Status: "Chưa duyệt",
            Transactions: [],
            docType: 'land',
            ImageUrl: url,
            Address: address,
        };
        let resultString = await this.checkLengthLand(ctx);
        let result = JSON.parse(resultString);
        // await ctx.stub.putState(`LAND${result.length + 1}`, Buffer.from(JSON.stringify(land)));
        console.info('============= END : Create Land ===========');
    }

    async checkLengthLand(ctx) {
        let queryString = {}
        queryString.selector = { "docType": "land" };
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);
        return JSON.stringify(result);
    }

    async queryLand(ctx, key) {
        const landAsBytes = await ctx.stub.getState(key); // get the car from chaincode state
        if (!landAsBytes || landAsBytes.length === 0) {
            // throw new Error(`${carNumber} does not exist`);
            return 'Not found';
        }
        console.log(landAsBytes.toString());
        return landAsBytes.toString();
    }

    async queryAllLands(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async checkLength(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return allResults.length;
    }

    async changeLandOwner(ctx, key, oldUserId, newUserId, newOwner, time) {
        console.info('============= START : Update Land ===========');

        const landAsBytes = await ctx.stub.getState(key); // get the land from chaincode state
        if (!landAsBytes || landAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        if (oldUserId.includes(",")) {
            oldUserId = oldUserId.split(',')
        }

        if (newUserId.includes(",")) {
            newUserId = newUserId.split(',')
        }


        if (newOwner.includes(",")) {
            newOwner = newOwner.split(',')
        }



        let newOb = {};
        newOb[time] = `Người sở hữu cũ :  { ${oldUserId} } chuyển cho người sở hữu mới { ${newUserId} }`
        let land = JSON.parse(landAsBytes.toString());
        land.Owner = newOwner;
        land.UserId = newUserId;
        let newTransactions = land.Transactions;
        newTransactions.push(newOb)
        land.Transactions = newTransactions;

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(land)));
        console.info('============= END : Update Land ===========');
    }

    async updateStatusLand(ctx, key, status) {
        console.info('============= START : Update Land ===========');

        const updateAsBytes = await ctx.stub.getState(key); // get the land from chaincode state
        if (!updateAsBytes || updateAsBytes.length === 0) {
            throw new Error(`${key} la keylane`);
        }

        let land = JSON.parse(updateAsBytes.toString());
        land.Status = status;

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(land)));
        console.info('============= END : Update Land ===========');
    }

    async checkLandOwner(ctx, key, userId) {

        const checkAsBytes = await ctx.stub.getState(key);
        if (!checkAsBytes || checkAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        let check = JSON.parse(checkAsBytes.toString());
        if (check.UserId == userId) {
            return true;
        }

        return false;
    }

    async checkLandOwnerCo(ctx, key, userId) {

        const checkAsBytes = await ctx.stub.getState(key);
        if (!checkAsBytes || checkAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        let check = JSON.parse(checkAsBytes.toString());
        if (check.coOwner.includes(userId)) {
            return true;
        }

        return false;
    }


    async queryLandByAdmin(ctx) {
        let queryString = {}
        queryString.selector = { docType: 'land' };
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);
        return JSON.stringify(result);
    }

    async queryLandByUser(ctx, userId) {
        let queryString = {}
        queryString.selector = { "UserId": userId, docType: 'land' };
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);
        return JSON.stringify(result);
    }

    async queryLandByUserCo(ctx, userId) {
        let queryString = {}
        queryString.selector = {
            "UserId": {
                "$elemMatch": {
                    "$eq": userId
                }
            }, "docType": "land"
        };

        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);
        return JSON.stringify(result);
    }

    async getIteratorData(iterator) {

        let resultArray = []

        while (true) {
            let res = await iterator.next()
            let resJson = {}

            if (res.value && res.value.value.toString()) {
                console.log(`res value: ${res.value.value.toString('utf8')}`);
                resJson.key = res.value.key;
                resJson.value = JSON.parse(res.value.value.toString('utf-8'));
                resultArray.push(resJson)
            }

            if (res.done) {
                await iterator.close()
                return resultArray;
            }
        }
    }

    async searchWithCondition(ctx, query) {
        // let query  = {"docType":"land"};
        // query[typeSearch] = keySearch;
        let queryString = {}

        queryString.selector = JSON.parse(query);
        console.log(`QUERYY: ${JSON.stringify(query)}`)
        console.log(`QUERYYYYYYYYYYYYYYYYYYYY: ${JSON.stringify(queryString)}`)

        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);

        return JSON.stringify(result);
    }

    // modify land

    async modifyLand(ctx, key, userId, owner, thuasodat, tobandoso,
        cacsothuagiapranh, dientich, toadocacdinh, chieudaicaccanh,
        hinhthucsudung, mucdichsudung, thoihansudung,
        nguongocsudung, url, city) {
        console.info('============= START : Update Land ===========');

        const updateAsBytes = await ctx.stub.getState(key); // get the land from chaincode state
        if (!updateAsBytes || updateAsBytes.length === 0) {
            throw new Error(`${key} la keylane`);
        }

        console.log("toadocacdinhh 1 " + chieudaicaccanh)
        console.log("toadocacdinhh 2 " + typeof chieudaicaccanh)


        console.log("toadocacdinhh 4 " + toadocacdinh)
        console.log("toadocacdinhh 5 " + typeof toadocacdinh)

        if (userId.includes(",")) {
            userId = userId.split(',')
        }

        if (owner.includes(",")) {
            owner = owner.split(',')
        }

        let land = JSON.parse(updateAsBytes.toString());
        land.UserId = userId;
        land.Owner = owner;
        land.ThuaDatSo = thuasodat;
        land.ToBanDoSo = tobandoso;
        land.CacSoThuaGiapRanh = cacsothuagiapranh;
        land.DienTich = dientich;
        land.ToaDoCacDinh = JSON.parse(toadocacdinh);
        land.ChieuDaiCacCanh = JSON.parse(chieudaicaccanh);
        land.HinhThucSuDung = hinhthucsudung;
        land.MucDichSuDung = mucdichsudung;
        land.ThoiHanSuDung = thoihansudung;

        land.NguonGocSuDung = nguongocsudung;

        land.UrlImage = url;
        land.LaneOfCity = city;

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(land)));
        console.info('============= END : Update Land ===========');
    }

}

module.exports = FabCar;



