


function getNow() {
    let date_ob = new Date();
    let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth() + 1}` : `${date_ob.getMonth() + 1}`;
    let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
    let getHour = date_ob.getHours() < 9 ? `0${date_ob.getHours()}` : `${date_ob.getHours()}`;
    let getMinute = date_ob.getMinutes() < 9 ? `0${date_ob.getMinutes()}` : `${date_ob.getMinutes()}`;
    let time = `${getHour}:${getMinute}`;
    let dateTime = `${time}-${newDate}`;
    return dateTime;
}


module.exports = getNow;







