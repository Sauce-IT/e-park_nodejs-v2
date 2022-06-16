

var aw = 0;

var sec = 0;
var min = 0;

var book_s = document.getElementById("book_s").value;
    
if(book_s == 'paid'){  
    var counta = setInterval(function() {

        
        // var paid_date = new Date(document.getElementById("status").value).getTime();


        var paid_date = new Date(document.getElementById("status").value);
        var count = new Date(paid_date.getTime() + (30 * 60000));;
        var interval = new Date(paid_date.getTime() + 33 * 60000);;
        var now = new Date();
        var gap = (count-now);

        // container for 30 
        if(aw == 0){
            aw = gap;
        }

        // reversing time takes 4 delay(idk if seconds) 
        aw--;
        aw--;
        aw--;
        aw--;

        


        if(now > count && now < interval)
        {
            alert('Your reservation has Expired');
            console.log("Expired");
            clearInterval(counta);
        }

        // var days = Math.floor(aw / (1000 * 60 * 60 * 24));
        // var hours = Math.floor((aw % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((aw % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((aw % (1000 * 60)) / 1000);
        
        document.getElementById("counter").innerHTML = '00' + ':' + minutes + ":" + seconds;

        if (min == 0 && sec == 1)
        {
            min = 0;
            sec = 0;
            document.getElementById("counter").innerHTML = "00:00:00";

        }
        

        // console.log('countdown',aw);

        
    });
    
}else{
    
    clearInterval(counta);
}    
