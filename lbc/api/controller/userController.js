const jwt = require('jsonwebtoken')
const { saveMessage, getUser, getAllUser, saveUser, saveUserAdmin,
    updateInfo, getAllUserManager, getMessage,
    saveUserManager, deleteUserManager, readMessage, createPost, getPosts, deletePost } = require('./firebaseController');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const fabric = require('../fabricController')

const organizationsCA = ['ca.org1.example.com', 'ca.org2.example.com'];
const mspOrg = ['Org1MSP', 'Org2MSP'];
const affiliations = ['org1.department1', 'org2.department2'];


function userController() {
    return {

        async handleLogin(req, res) {

            const { email, password } = req.body
            const listUser = await getUser(email);
            if (listUser.length > 0) {
                let user = listUser[0]
                bcrypt.compare(password, user.password, async function (err, result) {
                    if (result) {
                        const accessToken = jwt.sign(
                            {
                                userId: user.userId,
                                role: user.role
                            },
                            process.env.JWT_SEC,
                            { expiresIn: "3d" }
                        )

                        const { password, ...others } = user
                        return res.status(200).json({ error: false, user: { ...others, accessToken } })
                    }
                    else {
                        return res.json({ error: true, message: 'Sai email hoặc mật khẩu!' })
                    }
                });
            } else {
                return res.json({ error: true, message: 'Lỗi Server, đăng nhập không thành công!' })

            }
        },

        async handleRegister(req, res) {
            let { phoneNumber, idCard, fullName, password, email, birthDay } = req.body

            if (phoneNumber[0] == "0") {
                phoneNumber = "+84" + phoneNumber.slice(1)
            }

            const existUser = await getUser(email)

            if (existUser.length === 0) {

                bcrypt.hash(password, saltRounds, async function (err, hash) {
                    // Store hash in your password DB.
                    if (err) {
                        return res.json({ error: true, message: 'Lỗi hệ thống, đăng ký không thành công!' })
                    }
                    try {
                        await saveUser(email, fullName, phoneNumber, idCard, hash, birthDay)
                        await fabric.enrollAdmin();
                        await saveMessage(email, "Chào mừng bạn đã tham gia hệ thống")
                        await fabric.register(email, mspOrg[0], organizationsCA[0], affiliations[0])

                        return res.status(200).json({ error: false, message: 'Đăng ký thành công!' })
                    } catch (error) {
                        console.log("ERROR: " + error)

                        return res.json({ error: true, message: 'Lỗi hệ thống, đăng ký không thành công!' })
                    }
                });
            } else {
                return res.json({ error: true, message: 'Email đã được đăng ký!' })
            }

        },

        //admin

        async handleAddManager(req, res) {
            let { userId, password, fullname, city, phoneNumber } = req.body

            if (phoneNumber[0] == "0") {
                phoneNumber = "+84" + phoneNumber.slice(1)
            }

            bcrypt.hash(password, saltRounds, async function (err, hash) {
                // Store hash in your password DB.
                if (err) {
                    return res.json({ error: true, message: 'Lỗi, Đăng ký quản lý không thành công!' })
                }
                try {
                    await saveUserManager(userId, hash, fullname, city, phoneNumber)
                    await fabric.register(userId, mspOrg[0], organizationsCA[0], affiliations[0])

                    return res.status(200).json({ error: false, message: 'Đăng ký quản lý thành công' })
                } catch (error) {
                    console.log("ERROR: " + error)

                    return res.json({ error: true, message: 'Lỗi hệ thống, đăng ký không thành công!' })
                }


            });

        },

        async adminDeleteManager(req, res) {

            const { userId } = req.params

            try {
                await deleteUserManager(userId)

                return res.json({ error: false, message: 'Xóa quản lý thành công!' })
            } catch (error) {
                console.log(error)
                return res.json({ error: true, message: 'Lỗi hệ thống, không thể xóa quản lý' })
            }

        },

        async initUsers(req, res) {
            const nva = "htl@gmail.com"
            const nvb = "anguyen@gmail.com"
            const nvc = "bnguyen@gmail.com"
            const nvd = "ctran@gmail.com"
            const admin = "admin@gmail.com"
            await fabric.register(nva, mspOrg[0], organizationsCA[0], affiliations[0]),
                await fabric.register(nvb, mspOrg[0], organizationsCA[0], affiliations[0]),
                await fabric.register(nvc, mspOrg[0], organizationsCA[0], affiliations[0]),
                await fabric.register(nvd, mspOrg[0], organizationsCA[0], affiliations[0]),
                await fabric.register(admin, mspOrg[0], organizationsCA[0], affiliations[0]),


                bcrypt.hash('123456', saltRounds, async (err, hash) => {
                    // Store hash in your password DB.
                    if (err) {
                        // req.flash('error', 'Có lỗi xảy ra ! Đăng ký không thành công');
                        return res.json({ error: true, message: err });
                    }
                    await saveUserAdmin(hash)

                    await saveUser(nva, "Hồ Tấn Lợi", "+84334131019", "104949231", hash, '10/17/2000', '')
                    await saveUser(nvb, "Nguyễn Văn A", "+84795517167", "313456789", hash, '08/14/2000', '')
                    await saveUser(nvc, "Nguyễn Thị B", "+84796425188", "890494094", hash, '11/21/2000', '')
                    await saveUser(nvd, "Trần Văn C", "+84795678253", "908488212", hash, '09/18/2000', '')
                })

            res.status(200).json({ error: false, message: 'Init users successfully!' })
        },

        async handleAddToken(req, res) {
            const userId = req.user.userId
            const { amount, recipient } = req.body

            try {
                await fabric.inkvode_token(userId, amount, recipient)
                res.status(200).json({ error: false, message: 'Thêm token thành công!' })
            } catch (error) {
                res.json({ error: true, message: 'Lỗi hệ thống, thêm token không thành công!' })
            }

        },

        async handleCheckPassword(req, res) {
            const { password } = req.body
            const userId = req.user.userId

            const listUser = await getUser(userId)
            console.log(listUser[0])
            if (listUser.length > 0) {
                let user = listUser[0]
                bcrypt.compare(password, user.password, async function (err, result) {
                    if (result) {
                        res.status(200).json({ error: false })
                    }
                    else {
                        return res.json({ error: true, message: 'Mật khẩu không đúng' })
                    }
                });
            } else {
                return res.json({ error: true, message: 'Lỗi Server, xác nhận mật khẩu không thành công' })
            }
        },

        async handleReadMessages(req, res) {
            const userId = req.user.userId
            try {
                await readMessage(userId)
                res.status(200).json({ error: false, message: 'Đã đọc tất cả thông báo' })
            } catch (error) {
                console.log('ERROR ', error)
                res.json({ error: true, message: 'Lỗi hệ thống, đọc thông báo không thành công' })
            }
        },

        async handleGetPost(req, res) {
            try {
                const result = await getPosts()
                res.status(200).json({ error: false, posts: result })
            } catch (error) {
                console.log('ERROR: ', error)
                res.json({ error: true, message: 'Lỗi hệ thống, lấy dữ liệu không thành công' })
            }
        },

        async handleAddPost(req, res) {
            const { land, price, desc, img } = req.body
            const userId = req.user.userId
            try {
                await createPost(userId, land, price, desc, img)

                let landString = await fabric.queryLand(land, userId)
                let currentLand = JSON.parse(landString)

                await fabric.updateLand(userId, land, "Đang rao bán")

                if (typeof currentLand.UserId == "object") {
                    const otherUser = currentLand.UserId.filter(user => user !== userId)
                    for (let i = 0; i < otherUser.length; i++) {
                        await saveMessage(otherUser[i], `Chủ sở hữu ${userId}, đã đăng bán mảnh đất có mã ${land}`)
                    }
                }
                await saveMessage(userId, `Bạn đã đăng bán mảnh đất có mã ${land}`)
                res.status(200).json({ error: false, message: 'Đăng bài viết thành công' })
            } catch (error) {
                res.json({ error: true, message: 'Lỗi hệ thống, đăng bài viết không thành công' })
            }

        },

        async handleDeletePost(req, res) {
            const { land } = req.params

            console.log('Delete post have key land', land)

            try {
                await deletePost(land)
                await fabric.updateLand(req.user.userId, land, "Đã duyệt")

                await saveMessage(req.user.userId, `Bạn đã dừng đăng bán mảnh đất có mã ${land}`)
                res.status(200).json({ error: false, message: 'Xóa bài biết thành công' })
            } catch (error) {
                res.json({ error: true, message: 'Lỗi hệ thống, xóa bài viết không thành công' })
            }
        },

        async adminGetManager(req, res) {
            try {
                const managers = await getAllUserManager()
                res.status(200).json({ error: false, managers })
            } catch (error) {
                res.json({ error: true, message: 'Lỗi hệ thống, không lấy được dữ liệu' })
            }
        },

        //statistical
        async statistical(req, res) {
            // const {typeSearch, fromTime,toTime} = req.body;
            // let result;
            // if(fromTime != "" && toTime != ""){
            //     let dateFromTime = new Date(fromTime);
            //     let dateFromTo = new Date(toTime);
            //     let list1 = [];
            //     let listAllLandString = await queryAllLandsCoUserAndAdmin(req.session.user.userId,res.session.user.role);
            //     let listAllLand = JSON.parse(listAllLandString);

            //     for(let i = 0; i < listAllLand.length; i++){

            //         let arrayDate = listAllLand[i].value.ThoiGianDangKy.split('-')
            //         let splitDate= arrayDate[1].split('/');
            //         let convertDateString = splitDate[2]+'-'+splitDate[1]+'-'+splitDate[0];
            //         let dateLand = new Date(convertDateString)

            //         if(dates.inRange(dateLand,fromTime,toTime)){
            //             list1.push(listAllLand[i])
            //         };
            //     }
            //     console.log(`dateFromTime : ${dateFromTime}`)
            //     console.log(`dateFromTo : ${dateFromTo}`)
            //     console.log(`list1 : ${list1}`)
            //     result = list1;
            // }
            return res.render("statistical")

        },

        async detailStatistical(req, res) {
            const { type } = req.body;
            return res.render("detail_statistical", { layout: false, type: type })
        },

        async dataDetailStatistical(req, res) {

            const userId = req.session.user.userId;
            const role = req.session.user.role;
            const { fromTime, toTime, type } = req.body;

            console.log("FROMTIME :" + fromTime)
            console.log("FROMTIME22222 :" + toTime)


            let listResult = [];

            if (type == "land") {
                let listResultString = await fabric.queryAllLandsCoUserAndAdmin(userId, role)
                let listLand = JSON.parse(listResultString);
                if (fromTime != "" && toTime != "") {
                    let dateFromTime = new Date(fromTime);
                    let dateFromTo = new Date(toTime);
                    for (let i = 0; i < listLand.length; i++) {
                        let arrayDate = listLand[i].value.ThoiGianDangKy.split('-')
                        let splitDate = arrayDate[1].split('/');
                        let convertDateString = splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
                        let dateLand = new Date(convertDateString)

                        if (dates.inRange(dateLand, dateFromTime, dateFromTo)) {
                            listResult.push(listLand[i]);
                        }
                    }
                } else {
                    listResult = listLand;
                }



            } else {
                console.log("VAO DAYYYYYYYYYYYYYYYYYYYYYYYYYY")
                let listLand = await getAllUser();
                if (fromTime != "" && toTime != "") {
                    let dateFromTime = new Date(fromTime);
                    let dateFromTo = new Date(toTime);
                    console.log("VAO DAYYYYYYYYYYYYYYYYYYYYYYYYYY222222222222")

                    for (let i = 0; i < listLand.length; i++) {
                        let dateHandle = listLand[i].Date.split("/");
                        let dateFormat = `${dateHandle[2]}-${dateHandle[1]}-${dateHandle[0]}`;
                        let dateLand = new Date(dateFormat);
                        console.log("DATE : " + dateFormat)
                        console.log("DATE2 : " + dateLand)


                        if (dates.inRange(dateLand, dateFromTime, dateFromTo)) {
                            listResult.push(listLand[i]);
                        }

                    }
                } else {
                    console.log("VAO DAYYYYYYYYYYYYYYYYYYYYYYYYYY333333333333")
                    listResult = listLand;
                }

            }



            return res.render("data_detail_statistical", { layout: false, listResult: listResult, type: type })
        },

        //Search
        async searchWithCondition(req, res) {
            const userId = req.user.userId;
            const { keySearch, typeSearch, fromTime, toTime } = req.body;

            const roleUser = req.user.role;

            let query = { "docType": "land" };

            let allMenu;
            let listLandCo = [];
            let status;
            let listAllLand = [];

            if (typeSearch == "approved") {
                query["Status"] = "Đã duyệt";
                status = "Đã duyệt";
            } else if (typeSearch == "notApprovedYet") {
                query["Status"] = "Chưa duyệt";
                status = "Chưa duyệt";
            } else if (typeSearch == "transfering") {
                query["Status"] = "Đang chuyển";
                status = "Đang chuyển";
            } else if (typeSearch == "keyLand") {
                status = "keyLand";
            } else {
                status = "UserId";
            }


            console.log(keySearch == undefined)
            if (keySearch != "" && keySearch != undefined) {
                console.log("DA VAO DAYyyyyyyyyyyyyyyyyyyyyyyy ")
                let listLandCoString;
                let listLandCoFilter;

                if (status != "UserId" && status != "keyLand") {
                    listLandCoString = await fabric.searchWithCondition(userId, JSON.stringify(query));;
                    listLandCoFilter = JSON.parse(listLandCoString);
                    listLandCo = listLandCoFilter.filter((element) => element.Status == status);
                }

                if (status == "UserId") {
                    listLandCoString = await fabric.queryAllLandsCo(userId, keySearch.trim());
                    listLandCoFilter = JSON.parse(listLandCoString);
                    listLandCo = listLandCoFilter;
                    query['UserId'] = keySearch.trim();
                    console.log("QUERY : " + query)
                    let listAllLandString = await fabric.searchWithCondition(userId, JSON.stringify(query));
                    listAllLand = JSON.parse(listAllLandString);
                }


                if (status == "keyLand") {
                    if (roleUser == "user") {
                        const menuString = await fabric.queryAllLands(req.session.user.userId, req.session.user.role);
                        const menuCoString = await fabric.queryAllLandsCoUserAndAdmin(req.session.user.userId, req.session.user.role);
                        const menu = JSON.parse(menuString);
                        const menuCo = JSON.parse(menuCoString);
                        let result = [...menu, ...menuCo];
                        console.log("RESULT : " + JSON.stringify(result))
                        for (let i = 0; i < result.length; i++) {

                            console.log("OKOK")

                            let getKeyInResult = result[i]["key"];
                            let keyUserInput = keySearch.trim();

                            console.log("getKeyInResult " + getKeyInResult)
                            console.log("keyUserInput " + keyUserInput)


                            if (getKeyInResult == keyUserInput) {
                                console.log("DA BANG")
                                listAllLand.push(result[i])
                            }
                        }
                    } else {
                        let listAllLandString = await fabric.searchWithCondition(userId, JSON.stringify(query));
                        listLandCoFilter = JSON.parse(listAllLandString);
                        for (let i = 0; i < listLandCoFilter.length; i++) {

                            let getKeyInResult = listLandCoFilter[i]["key"];
                            let keyUserInput = keySearch.trim();

                            if (getKeyInResult == keyUserInput) {
                                console.log("DA BANG")
                                listAllLand.push(listLandCoFilter[i])
                            }
                        }
                    }

                }



            } else {
                if (roleUser == "user") {
                    if (status != "keyLand") {

                        const menuString = await fabric.queryAllLands(req.user.userId, req.user.role);
                        const menuCoString = await fabric.queryAllLandsCoUserAndAdmin(req.user.userId, req.user.role);
                        const menu = JSON.parse(menuString);
                        const menuCo = JSON.parse(menuCoString);
                        let result = [...menu, ...menuCo];
                        listAllLand = result.filter((element) => element.value.Status == status);

                    } else {
                        const menuString = await fabric.queryAllLands(req.user.userId, req.user.role);
                        const menuCoString = await fabric.queryAllLandsCoUserAndAdmin(req.user.userId, req.user.role);
                        const menu = JSON.parse(menuString);
                        const menuCo = JSON.parse(menuCoString);
                        listAllLand = [...menu, ...menuCo];
                    }

                } else {
                    let listAllLandString = await fabric.searchWithCondition(userId, JSON.stringify(query));
                    listAllLand = JSON.parse(listAllLandString);
                }

            }


            allMenu = [...listAllLand, ...listLandCo];


            if (fromTime != "" && toTime != "") {
                let dateFromTime = new Date(fromTime);
                let dateFromTo = new Date(toTime);
                let list1 = [];
                console.log(`locao: ${JSON.stringify(listLandCo)}`)
                for (let i = 0; i < allMenu.length; i++) {

                    let arrayDate = allMenu[i].value.ThoiGianDangKy.split('-')
                    let splitDate = arrayDate[1].split('/');
                    let convertDateString = splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0];
                    let dateLand = new Date(convertDateString)

                    // console.log(dateLand > fromTime)
                    // console.log(dateLand > toTime)
                    if (dates.inRange(dateLand, fromTime, toTime)) {
                        list1.push(allMenu[i])
                    };
                }
                console.log(`dateFromTime : ${dateFromTime}`)
                console.log(`dateFromTo : ${dateFromTo}`)
                console.log(`list1 : ${list1}`)

                allMenu = list1;

            }

            return res.render("home", { menu: allMenu, keySearch: keySearch, typeSearch: status, success: req.flash('success') });


        },

        //typeof search

        async typeOfSearch(req, res) {

            const { typeOfSearch } = req.body;
            console.log(`typeof ${typeOfSearch}`)

            return res.render('typeOfSearch', { layout: false, typeOfSearch: typeOfSearch })
        },

        //infomation
        async infomation(req, res) {
            const userId = req.session.user.userId;
            let listUser = await getUser(userId);
            let user = listUser[0];
            console.log(user.fullname)
            user.numberPhone = "0" + user.numberPhone.slice(3);

            return res.render('info', { user: user })
        },

        async handleSaveInfo(req, res) {

            const newInfo = req.body
            const userId = req.user.userId

            if (newInfo.password != '') {
                bcrypt.hash(newInfo.password, saltRounds, async function (err, hash) {
                    if (err) {
                        return res.json({ error: true, message: 'Lỗi hệ thống, cập nhật thông tin không thành công' })
                    }
                    try {
                        newInfo.password = hash
                        await updateInfo(userId, newInfo)

                        return res.status(200).json({ error: false, message: 'Cập nhật thông tin thành công, bạn cần phải đăng nhập lại' })
                    } catch (error) {
                        console.log("ERROR: " + error)

                        return res.json({ error: true, message: 'Lỗi hệ thống, cập nhật thông tin không thành công' })
                    }
                })
            } else {
                try {
                    const currentUser = await getUser(userId)
                    newInfo.password = currentUser[0].password
                    await updateInfo(userId, newInfo)

                    // if (newInfo.userId != userId) {
                    //     return res.status(200).json({ error: false, message: 'Cập nhật thông tin thành công, bạn cần phải đăng nhập lại' })
                    // }

                    const listUser = await getUser(userId)
                    const user = listUser[0]

                    const accessToken = jwt.sign(
                        {
                            userId: user.userId,
                            role: user.role
                        },
                        process.env.JWT_SEC,
                        { expiresIn: "3d" }
                    )

                    const { password, ...other } = user

                    return res.status(200).json({ error: false, message: 'Cập nhật thông tin thành công', user: { ...other, accessToken } })
                } catch (error) {
                    console.log('ERROR: ', error)
                    return res.json({ error: true, message: 'Lỗi hệ thống, cập nhật thông tin không thành công' })
                }
            }



        },

        // wallet

        async walletUser(req, res) {
            const userId = req.user.userId
            try {
                let balance = await fabric.inkvode_token_getBalance(userId)
                let accountIdToken = await fabric.inkvode_token_getAccountId(userId)

                return res.status(200).json({ error: false, balance, accountIdToken })
            } catch (error) {
                return res.json({ error: true, message: 'Lỗi hệ thống, không lấy được dữ liệu' })
            }

        },

        // transfer token
        async handleTransferToken(req, res) {

            const { from, to, amount } = req.body

            try {
                let getAccountIdReceiver = await fabric.inkvode_token_getAccountId(to)
                let getAccountIdSender = await fabric.inkvode_token_getAccountId(from)

                await fabric.inkvode_token_transfer(req.user.userId, getAccountIdSender, getAccountIdReceiver, amount)

                return res.status(200).json({ error: false, message: 'Chuyển tiền thành công' })
            } catch (error) {
                console.log('ERROR: ', error)
                return res.json({ error: true, message: 'Lỗi hệ thống, chuyển tiền không thành công' })
            }

        }

    }
}

var dates = {
    convert: function (d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0], d[1], d[2]) :
                    d.constructor === Number ? new Date(d) :
                        d.constructor === String ? new Date(d) :
                            typeof d === "object" ? new Date(d.year, d.month, d.date) :
                                NaN
        );
    },
    compare: function (a, b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a = this.convert(a).valueOf()) &&
                isFinite(b = this.convert(b).valueOf()) ?
                (a > b) - (a < b) :
                NaN
        );
    },
    inRange: function (d, start, end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(d = this.convert(d).valueOf()) &&
                isFinite(start = this.convert(start).valueOf()) &&
                isFinite(end = this.convert(end).valueOf()) ?
                start <= d && d <= end :
                NaN
        );
    }
}




module.exports = userController;