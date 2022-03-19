

const { getFirestore, doc, collection, getDocs, setDoc, addDoc, deleteDoc, updateDoc, query, where, serverTimestamp, orderBy } = require("firebase/firestore")
const app = require('./config')

const db = getFirestore(app);

async function saveUser(userId, fullname, phoneNumber, idCard, password) {
    let date_ob = new Date();
    let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth() + 1}` : `${date_ob.getMonth() + 1}`;
    let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
    let getHour = date_ob.getHours() < 9 ? `0${date_ob.getHours() + 1}` : `${date_ob.getHours() + 1}`;
    let getMinute = date_ob.getMinutes() < 9 ? `0${date_ob.getMinutes() + 1}` : `${date_ob.getMinutes() + 1}`;
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
    let getHour = date_ob.getHours() < 9 ? `0${date_ob.getHours() + 1}` : `${date_ob.getHours() + 1}`;
    let getMinute = date_ob.getMinutes() < 9 ? `0${date_ob.getMinutes() + 1}` : `${date_ob.getMinutes() + 1}`;
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


async function updateMessage(userId) {

    try {
        const docRef = await setDoc(collection(db, "messages"), {
            userId: userId,
            fullname: fullname,
            numberPhone: numberPhone,
            idCard: idCard,
            password: password,
            role: "user"
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }

}


async function getKeyWith(userId) {
    console.log("Get key")
    const q = query(collection(db, "users"), where("userId", "==", userId));
    const citySnapshot = await getDocs(q);
    if (citySnapshot.docs.length > 0) {
        const cityList = citySnapshot.docs.map(doc => doc.id);
        return cityList;
    } else {
        console.log("get key Failed")
        return [];
    }
}


async function updateInfo(userId, fullname, numberPhone, idCard) {

    if (numberPhone[0] == "0") {
        numberPhone = "+84" + numberPhone.slice(1);
    }

    try {
        const key = await getKeyWith(userId)
        await updateDoc(doc(db, "users", key[0]), {
            fullname: fullname,
            numberPhone: numberPhone,
            idCard: idCard,
        })

    } catch (e) {
        console.error("Error adding document: ", e);
    }

}



module.exports = {
    saveUser, getUser, saveMessage,
    updateInfo, getMessage, saveUserManager, saveUserAdmin
    , deleteUserManager, getAllUserManager, getAllUser
}













