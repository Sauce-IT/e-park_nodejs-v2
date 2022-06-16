
    var user_id = document.getElementById('user_id').value;
    var name = document.getElementById('Name').value;
    var email = document.getElementById('email').value;
    var mobile = document.getElementById('mobile').value;
    var slot = document.getElementById('slot_id').value;

    console.log('Name: ' + name + " " + email + " " + mobile + " " + slot);

    var url = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=Name:" +
    name + '('+  user_id + ')'+"%0a Email: " + email + " mobile: " + mobile + " slot: " + slot ;

    var ifr = `<iframe src="${url}" height="200" width="200"></iframe>`;

    document.getElementById('qrcode').innerHTML = ifr;
