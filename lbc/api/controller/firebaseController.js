

const { getFirestore, doc, collection, getDocs, setDoc, addDoc, deleteDoc, updateDoc, query, where, serverTimestamp, orderBy } = require("firebase/firestore")
const app = require('./firebaseConfig')

const db = getFirestore(app);

async function saveUser(userId, fullname, phoneNumber, idCard, password, birthDay, address) {
    let date_ob = new Date()
    let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth() + 1}` : `${date_ob.getMonth() + 1}`
    let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`
    let getHour = date_ob.getHours() < 9 ? `0${date_ob.getHours()}` : `${date_ob.getHours()}`
    let getMinute = date_ob.getMinutes() < 9 ? `0${date_ob.getMinutes()}` : `${date_ob.getMinutes()}`
    let time = `${getHour}:${getMinute}`

    const birthArray = birthDay.split('/')
    const sortedBirthDay = [birthArray[1], birthArray[0], birthArray[2]]

    try {
        const docRef = await addDoc(collection(db, "users"), {
            userId,
            fullname,
            phoneNumber,
            idCard,
            password,
            role: "user",
            Date: newDate,
            Time: time,
            birthDay: sortedBirthDay.join('/'),
            address,
            timestamp: serverTimestamp(),
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}

async function saveUserManager(userId, password, fullname, city) {

    try {
        const docRef = await addDoc(collection(db, "users"), {
            userId,
            password,
            fullname,
            city,
            role: "manager",
            timestamp: serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}

async function saveUserAdmin(password) {

    try {
        const docRef = await addDoc(collection(db, "users"), {
            userId: "admin@gmail.com",
            password: password,
            role: "admin",
            timestamp: serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}



async function deleteUserManager(userId) {

    try {
        console.log("Get user")
        const q = query(collection(db, "users"), where("userId", "==", userId));
        const citySnapshot = await getDocs(q);
        console.log(`user delete : ${citySnapshot.docs[0]}`);
        const cityList = citySnapshot.docs.map(doc => doc.id);
        console.log(cityList);
        await deleteDoc(doc(db, "users", cityList[0]));
        console.log(`Deleted ${userId}`)
    } catch (error) {
        console.log("ERROR delete user")
        throw (error)
    }

}

async function getAllUserManager() {
    console.log("Get All user Manger")
    const q = query(collection(db, "users"), where("role", "==", "manager"))
    const managerSnapshot = await getDocs(q)
    if (managerSnapshot.docs.length > 0) {
        const managerList = managerSnapshot.docs.map(doc => doc.data())
        console.log(managerList)
        return managerList
    } else {
        console.log("Can't get managers")
        return [];
    }
}

async function getAllUser() {
    console.log("Get All user ")
    const q = query(collection(db, "users"), where("role", "==", "user"));
    const citySnapshot = await getDocs(q);
    if (citySnapshot.docs.length > 0) {
        const cityList = citySnapshot.docs.map(doc => doc.data());
        console.log(cityList);
        return cityList;
    } else {
        console.log("Login Failed")
        return [];
    }
}



// Get a list of cities from your database
async function getUser(userId) {
    console.log("Get user")
    const q = query(collection(db, "users"), where("userId", "==", userId))
    try {
        const userSnapshot = await getDocs(q)
        if (userSnapshot.docs.length > 0) {
            const cityList = userSnapshot.docs.map(doc => doc.data())
            console.log(cityList)
            return cityList
        } else {
            console.log("Login Failed")
            return []
        }
    } catch (error) {
        console.log('ERROR: ', error)
        return []
    }

}

async function saveMessage(userId, message) {
    let date_ob = new Date();
    let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth() + 1}` : `${date_ob.getMonth() + 1}`;
    let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
    let getHour = date_ob.getHours() < 9 ? `0${date_ob.getHours()}` : `${date_ob.getHours()}`;
    let getMinute = date_ob.getMinutes() < 9 ? `0${date_ob.getMinutes()}` : `${date_ob.getMinutes()}`;
    let time = `${getHour}:${getMinute}`;

    try {
        const docRef = await addDoc(collection(db, "messages"), {
            userId: userId,
            Message: message,
            Date: newDate,
            Time: time,
            Seen: false,
            timestamp: serverTimestamp()
        });
        console.log("Message written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}


async function getMessage(userId) {
    console.log("Get messages")
    const q = query(collection(db, "messages"), where("userId", "==", userId));
    const citySnapshot = await getDocs(q);
    if (citySnapshot.docs.length > 0) {
        const cityList = citySnapshot.docs.map(doc => doc.data());
        console.log(cityList);
        return cityList;
    } else {
        console.log("get message Failed")
        return [];
    }
}

async function getKeyMessages(userId) {
    console.log("Get key messages")
    const q = query(collection(db, "messages"), where("userId", "==", userId))
    const messageSnapshot = await getDocs(q)
    if (messageSnapshot.docs.length > 0) {
        const cityList = messageSnapshot.docs.filter(doc => doc.data().Seen == false)

        const resultList = cityList.map(element => element.id)

        return resultList;
    } else {
        console.log("Login Failed")
        return []
    }
}

async function getKeyUser(userId) {
    console.log('Get key user')
    const q = query(collection(db, "users"), where("userId", "==", userId))
    const userSnapshot = await getDocs(q)

    if (userSnapshot.docs.length > 0) {
        const userList = userSnapshot.docs.map(doc => doc.id)
        return userList[0]
    } else {
        console.log('User does not exist')
        return ''
    }
}


async function readMessage(userId) {

    try {
        const listMessage = await getKeyMessages(userId)

        if (listMessage.length > 0) {

            for (var key of listMessage) {
                await updateDoc(doc(db, "messages", key), { Seen: true })
                console.log("update success");
            }

        } else {
            console.log("you don't have any new message")

        }

    } catch (e) {
        console.error("Error adding document: ", e)
    }

}


async function updateInfo(userId, newInfo) {

    console.log('userId: ', userId)
    console.log('newInfo: ', newInfo)

    if (newInfo.phoneNumber[0] == "0") {
        newInfo.phoneNumber = "+84" + phoneNumber.slice(1)
    }

    try {
        const key = await getKeyUser(userId)
        await updateDoc(doc(db, "users", key), {
            ...newInfo
        })

    } catch (e) {
        console.error("Error update document: ", e);
    }

}

async function getPosts() {
    console.log("Get posts")
    const q = query(collection(db, "posts"))
    const postSnapshot = await getDocs(q)
    if (postSnapshot.docs.length > 0) {
        const postList = postSnapshot.docs.map(doc => doc.data())
        console.log(postList)
        return postList
    } else {
        console.log("get posts Failed")
        return []
    }
}

async function createPost(userId, land, price, desc, img) {
    try {
        const docRef = await addDoc(collection(db, "posts"), {
            userId,
            price,
            land,
            desc,
            img,
            timestamp: serverTimestamp()
        });
        console.log("Post written with ID: ", docRef.id)
    } catch (err) {
        console.log('ERROR add post: ', err)
    }
}

async function deletePost(land) {
    try {
        console.log("Get post")
        const q = query(collection(db, "posts"), where("land", "==", land))
        const postSnapshot = await getDocs(q)
        console.log(`post delete : ${postSnapshot.docs[0]}`)
        const postList = postSnapshot.docs.map(doc => doc.id)
        console.log(postList)
        await deleteDoc(doc(db, "posts", postList[0]))
        console.log(`Deleted post have land key: ${land}`)
    } catch (error) {
        console.log('ERROR: ', error)
        throw (error)
    }
}


module.exports = {
    saveUser, getUser, saveMessage,
    updateInfo, getMessage, saveUserManager, saveUserAdmin,
    deleteUserManager, getAllUserManager, getAllUser, readMessage,
    getPosts, createPost, deletePost
}













