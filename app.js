var request = require('request');
var Twit = require('twit');
var http = require('http');

var url = 'http://mpeso.com/datos/consulta.php';
var hashtag = '#saldompeso';

var T = new Twit({
    consumer_key:         '48OCGfODf3miCOL9QcloKg'
    , consumer_secret:      'qYFqFCcyoVOj51h9NkZGFt73aAf996u4tWJ53VkItWA'
    , access_token:         '1883755550-VtYI1o0je4SBdYVZqHo60bsDFiNmNj5xpYLkvPo'
    , access_token_secret:  'ayv4LB9vP0OJySy7MpY1AqJZEnsP7PaYLX711NLO5Gc'
});


// Mention actions
var stream = T.stream('statuses/filter', { track: hashtag });
stream.on('tweet', function (tweet) {
    var terminal = tweet.text.replace(hashtag + ' ','');
    terminal = terminal.replace('-','');
    if( terminal!= "" && terminal.length==8 ){
        request.post(url, {form:{"_funcion":1,"_terminal":terminal}},function (error, response, body) {
            if(response.statusCode == 200){
                var json = JSON.parse(body);
                var message = json.Mensaje;
                var mention = '@' + tweet.user.screen_name + ' ' + message;

                // Send mention with response
                T.post('statuses/update', { status: mention }, function(err, reply) {
                    console.log('Mention: ' + mention);
                });

            }
        });
    }
    else{
        T.post('statuses/update', { status: tweet.user.screen_name + ' ' + 'El formato es incorrecto, se requieren 8 dígitos numéricos.' }, function(err, reply) {
            console.log('Formato incorrecto: ' + tweet.user.screen_name);
        });
    }


});

//Comentario

// Http server
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('http://mpeso.com/');
}).listen(process.env.VMC_APP_PORT || 1337, null);
console.log('Server running');