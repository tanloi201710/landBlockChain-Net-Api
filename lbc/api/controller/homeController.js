const fabric = require('../fabricController')


const { saveMessage, getMessage, getUser } = require('./saveUser')

const saveMessageTransferLandSuccessLoop = require('./saveMessageLoop')


const getNow = require('./getDateNow')


const homeController = () => {
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
				thoiHanSuDung, nguonGoc, thoigiandangky, JSON.stringify(nhaO), JSON.stringify(congTrinhKhac), url, diaChi);

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
						await saveMessage(userId, `Bạn đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${keyLand} cho người sở hữu ${owner}`)

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

		async getReceiveLand(req, res) {
			const transString = await fabric.queryAllTransferReceiver(req.user.userId)
			const result = JSON.parse(transString)
			return res.status(200).json({ error: false, trans: result })
		},


		async getSendLand(req, res) {
			const transString = await fabric.queryTransferOwner(req.user.userId)
			const result = JSON.parse(transString)
			return res.status(200).json({ error: false, trans: result })
		},

		async getTransferAdmin(req, res) {
			const transString = await fabric.queryAllTransfer(req.user.userId)
			const result = JSON.parse(transString)
			return res.status(200).json({ error: false, allTransfer: result })
		},

		async getSplitRequestAdmin(req, res) {
			const splitRequestString = await fabric.queryAllSplitRequest(req.user.userId)
			const result = JSON.parse(splitRequestString)
			res.status(200).json({ error: false, splitRequest: result })
		},

		async getSplitRequestOwner(req, res) {
			const splitRequestString = await fabric.queryOwnerSplitRequest(req.user.userId)
			const result = JSON.parse(splitRequestString)
			res.status(200).json({ error: false, splitRequest: result })
		},

		async handleConfirmFromReceiver(req, res) {
			const { key, userIdFromTransfer, amount, landKey } = req.body
			console.log(key)
			console.log(userIdFromTransfer)
			try {
				const userId = req.user.userId
				let allMoney = await fabric.inkvode_token_getBalance(userId);

				console.log(`allMoney : ${allMoney}`)

				if (parseInt(allMoney) >= parseInt(amount)) {
					await fabric.inkvode_token_detention(userId, key, amount)
				} else {
					console.log("Không đủ tiền nhận đất!")
					return res.json({ error: true, message: `Bạn không có đủ tiền để nhận đất, bạn có ${allMoney}/${amount}` })
				}

				let thoigiandangky = getNow()

				await fabric.updateTransfer(userId, key, req.user.role, thoigiandangky)

				await saveMessage(userId, "Bạn đã nhận đất thành công")
				if (typeof userIdFromTransfer != 'object') {
					await saveMessage(userIdFromTransfer, `Người dùng ${userId} đã nhận đất có mã : ${landKey}`)

				} else {
					for (let i = 0; i < userIdFromTransfer.length; i++) {
						await saveMessage(Object.keys(userIdFromTransfer[i]).toString(), `Người dùng ${userId} đã nhận đất có mã : ${landKey}`)
					}
				}

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

				await saveMessage(userId, `Bạn đã xác nhận chuyển đất có mã ${transfer.Land} thành công`)
				for (let i = 0; i < Object.keys(transfer.From).length; i++) {
					if (Object.keys(transfer.From[i]).toString() !== userId)
						await saveMessage(Object.keys(transfer.From[i]).toString(), `Người dùng ${userId} đã xác nhận chuyển đất có mã ${transfer.Land}`)
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
					if (Object.keys(transfer.From[i]).toString() !== userId)
						await saveMessage(Object.keys(transfer.From[i]).toString(), `Người dùng ${userId} đã nhận mãnh đất có mã ${transfer.Land}`)
				}

				res.status(200).json({ error: false, message: 'Nhận đất thành công!' })
			} catch (error) {
				console.log("ERRRRRRROR: " + error)
				res.json({ error: true, message: 'Lỗi hệ thống, nhận đất không thành công!' })
			}

		},

		async handleConfirmSplit(req, res) {
			const { key } = req.body
			const userId = req.user.userId
			const role = req.user.role
			const time = getNow()

			try {
				const currentRequestString = await fabric.queryOneSplitRequest(userId, key)
				let currentRequest = JSON.parse(currentRequestString)

				if (typeof currentRequest.UserRequest == 'object') {
					await fabric.updateSplitRequestFromCo(userId, time)

					const otherUser = currentRequest.UserRequest.filter(item => Object.keys(item).toString() != userId)

					if (!otherUser.some(item => Object.values(item).toString() == 'false')) {
						await fabric.confirmSplitLand(currentRequest.Land, userId, currentRequest.DataProcessed, time)

						for (let i = 0; i < currentRequest.UserRequest.length; i++) {
							await saveMessage(Object.keys(currentRequest.UserRequest[i]).toString(), `Yêu cầu tách thửa đất có mã ${currentRequest.Land} đã được xử lý thành công!`)
						}

						return res.status(200).json({ error: false, message: `Tách thửa đất có mã ${currentRequest.Land} thành công!` })
					}

					await saveMessage(userId, `Bạn đã xác nhận tách thửa đất có mã ${currentRequest.Land} với thông tin được cung cấp!`)

					for (let i = 0; i < currentRequest.UserRequest.length; i++) {
						if (Object.keys(currentRequest.UserRequest[i]).toString() != userId) {
							await saveMessage(Object.keys(currentRequest.UserRequest[i]).toString(), `Người dùng ${userId} đã xác nhận tách thửa đất có mã ${currentRequest.Land} với thông tin được cung cấp!`)
						}
					}

					return res.status(200).json({ error: false, message: 'Xác nhận tách thửa thành công!' })

				} else {
					await fabric.updateSplitRequest(userId, key, role, time)

					await fabric.confirmSplitLand(currentRequest.Land, userId, currentRequest.DataProcessed, time)

					await saveMessage(userId, `Yêu cầu tách thửa đất có mã ${currentRequest.Land} đã được xử lý thành công!`)

					return res.status(200).json({ error: false, message: `Tách thửa đất có mã ${currentRequest.Land} thành công!` })
				}

			} catch (error) {
				console.log(error)
				res.json({ error: true, message: 'Lỗi hệ thống, xác nhận tách thửa không thành công!' })
			}


		},

		async AdminConfirmSplit(req, res) {
			const { key, dataProcessed } = req.body

			console.log('data length' + dataProcessed.length)
			const userId = req.user.userId
			const role = req.user.role
			const time = getNow()

			try {
				const currentRequestString = await fabric.queryOneSplitRequest(userId, key)
				let currentRequest = JSON.parse(currentRequestString)

				await fabric.updateSplitRequest(userId, key, role, dataProcessed, time)

				await saveMessage(userId, `Đã gửi kết quả xử lý tách đất có mã ${currentRequest.Land} cho người dùng!`)

				if (typeof currentRequest.UserRequest == 'object') {
					for (let i = 0; i < currentRequest.UserRequest.length; i++) {
						await saveMessage(Object.keys(currentRequest.UserRequest[i]).toString(), `Admin đã gửi kết quả xử lý tách thửa đất có mã ${currentRequest.Land}, bạn cần xác nhận để tiến hành tách thửa đất!`)
					}
				} else {
					await saveMessage(currentRequest.UserRequest.toString(), `Admin đã gửi kết quả xử lý tách thửa đất có mã ${currentRequest.Land}, bạn cần xác nhận để tiến hành tách thửa đất!`)
				}

				return res.status(200).json({ error: false, message: 'Gửi kết quả xử lý thành công!' })
			} catch (error) {

			}
		},

		async updateStatusLandAdmin(req, res) {
			const { key, status, userId } = req.body
			console.log(key)
			console.log(status)
			console.log(userId)
			try {
				await fabric.updateLand(req.user.userId, key, status)

				const content = `Đất có mã ${key} đã được duyệt thành công`
				if (typeof userId === 'object') {
					for (let i = 0; i < userId.length; i++) {
						await saveMessage(userId[i], content)
					}
				} else {
					await saveMessage(userId, content)
				}
				await saveMessage(req.user.userId, content)

				res.status(200).json({ error: false, message: `Cập nhật trạng thái đất ${key} thành công!` })
			} catch (error) {
				res.json({ error: true, message: 'Lỗi hệ thống, không thể cập nhật trạng thái đất!' })
			}

		},

		// // admin xac nhan chuyen dat
		async confirmTransferAdmin(req, res) {
			const { key } = req.body
			const userId = req.user.userId
			console.log(`key: ${key}`)

			try {
				let transferString = await fabric.queryTransferOne(userId, key)
				let transfer = JSON.parse(transferString)
				let oldUserId = transfer.From
				let newUserId = transfer.To
				let land = transfer.Land
				let listNameOwner = []
				let thoigiandangky = getNow()

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
						oldUserIdHandle = oldUserId
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
							let getAccountIdReceiver = await fabric.inkvode_token_getAccountId(transfer.From)
							let getAccountIdSender = await fabric.inkvode_token_getAccountId(transfer.To)
							await fabric.inkvode_token_delete(userId, transfer.To, key)
							await fabric.inkvode_token_transfer(userId, getAccountIdSender, getAccountIdReceiver, transfer.Money)
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
						await saveMessage(newUserId, `Admin đã xác nhận ! Bạn đã nhận được đất có mã ${land} `)
					}

					res.status(200).json({ error: false, message: `Xác nhận chuyển đất có mã ${key} thành công!` })
				}
			} catch (error) {
				console.log(`ERROR : ${error}`)
				res.json({ error: true, message: 'Lỗi hệ thống, không thể xác nhận chuyển đất!' })
			}

		},

		async cancelTransferLand(req, res) {
			try {
				const { keyLand, keyTransfer, otherSenders, receiver, receiverConfirm } = req.body

				// check and delete transfer state
				await fabric.cancleTransferFromUser(keyTransfer, req.user.userId, keyLand, req.user.role)
				console.log("receiverConfirm: " + receiverConfirm)

				// delete token detention of received user
				if (receiverConfirm == "true") {
					if (typeof receiver == 'object') {
						for (let i = 0; i < receiver.length; i++) {
							if (receiver[i][Object.keys(receiver[i]).toString()]) {
								await fabric.inkvode_token_delete(req.user.userId, Object.keys(receiver[i]).toString(), keyTransfer)
							}
						}
					} else {
						await fabric.inkvode_token_delete(req.user.userId, receiver, keyTransfer)
					}
				}

				// update land state
				await fabric.updateLand(req.user.userId, keyLand, "Đã duyệt")

				// send messages
				await saveMessage(req.user.userId, `Bạn đã hủy chuyển nhượng đất có mã ${keyLand} thành công`)
				if (typeof receiver == 'object') {
					for (let i = 0; i < receiver.length; i++) {
						await saveMessage(Object.keys(receiver[i]).toString(), `Người chuyển đất có mã ${keyLand} đã hủy giao dịch`)
					}
				} else {
					await saveMessage(receiver, `Người chuyển đất có mã ${keyLand} đã hủy giao dịch`)
				}

				console.log('otherSenders: ' + otherSenders)
				if (otherSenders.length > 0) {
					for (let i = 0; i < otherSenders.length; i++) {
						await saveMessage(Object.keys(otherSenders[i]).toString(), `Người đồng sỡ hữu mãnh đất ${keyLand}, ${req.user.userId} đã hủy giao dịch chuyển đất!`)
					}
				}

				res.status(200).json({ error: false, message: `Hủy chuyển đất có mã ${keyLand} cho người nhận ${receiver} thành công` })
			} catch (error) {
				console.log(`ERROR : ${error}`)
				res.json({ error: true, message: 'Lỗi hệ thống, hủy chuyển không thành công' })
			}

		},

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







