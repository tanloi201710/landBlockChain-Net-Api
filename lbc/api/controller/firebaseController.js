

const { getFirestore, doc, collection, getDocs, setDoc, addDoc, deleteDoc, updateDoc, query, where, serverTimestamp, orderBy } = require("firebase/firestore")
const app = require('./firebaseConfig')

const db = getFirestore(app);

async function saveUser(userId, fullname, phoneNumber, idCard, password) {
    let date_ob = new Date();
    let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth() + 1}` : `${date_ob.getMonth() + 1}`;
    let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
    let getHour = date_ob.getHours() < 9 ? `0${date_ob.getHours()}` : `${date_ob.getHours()}`;
    let getMinute = date_ob.getMinutes() < 9 ? `0${date_ob.getMinutes()}` : `${date_ob.getMinutes()}`;
    let time = `${getHour}:${getMinute}`;

    try {
        const docRef = await addDoc(collection(db, "users"), {
            userId,
            fullname,
            phoneNumber,
            idCard,
            password,
            role: "user",
            timestamp: serverTimestamp(),
            Date: newDate,
            Time: time
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
    const q = query(collection(db, "users"), where("role", "==", "manager"));
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
    const q = query(collection(db, "users"), where("userId", "==", userId));
    const userSnapshot = await getDocs(q);
    if (userSnapshot.docs.length > 0) {
        const cityList = userSnapshot.docs.map(doc => doc.data());
        console.log(cityList);
        return cityList;
    } else {
        console.log("Login Failed")
        return [];
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

    if (userSnapshot.length > 0) {
        const userList = userSnapshot.docs.map(doc => doc.data())
        console.log(userList[0].id)
        return userList[0].id
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


async function updateInfo(userId, fullname, numberPhone, idCard) {

    if (numberPhone[0] == "0") {
        numberPhone = "+84" + numberPhone.slice(1);
    }

    try {
        const key = await getKeyUser(userId)
        await updateDoc(doc(db, "users", key), {
            fullname: fullname,
            numberPhone: numberPhone,
            idCard: idCard,
        })

    } catch (e) {
        console.error("Error update document: ", e);
    }

}



module.exports = {
    saveUser, getUser, saveMessage,
    updateInfo, getMessage, saveUserManager, saveUserAdmin
    , deleteUserManager, getAllUserManager, getAllUser, readMessage
}












