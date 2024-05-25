const urlBase = 'http://cityfolk.world/LAMPAPI';
//const urlBase = window.location.origin + '/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";


function validateUsername() {
    const username = document.getElementById('signupUser').value;
    const usernameMessage = document.getElementById('usernameMessage');
    let message = '';

    if (username.length < 3 || username.length > 18) {
        message = 'Username must be between 3 and 18 characters long.';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        message = 'Username can only include letters, numbers, underscores, and hyphens.';
    }

    usernameMessage.textContent = message;
}

function validatePassword() {
    const password = document.getElementById('signupPassword').value;
    const passwordMessage = document.getElementById('passwordMessage');
    let message = '';

    if (password.length < 8 || password.length > 32) {
        message = 'Password must be between 8 and 32 characters long.';
    } else if (!/[0-9]/.test(password)) {
        message = 'Password must contain at least one number.';
    } else if (!/[!@#$%^&*]/.test(password)) {
        message = 'Password must contain at least one special character.';
    }

    passwordMessage.textContent = message;
}

function doSignup() {
    firstName = document.getElementById('signupFirstName').value;
    lastName = document.getElementById('signupLastName').value;
    let username = document.getElementById('signupUser').value;
    let password = document.getElementById('signupPassword').value;
    let signupResult = document.getElementById('signupResult');

    validateUsername();
    validatePassword();

    let usernameMessage = document.getElementById('usernameMessage').textContent;
    let passwordMessage = document.getElementById('passwordMessage').textContent;
    let errorMessage = '';

    if (!firstName.trim()) {
        errorMessage += 'First name cannot be blank. ';
    }

    if (!lastName.trim()) {
        errorMessage += 'Last name cannot be blank. ';
    }

    if (usernameMessage || passwordMessage || errorMessage) {
        return false;
    }

    // Proceed with the signup process if validation passes

    var hash = md5(password);

    let tmp = { FirstName: firstName, LastName: lastName, Login: username, Password: hash };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    //xhr.send(jsonPayload);
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState != 4) {
                return;
            }

            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error) {
                    signupResult.textContent = jsonObject.error;
                } else {
                    signupResult.textContent = "Signup successful!";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        signupResult.textContent = err.message;
    }
}


function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    var hash = md5(password);

    document.getElementById("loginResult").innerHTML = "";

    //let tmp = { login: login, password: password };
    let tmp = { login: login, password: hash };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                console.log("User ID after login:", userId);

                saveCookie();

                window.location.href = "../contacts.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }

}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ";expires=" + date.toGMTString() + ";path=/";
    document.cookie = "lastName=" + lastName + ";expires=" + date.toGMTString() + ";path=/";
    document.cookie = "userId=" + userId + ";expires=" + date.toGMTString() + ";path=/";

    let data = document.cookie;
    console.log("Cookie data:", data);
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    console.log("Cookie data:", data); // Debugging statement
    let splits = data.split(";");

    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    console.log("First Name from cookie:", firstName);
    console.log("Last Name from cookie:", lastName);
    console.log("User ID from cookie:", userId);

    if (userId < 0) {
        window.location.href = "main.html";
    }
    else {
        //		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "main.html";
}

function addColor() {
    let newColor = document.getElementById("colorText").value;
    document.getElementById("colorAddResult").innerHTML = "";

    let tmp = { color: newColor, userId, userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddColor.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("colorAddResult").innerHTML = "Color has been added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("colorAddResult").innerHTML = err.message;
    }

}


function addContact() {
    let firstName = document.getElementById("addFirstName").value;
    let lastName = document.getElementById("addLastName").value;
    let phone = document.getElementById("addPhone").value;
    let email = document.getElementById("addEmail").value;
    
    const result = document.getElementById("addContactResult");

    let phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    let emailRegex = /^([A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3})$/;

    if (!firstName.trim()) {
        result.innerHTML =  'First name cannot be blank. ';
    }
    if (!lastName.trim()) {
        result.innerHTML =  'Last name cannot be blank. ';
    }
    if (!phoneRegex.test(phone)) {
        result.innerHTML = "Phone Number must be in the format ###-###-####.";
        return;
    }
    if (!emailRegex.test(email)) {
        result.innerHTML = "Email must be in the correct format.";
        return;
    }

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/AddContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState != 4) {
                return;
            }

            if (this.readyState == 4 && this.status == 200) {
                //console.log("Contact has been added");
                addContactResult.textContent = "Contact Added Successfully!";
                document.getElementById("C_add").reset();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("addContactButton").innerHTML = err.message;
    }

}



function searchColor() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("colorSearchResult").innerHTML = "";

    let colorList = "";

    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchColors.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
                let jsonObject = JSON.parse(xhr.responseText);

                for (let i = 0; i < jsonObject.results.length; i++) {
                    colorList += jsonObject.results[i];
                    if (i < jsonObject.results.length - 1) {
                        colorList += "<br />\r\n";
                    }
                }

                document.getElementsByTagName("p")[0].innerHTML = colorList;
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("colorSearchResult").innerHTML = err.message;
    }
}


function searchContacts() {
    console.log("searching contacts");
    //get search query
    let srch = document.getElementById("searchText").value;
    //get table element to add in
    let table = document.getElementById("contacttablebody");

    table.innerHTML = "";

    let contactList = "";

    let temp = { search: srch, userId: userId };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
                let jsonObject = JSON.parse(xhr.responseText);
                for (let i = 0; i < jsonObject.results.length; i++) {
                    contactList += jsonObject.results[i];
                    if (i < jsonObject.results.length - 1) {
                        contactList += "<br />\r\n";
                    }
                }

                document.getElementsByTagName("p")[0].innerHTML = contactList;
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("colorSearchResult").innerHTML = err.message;
    }
    
    console.log(contactList);
}

function loadContacts() {
    console.log("load contacts function");
    
    let tmp = {
        search: "",
        userId: userId,
    }

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                console.log(jsonObject);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    //return;
                }
                let text = "<table border='1'>"
                for (let i = 0; i < jsonObject.results.length; i++) {
                    //ids[i] = jsonObject.results[i].ID
                    text += "<tr id='row" + i + "'>"
                    text += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
                    text += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>";
                    text += "<td>" +
                        "<button type='button' id='edit_button" + i + "' class='w3-button w3-circle w3-lime' onclick='edit_row(" + i + ")'>" + "<span class='glyphicon glyphicon-edit'></span>" + "</button>" +
                        "<button type='button' id='save_button" + i + "' value='Save' class='w3-button w3-circle w3-lime' onclick='save_row(" + i + ")' style='display: none'>" + "<span class='glyphicon glyphicon-saved'></span>" + "</button>" +
                        "<button type='button' onclick='delete_row(" + i + ")' class='w3-button w3-circle w3-amber'>" + "<span class='glyphicon glyphicon-trash'></span> " + "</button>" + "</td>";
                    text += "<tr/>"
                }
                text += "</table>"
                document.getElementById("contacttablebody").innerHTML = text;
                console.log("text: ");
                console.log(text);
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}