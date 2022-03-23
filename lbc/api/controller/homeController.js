const fabric = require('../fabricController')


const { saveMessage, getMessage, getUser } = require('./saveUser')

const saveMessageTransferLandSuccessLoop = require('./saveMessageLoop')


const getNow = require('./getDateNow')




const StatusLane = {
	NotApprovedYet: "Chưa duyệt",
	Transfering: "Đang chuyển",
	Done: "Đã duyệt"
}



function homeController() {
	return {
		async index(req, res) {
			try {
				let allLands
				const messages = await getMessage(req.user.userId)
				if (req.user.role === "user") {
					const menuString = await fabric.queryAllLands(req.user.userId, req.user.role)
					const menuCoString = await fabric.queryAllLandsCoUserAndAdmin(req.user.userId, req.user.role)
					const menu = JSON.parse(menuString)
					const menuCo = JSON.parse(menuCoString)

					allLands = [...menu, ...menuCo]

				} else if (req.user.role === "manager") {
					const menuString = await fabric.queryAllLands(req.user.userId, req.user.role)
					const menu = JSON.parse(menuString)
					allLands = menu
				} else {
					// admin
				}
				return res.status(200).json({ error: false, allLands, messages })

			} catch (error) {
				console.log("Login khong thanh cong : " + error)
				return res.json({ error: true })
			}

		},


		// async transferAdmin(req, res) {
		// 	const transString = await fabric.queryAllTransfer(req.session.user.userId);
		// 	const result = JSON.parse(transString);
		// 	return res.render("allTransfer", { menu: result })
		// },

		// async detail(req, res) {
		// 	const key = req.params.key;
		// 	const notFound = 'Not Found';
		// 	const userId = req.session.user.userId;
		// 	const detail = await fabric.queryLand(key, userId);
		// 	const obj = JSON.parse(detail);
		// 	console.dir(obj)

		// 	if (detail == 'Not found') {
		// 		return res.render("detail", { detail: notFound });
		// 	}

		// 	let requestPerson;
		// 	if (req.session.user.role == "manager") {
		// 		requestPerson = "manager";
		// 	} else {
		// 		requestPerson = "transferUser";
		// 	}

		// 	return res.render("detail", { detail: obj, key: key, requestPerson: requestPerson });

		// },

		// async detailReceive(req, res) {
		// 	const { key, keyTransfer, confirmed, position } = req.body;
		// 	console.log(`key :` + key)
		// 	const userId = req.session.user.userId;
		// 	try {
		// 		const detail = await fabric.queryLand(key, userId);
		// 		const obj = JSON.parse(detail);
		// 		return res.render("detail", { detail: obj, confirmed: confirmed, keyTransfer: keyTransfer, position: position, requestPerson: 'receiveUser' });
		// 	} catch (error) {
		// 		console.log("Loi roi" + error)
		// 		req.flash("error", "Xảy ra lỗi")
		// 		// return res.redirect("/receiveLand")
		// 		res.send("Loi roi")
		// 	}

		// },

		// async demoSubmit(req, res) {
		// 	try {
		// 		const toadocacdinh = '{"D1": [406836.70,1183891.04],"D2": [406836.75,1183891.44],"D3": [406836.80,1183891.37],"D4": [406836.79,1183891.40]}';
		// 		const chieudaicaccanh = '{"C12": 20.5, "C23": 1.12, "C34":7.53, "C41" :15.5}';
		// 		await invokeLandOne('Land5', 'Phuc Nguyen', "Nam", '12312312', 'Ca Mau', 192, 1, [123, 124, 125], 1200, toadocacdinh,
		// 			chieudaicaccanh,
		// 			"Chung", "Mua ban", "vinh vien", "Mua cua nha nuoc", "18/9/2025");
		// 		// res.send('OK');
		// 		res.redirect('http://localhost:3000/');
		// 	} catch (error) {
		// 		res.send(error);
		// 	}
		// },

		// async addAsset(req, res) {
		// 	res.render("addAssetHome")
		// },

		// async addAssetOne(req, res) {
		// 	res.render("addAsset", { layout: false })
		// },


		// async addAssetCo(req, res) {
		// 	res.render("addAssetCo", { layout: false })
		// },

		// async blank(req, res) {
		// 	res.render("blank", { layout: false })
		// },

		// async addAssetFormOwner(req, res) {
		// 	const { count, listCoOwner } = req.body;

		// 	let data = []
		// 	if (listCoOwner != "") {
		// 		data = listCoOwner.split(',')

		// 	}

		// 	let userId = req.session.user.userId;
		// 	let result = []
		// 	for (let el of data) {
		// 		if (el !== userId) {
		// 			result.push(el)
		// 		}
		// 	}

		// 	res.render("addAssetFormOwner", { layout: false, count: count, data: result })
		// },

		// //add coordinates
		// async addCoordinatesForm(req, res) {
		// 	const { count } = req.body;

		// 	console.log("count : " + count)
		// 	res.render("addCoordinatesForm", { layout: false, count: count })
		// },

		// //add lengths
		// async addLength(req, res) {
		// 	const count = req.body.count;
		// 	console.log("count : " + count)
		// 	res.render("addLength", { layout: false, count: count })
		// },


		// //các số thửa giáp ranh
		// async addParcels(req, res) {
		// 	const { count, parcels } = req.body;
		// 	let data = []
		// 	console.log(parcels);
		// 	if (parcels != "") {
		// 		data = parcels.split(",")
		// 	}
		// 	console.log('count ne : ' + parcels)
		// 	res.render('addParcels', { layout: false, count: count, data: data })
		// },




		async handleAddAsset(req, res) {
			const {
				chuSoHuu, thuaDatSo, toBanDoSo, dienTich,
				hinhThucSuDung, mucDichSuDung, thoiHanSuDung,
				nguonGoc, url, diaChi, toaDoCacDinh, doDaiCacCanh,
				cacSoThuaGiapRanh, nhaO, congTrinhKhac
			} = req.body;

			let parcels = Object.values(cacSoThuaGiapRanh)
			console.log(parcels, nhaO, congTrinhKhac)

			let thoigiandangky = getNow();

			const userId = req.user.userId;
			const owner = chuSoHuu.map(owner => owner.fullname)

			const check = await fabric.invoke_land_One(userId, owner, thuaDatSo,
				toBanDoSo, parcels, dienTich, JSON.stringify(toaDoCacDinh),
				JSON.stringify(doDaiCacCanh), hinhThucSuDung, mucDichSuDung,
				thoiHanSuDung, nguonGoc, thoigiandangky, nhaO, congTrinhKhac, url, diaChi);

			if (!check) {
				return res.json({ error: true, message: 'Xác thực người dùng thất bại, thêm đất mới không thành công!' })
			}
			await saveMessage(userId, "Bạn đã thêm một mảnh đất mới")

			res.status(200).json({ error: false, message: 'Đăng ký đất mới thành công!' });
		},

		async handleAddAssetCo(req, res) {
			const { chuSoHuu, thuaDatSo, toBanDoSo, dienTich,
				hinhThucSuDung, mucDichSuDung, thoiHanSuDung,
				nguonGoc, url, diaChi, toaDoCacDinh, doDaiCacCanh,
				cacSoThuaGiapRanh, nhaO, congTrinhKhac } = req.body;

			let listOwner = chuSoHuu.map(owner => owner.userId)
			let listNameOwner = chuSoHuu.map(owner => owner.fullname);

			let parcels = Object.values(cacSoThuaGiapRanh)

			let thoigiandangky = getNow();
			const userId = req.user.userId;

			try {
				const check = await fabric.invoke_land_Co(userId, JSON.stringify(listOwner),
					JSON.stringify(listNameOwner), thuaDatSo, toBanDoSo, parcels, dienTich,
					JSON.stringify(toaDoCacDinh), JSON.stringify(doDaiCacCanh), hinhThucSuDung,
					mucDichSuDung, thoiHanSuDung, nguonGoc, thoigiandangky, nhaO, congTrinhKhac, url, diaChi);

				if (!check) return res.json({ error: true, message: 'Xác thực người dùng thất bại, thêm đất mới không thành công!' })

				for (let i = 0; i < listOwner.length; i++) {
					await saveMessage(listOwner[i], "Bạn đã sở một mảnh đất mới gồm nhiều người sở hữu " + listOwner.join('-'))
				}

				res.status(200).json({ error: false, message: 'Đăng ký đất mới thành công!' })
			} catch (error) {
				console.log("Add Failed")
				res.json({ error: true, message: 'Lỗi, đăng ký đất mới không thành công!' });
			}

		},

		async handleTransferLand(req, res) {
			const { owners, land, amount } = req.body
			let userId = req.user.userId
			let owner = owners[0].userId
			let keyLand = land.key
			console.log('người đc chuyển: ' + owner)
			console.log('mãnh đất: ' + keyLand)
			console.log('người yêu cầu chuyển: ' + userId)

			try {
				// check Land is exist user
				let landString = await fabric.queryLand(keyLand, userId)
				let land = JSON.parse(landString);
				if (typeof land.UserId != "object") {		// just one owner

					if (land.UserId == userId) {			// and owner is this user
						let thoigiandangky = getNow();
						await fabric.inkvode_transfer_OneToOne(keyLand, userId, owner, thoigiandangky, amount)

						await fabric.updateLand(userId, keyLand, "Đang chuyển")
						await saveMessage(owner, `${userId} đang chuyển một mãnh đất cho bạn`)
						await saveMessage(userId, `Bạn đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${key} cho người sở hữu ${owner}`)

						return res.status(200).json({ error: false, message: `Đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${keyLand} cho người sở hữu ${owner}` })

					} else {
						req.flash("success", `Người dùng ${userId} không sở hữu mảnh đất ${key}`)
						return res.json({ error: true, message: `Lỗi, bạn không sỡ hữu mãnh đất ${keyLand}` })
					}

				} else {
					if (land.UserId.includes(userId)) {			// you are one of owners
						let thoigiandangky = getNow();

						await fabric.inkvode_transfer_CoToOne(keyLand, userId, land.UserId, owner, thoigiandangky, amount)
						await fabric.updateLand(userId, keyLand, "Đang chuyển")

						for (let i = 0; i < land.UserId.length; i++) {
							await saveMessage(land.UserId[i], `${userId} đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${keyLand} cho người sở hữu ${owner}`)
						}
						await saveMessage(owner, `Bạn nhận được yêu cầu nhận đất có mã số  ${keyLand} từ người sở hữu ${land.UserId.join('-')}`)

						return res.status(200).json({ error: false, message: `Đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${keyLand} cho người sở hữu ${owner}` })
					} else {
						return res.json({ error: true, message: `Lỗi, bạn không sỡ hữu mãnh đất ${keyLand}` })
					}
				}

			} catch (error) {
				console.log("LOIIIIIII : " + error);
				res.json({ error: true, message: 'Lỗi hệ thống, không thể chuyển quyền sử dụng đất' })
			}

		},

		async handleTransferLandCo(req, res) {
			const { owners, land, amount } = req.body;
			let listOwner = owners.map(owner => owner.userId)

			let userId = req.user.userId
			let keyLand = land.key
			console.log(`mãnh đất ${keyLand}`)
			console.log(`người yêu cầu: ${userId}`)
			console.log(`người được chuyển ${listOwner}`)

			try {
				// check Land is exist user
				let landString = await fabric.queryLand(keyLand, userId)
				let land = JSON.parse(landString);
				if (typeof land.UserId != "object") {		// just one owner
					if (land.UserId == userId) {			// and owner is this user
						let thoigiandangky = getNow();

						await fabric.inkvode_transfer_OneToCo(keyLand, userId, listOwner, thoigiandangky, amount)
						await fabric.updateLand(userId, keyLand, "Đang chuyển")
						await saveMessage(userId, `Bạn đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${keyLand} cho người sở hữu ${listOwner.join('-')}`)

						for (let i = 0; i < listOwner.length; i++) {
							await saveMessage(listOwner[i], `Bạn nhận được yêu cầu nhận đất do người sở hữu ${userId} chuyển cho bạn`)
						}

						res.status(200).json({ error: false, message: `Đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${keyLand} cho người sở hữu ${listOwner.join('-')}` })
					} else {
						res.json({ error: true, message: `Lỗi, bạn không sỡ hữu mãnh đất ${keyLand}` })
					}
				} else {
					if (land.UserId.includes(userId)) {			// you are one of owner
						let thoigiandangky = getNow();

						await fabric.inkvode_transfer_CoToCo(keyLand, userId, land.UserId, listOwner, thoigiandangky, amount)
						await fabric.updateLand(userId, keyLand, "Đang chuyển")

						for (let i = 0; i < land.UserId.length; i++) {
							await saveMessage(land.UserId[i], `${userId} đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${keyLand} cho người sở hữu ${listOwner.join('-')}`)
						}

						for (let i = 0; i < listOwner.length; i++) {
							await saveMessage(listOwner[i], `Bạn nhận được yêu cầu nhận đất do người sở hữu ${land.UserId.join('-')} chuyển cho bạn`)
						}

						res.status(200).json({ error: false, message: `Đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${keyLand} cho người sở hữu ${listOwner.join('-')}` })
					} else {
						res.json({ error: true, message: `Lỗi, bạn không sỡ hữu mãnh đất ${keyLand}` })
					}
				}
			} catch (error) {
				console.log(`LỖI: ${error}`)
				res.json({ error: true, message: 'Lỗi hệ thống, không thể chuyển quyền sử dụng đất!' })
			}

		},

		// async processTransfer(req, res) {
		// 	const { keyTransfer, confirmed, position } = req.body;
		// 	console.log(`keytransfer ${keyTransfer}`)
		// 	let dataString = await queryTransferOne(req.session.user.userId, keyTransfer);
		// 	let data = JSON.parse(dataString)
		// 	console.log(`confirmed : ${typeof confirmed}`)
		// 	// console.log(`confirmed2 : ${position}`)

		// 	// res.send("OK")
		// 	return res.render("processTransfer", { dataProcessTransfer: data, keyTransfer: keyTransfer, position: position, confirmed: confirmed })

		// },

		// async receiveLand(req, res) {
		// 	const transString = await queryAllTransferReceiver(req.session.user.userId);
		// 	const result = JSON.parse(transString);
		// 	return res.render("receiveLand", { result: result })
		// },

		// async transferLandOwner(req, res) {
		// 	const transString = await queryAllTransferOwner(req.session.user.userId);
		// 	// const transStringCo = await queryAllTransferOwnerCo(req.session.user.userId);
		// 	const result = JSON.parse(transString);
		// 	return res.render("transferedLand", { result: result, success: req.flash("success") })
		// },

		async handleConfirmFromReceiver(req, res) {
			const { key, userIdFromTransfer, amount } = req.body
			console.log(key)
			console.log(userIdFromTransfer)
			try {
				const userId = req.user.userId
				let allMoney = await fabric.inkvode_token_getBalance(userId);

				console.log(`allMoney : ${allMoney}`)

				if (typeof userIdFromTransfer != 'object') {
					if (parseInt(allMoney) >= parseInt(amount)) {
						await fabric.inkvode_token_detention(userId, key, amount)
					} else {
						console.log("Không đủ tiền nhận đất!")
						return res.json({ error: true, message: `Bạn không có đủ tiền để nhận đất, bạn có ${allMoney}/${amount}` })
					}
				}
				let thoigiandangky = getNow()


				await fabric.updateTransfer(userId, key, req.user.role, thoigiandangky)

				await saveMessage(userId, "Bạn đã nhận đất thành công")
				await saveMessage(userIdFromTransfer, `Người dùng ${userId} đã nhận mã đất ${key}`)

				return res.status(200).json({ error: false, message: 'Nhận đất thành công!' })


			} catch (error) {
				console.log("ERROR : " + error)
				res.json({ error: true, message: 'Lỗi hệ thống, nhận đất không thành công!' })
			}

		},

		async handleConfirmFromTransferCo(req, res) {
			const { key } = req.body

			const userId = req.user.userId
			try {

				await fabric.updateTransferCo(userId, key, "from")

				let transferString = await fabric.queryTransferOne(userId, key)
				let transfer = JSON.parse(transferString)

				await saveMessage(userId, `Bạn đã xác nhận chuyển đất { ${transfer.Land} } thành công`)
				for (let i = 0; i < Object.keys(transfer.From).length; i++) {
					await saveMessage(Object.keys(transfer.From)[i], `Người dùng ${userId} đã xác nhận chuyển mã đất ${transfer.Land}`)
				}

				res.status(200).json({ error: false, message: 'Xác nhận chuyển đất thành công!' });
			} catch (error) {
				console.log("ERROR : " + error)
				res.json({ error: true, message: 'Lỗi hệ thống, xác nhận chuyển đất không thành công!' })
			}

		},

		async handleConfirmFromReceiverCo(req, res) {
			const { keyTransfer } = req.body

			const userId = req.user.userId
			console.log(keyTransfer)
			try {
				await fabric.updateTransferCo(userId, keyTransfer, "to")

				let transferString = await fabric.queryTransferOne(userId, keyTransfer)
				let transfer = JSON.parse(transferString)

				await saveMessage(userId, "Bạn đã nhận đất thành công")
				for (let i = 0; i < Object.keys(transfer.From).length; i++) {
					await saveMessage(Object.keys(transfer.From)[i], `Người dùng ${userId} đã nhận mãnh đất có mã ${transfer.Land}`)
				}

				res.status(200).json({ error: false, message: 'Nhận đất thành công!' })
			} catch (error) {
				console.log("ERRRRRRROR: " + error)
				res.json({ error: true, message: 'Lỗi hệ thống, nhận đất không thành công!' })
			}

		},

		async updateStatusLandAdmin(req, res) {
			const { key, status, userId } = req.body
			console.log(key);
			console.log(status);
			try {
				await fabric.updateLand(req.user.userId, key, status)

				await saveMessage(userId, `Đất có mã ${key} đã được duyệt thành công`)
				await saveMessage(req.user.userId, `Đất có mã ${key} đã được duyệt thành công`)

				res.status(200).json({ error: false, message: `Cập nhật trạng thái đất ${key} thành công!` })
			} catch (error) {
				res.json({ error: true, message: 'Lỗi hệ thống, không thể cập nhật trạng thái đất!' })
			}

		},

		// // admin xac nhan chuyen dat
		async confirmTransferAdmin(req, res) {
			const { key } = req.body
			const userId = req.user.userId;
			console.log(`key: ${key}`)

			try {
				let transferString = await fabric.queryTransferOne(userId, key)
				let transfer = JSON.parse(transferString)
				let oldUserId = transfer.From
				let newUserId = transfer.To
				let land = transfer.Land;
				let listNameOwner = [];
				let thoigiandangky = getNow();

				if (typeof newUserId == 'object') {
					// Get data from firebase
					let listNewUserHandle = []
					for (let el of newUserId) {
						listNewUserHandle.push(Object.keys(el)[0])
						const listNewUser = await getUser(Object.keys(el)[0])
						listNameOwner.push(listNewUser[0].fullname)
					}

					let oldUserIdHandle
					if (typeof oldUserId == 'object') {
						let listOldUserHandle = []
						for (let el of oldUserId) {
							listOldUserHandle.push(Object.keys(el)[0])
						}
						oldUserIdHandle = listOldUserHandle
					} else {
						oldUserIdHandle = oldUserId;
					}

					// Confirm transfer
					await fabric.confirmTransferLand(land, userId, oldUserIdHandle, listNewUserHandle, listNameOwner, thoigiandangky)
					await fabric.updateLand(req.user.userId, land, "Đã duyệt")
					await fabric.updateTransfer(req.user.userId, key, req.user.role, thoigiandangky)

					await saveMessageTransferLandSuccessLoop(oldUserIdHandle, listNewUserHandle, land)

					res.status(200).json({ error: false, message: `Xác nhận chuyển đất có mã ${key} thành công!` })

				} else {
					// get data from firebase
					let listNewUser = await getUser(newUserId)
					let owner = listNewUser[0].fullname

					let thoigiandangky = getNow()

					// process data
					let oldUserIdHandle
					if (typeof oldUserId == 'object') {
						let listOldUserHandle = []
						for (let el of oldUserId) {
							listOldUserHandle.push(Object.keys(el)[0])
						}
						oldUserIdHandle = listOldUserHandle
					} else {
						oldUserIdHandle = oldUserId;
					}

					// Send money to old owner
					if (transfer.Money != 0) {
						if (typeof transfer.From != 'object') {
							let getAccountIdFrom = await fabric.inkvode_token_getAccountId(transfer.From)
							let getAccountIdTo = await fabric.inkvode_token_getAccountId(transfer.To)
							await fabric.inkvode_token_delete(userId, transfer.To, key)
							await fabric.inkvode_token_transfer(userId, getAccountIdTo, getAccountIdFrom, transfer.Money)
						}
					}

					// Confirm and update
					await fabric.confirmTransferLand(land, userId, oldUserIdHandle, newUserId, owner, thoigiandangky)
					await fabric.updateLand(userId, land, "Đã duyệt")
					await fabric.updateTransfer(req.user.userId, key, req.user.role, thoigiandangky)

					// Send messages
					if (typeof oldUserId == 'object') {

						for (let i = 0; i < oldUserId.length; i++) {
							await saveMessage(oldUserId[i], `Admin đã xác nhận đất có mã ${land}, mãnh đất đã được chuyển thành công cho người sở hữu ${newUserId}`)
						}
						await saveMessage(newUserId, `Admin đã xác nhận ! Bạn đã nhận được đất có mã ${land}} `)

					} else {
						await saveMessage(oldUserId, `Admin đã xác nhận đất có mã ${land}, mãnh đất đã được chuyển thành công cho người sở hữu ${newUserId}`)
						await saveMessage(newUserId, `Admin đã xác nhận ! Bạn đã nhận được đất có mã ${land}} `)
					}

					res.status(200).json({ error: false, message: `Xác nhận chuyển đất có mã ${key} thành công!` })
				}
			} catch (error) {
				console.log(`ERROR : ${error}`)
				res.json({ error: true, message: 'Lỗi hệ thống, không thể xác nhận chuyển đất!' })
			}

		},

		// async cancelTransferLane(req, res) {
		// 	try {
		// 		const { keyLand, keyTransfer, receiver, receiverConfirm } = req.body;
		// 		await cancleTransferFromUser(keyTransfer, req.session.user.userId, keyLand, req.session.user.role);
		// 		console.log("receiverConfirm: " + receiverConfirm)
		// 		if (receiverConfirm == "true") {
		// 			await deleteMoneyDetention(req.session.user.userId, receiver, keyTransfer);
		// 		}
		// 		await updateLand(req.session.user.userId, keyLand, "Đã duyệt")
		// 		await saveMessage(req.session.user.userId, `Bạn đã hủy chuyển nhượng mã đất ${keyLand} thành công`)
		// 		await saveMessage(receiver, `Người chuyển mã đất ${keyLand} đã hủy giao dịch`)
		// 		req.flash('success', `Bạn đã hủy chuyển mã đất ${keyLand} cho người nhận ${receiver} thành công`)
		// 		res.redirect('/')
		// 	} catch (error) {
		// 		console.log(`ERROR : ${error}`)
		// 		req.flash('success', `Hủy chuyển không thành công`)
		// 		res.redirect('/')
		// 	}

		// },

		// //modify land

		// async modifyUI(req, res) {
		// 	const key = req.params.key;
		// 	const userId = req.session.user.userId;
		// 	let landString = await fabric.queryLand(key, userId);
		// 	let land = JSON.parse(landString)

		// 	return res.render("modifyLand", { land: land, key: key })
		// },

		// async handleModifyLand(req, res) {
		// 	const { key, userIdOwner, owner,
		// 		thuasodat, tobandoso,
		// 		dientich, hinhthucsudung, mucdichsudung, thoihansudung,
		// 		nguongocsudung, url, landOfCity, countCoordinates, countLengths,
		// 		countParcels, lengthsOld, coordinatesOld, countOwner } = req.body;

		// 	console.log("ALL : " + key, userIdOwner, owner,
		// 		thuasodat, tobandoso,
		// 		dientich, hinhthucsudung, mucdichsudung, thoihansudung,
		// 		nguongocsudung, url, landOfCity, countCoordinates,
		// 		countLengths, countParcels, lengthsOld, coordinatesOld)


		// 	let coordinatesNew;
		// 	let lengthsNew;
		// 	let userIdNew;

		// 	let coordinates = {};
		// 	let lengths = {};
		// 	let parcels = []

		// 	if (countCoordinates != "") {
		// 		for (let i = 0; i < parseInt(countCoordinates); i++) {
		// 			coordinates[`D${i + 1}`] = [parseFloat(req.body[`long${i}`]), parseFloat(req.body[`lat${i}`])]
		// 		}
		// 		coordinatesNew = JSON.stringify(coordinates);

		// 	} else {
		// 		coordinatesNew = coordinatesOld
		// 	}

		// 	console.log("COOR: " + coordinatesNew)


		// 	for (let i = 0; i < parseInt(countParcels); i++) {
		// 		parcels.push(parseInt(req.body[`parcel${i}`]))
		// 	}


		// 	if (countLengths != "") {
		// 		console.log("COUNT LENGTH : " + countLengths)
		// 		for (let i = 0; i < countLengths; i++) {
		// 			if (i === countLengths - 1) {
		// 				lengths[`C${i + 1}${countLengths - i}`] = parseFloat(req.body[`length${i}`])
		// 			} else {
		// 				lengths[`C${i + 1}${i + 2}`] = parseFloat(req.body[`length${i}`])
		// 			}
		// 		}
		// 		lengthsNew = JSON.stringify(lengths);
		// 	} else {
		// 		lengthsNew = lengthsOld
		// 	}


		// 	let listOwner = [];
		// 	let listNameOwner = [];

		// 	if (countOwner !== undefined) {
		// 		listOwner = [req.session.user.userId];
		// 		listNameOwner = [];
		// 		for (let i = 0; i < countOwner; i++) {
		// 			listOwner.push(req.body[`owner${i}`]);
		// 		}

		// 		for (let i = 0; i < listOwner.length; i++) {
		// 			let listUser = await getUser(listOwner[i]);
		// 			listNameOwner.push(listUser[0].fullname)
		// 		}
		// 	} else {
		// 		listOwner = userIdOwner;
		// 		listNameOwner = owner;
		// 	}



		// 	let userId = req.session.user.userId;

		// 	console.log("ALLLLLL: " + userId, key, listOwner, listNameOwner, thuasodat, tobandoso,
		// 		parcels, dientich, coordinatesNew, lengthsNew,
		// 		hinhthucsudung, mucdichsudung,
		// 		thoihansudung, nguongocsudung, url, landOfCity)
		// 	console.log("GOOD " + lengthsNew)
		// 	console.log("GOOD2 " + typeof lengthsNew)

		// 	try {
		// 		await modifyLand(userId, key, listOwner, listNameOwner, thuasodat, tobandoso,
		// 			parcels, dientich, coordinatesNew, lengthsNew,
		// 			hinhthucsudung, mucdichsudung,
		// 			thoihansudung, nguongocsudung, url, landOfCity)

		// 		req.flash("success", "Bạn đẫ thay đổi thông tin đất có mã " + key)
		// 		return res.redirect('/')
		// 	} catch (error) {
		// 		console.log("ERROR : " + error)
		// 	}


		// }

	};
}

module.exports = homeController;







