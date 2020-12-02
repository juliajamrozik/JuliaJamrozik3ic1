var express = require("express")
var app = express()
const PORT = 3000;
var path = require("path")
var bodyParser = require("body-parser")
var zalogowany = false
let tab = [
    { id: 1, login: "AAA", password: "PASS1", wiek: 10, uczen: "checked", plec: "M" },
    { id: 2, login: "julka", password: "PASS2", wiek: 14, uczen: "", plec: "K" },
    { id: 3, login: "piotr", password: "PASS3", wiek: 18, uczen: "checked", plec: "M" },
]
const { table } = require("console");
let id = 3;

app.use(express.static('static'))

//nasłuch na określonym porcie
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    if (zalogowany === true) res.sendFile(path.join(__dirname + "/static/zalogowany/index.html"))
    else {
        res.sendFile(path.join(__dirname + "/static/index.html"))
    }
})
app.get("/admin", function (req, res) {
    if (zalogowany === true) res.sendFile(path.join(__dirname + "/static/zalogowany/admin.html"))
    else {
        res.sendFile(path.join(__dirname + "/static/admin.html"))
    }
})
//rejestracja
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/register", function (req, res) {
    if (zalogowany === true) res.sendFile(path.join(__dirname + "/static/zalogowany/register.html"))
    else {
        res.sendFile(path.join(__dirname + "/static/register.html"))
    }
})

app.post("/submit", function (req, res) {
    if (req.body.login != "" && req.body.password != "" && req.body.plec != "") {
        var czyIstnieje = false
        for (i = 0; i < tab.length; i++) {
            if (tab[i].login == req.body.login) {
                res.send("Taki login juz istnieje.")
                czyIstnieje = true
            }
        }
        if (czyIstnieje != true) {
            var obj = {
                id: id + 1,
                login: req.body.login,
                password: req.body.password,
                wiek: req.body.wiek,
                uczen: req.body.uczen,
                plec: req.body.plec
            }
            tab.push(obj)
            id++;
            res.send(req.body.login + " konto zostało dodane!")

        }
    }
    // braki
    if (req.body.login == "" || req.body.password == "" || req.body.plec == "") {
        res.send("Uzupełnij wszystkie pola!")
    }
    console.log(tab)
    // res.status(200).end();

})


//logowanie
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/login", function (req, res) {
    if (zalogowany === true) res.sendFile(path.join(__dirname + "/static/zalogowany/login.html"))
    else {
        res.sendFile(path.join(__dirname + "/static/login.html"))
    }
})
app.post("/logowanie", function (req, res) {
    console.log(tab)
    var nazwa = req.body.login
    var haslo = req.body.password
    if (!req.body.login || !req.body.password) {
        res.send('Podaj nazwę uzytkownika i hasło!')
    } else {
        tab.filter(function (tab) {
            if (tab.login === req.body.login && tab.password === req.body.password) {
                zalogowany = true
                res.redirect('/zalogowany/admin.html')
                console.log('zalogowany')

            }

        });
        res.send(req.body.login + ' podajesz błędne dane!')

    }

})
//show
app.get('/show', function (req, res) {
    tabelkaShow = ''
    uzytkownicyID = tab.sort(function (a, b) {
        return parseFloat(a.id) - parseFloat(b.id);
    });
    uzytkownicyID.filter(function (tab) {
        wers = `<tr>
            <td>ID: ${tab.id}</td>
            <td>User: ${tab.login} - ${tab.password} </td>
            <td>Uczeń:  <input type="checkbox" disabled ${tab.uczen ? 'checked' : ''}></td> </td>
            <td>Wiek: ${tab.wiek}</td>
            <td>Płeć: ${tab.plec}</td>
        </tr>`
        tabelkaShow += wers
    })

    if (zalogowany === true) {
        res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SHOW</title>
            <style>
            body{
                background-color: rgb(48, 33, 83);
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
                color:white;
            }
            a{
                color:white;
            }
            .tabele{
                display: flex;
                justify-content: space-around;
                width: 180px;
                margin-bottom: 0px;
                
            }
            .sort{
                margin-top:20px;
                width:100%;
            }
            .sort td{
                border: 1px solid red;
                height:30px;
                width:200px;
            }
            </style>
        </head>
        <body>
            <div class="adminGlowny">
                <div class='tabele'>
                    <a href="/sort">sort</a>
                    <a href="/gender">gender</a>
                    <a href="/show">show</a>
                </div>
                <table class='sort'>
                    ${tabelkaShow}
                </table>
            </div>
        </body>
        </html>`)
    } else {
        res.sendFile(__dirname + '/static/admin.html')

    }
})
//gender
app.get('/gender', function (req, res) {
    tabelaK = ''
    tabelaM = ''
    k = []
    m = []
    tab.filter(function (tab) {
        if (tab.plec == 'K') {
            k.push(tab)
        } else {
            m.push(tab)
        }
    })
    posortowanek = k.sort(function (a, b) {
        return parseFloat(a.id) - parseFloat(b.id);
    });
    posortowanem = m.sort(function (a, b) {
        return parseFloat(a.id) - parseFloat(b.id);
    });
    posortowanek.filter(function (tab) {
        wierszk = `<tr><td>ID: ${tab.id} </td><td>Płeć: ${tab.plec} </td></tr>`
        tabelaK += wierszk

    })
    posortowanem.filter(function (tab) {
        wierszm = `<tr><td>ID: ${tab.id} </td><td>Płeć: ${tab.plec} </td></tr>`
        tabelaM += wierszm

    })
    if (zalogowany === true) {
        res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SHOW</title>
            <style>
            body{
                background-color: rgb(48, 33, 83);
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
                color:white;
            }
            a{
                color:white;
            }
            .tabele{
                display: flex;
                justify-content: space-around;
                width: 180px;
                margin-bottom: 0px;
                
            }
            .kobiety, .mezczyzni{
                margin-top:20px;
                width:100%;
            }
            .kobiety td, .mezczyzni td{
                border: 1px solid red;
                height:30px;
                width:200px;
            }
            </style>
        </head>
        <body>
            <div class="adminGlowny">
                <div class='tabele'>
                    <a href="/sort">sort</a>
                    <a href="/gender">gender</a>
                    <a href="/show">show</a>
                </div>
                <table class='kobiety'>
                    ${tabelaK}
                </table>
                <table class='mezczyzni'>
                    ${tabelaM}
                </table>
            </div>
        </body>
        </html>`)
    } else {
        res.sendFile(__dirname + '/static/admin.html')
    }

})
//sort
app.get('/sort', function (req, res) {
    tabelkaShow = ''
    sortuj = tab.sort(function (a, b) {
        return parseFloat(a.id) - parseFloat(b.id);
    });
    sortuj.filter(function (tab) {
        wers = `<tr>
            <td>ID: ${tab.id}</td>
            <td>User: ${tab.login} - ${tab.password} </td>
            <td>Wiek: ${tab.wiek}</td>
        </tr>`
        tabelkaShow += wers
    })

    if (zalogowany === true) {
        res.send(`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SHOW</title>
            <style>
            body{
                background-color: rgb(48, 33, 83);
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
                color:white;
            }
            a{
                color:white;
            }
            .tabele{
                display: flex;
                justify-content: space-around;
                width: 180px;
                margin-bottom: 0px;
                
            }
            .sort{
                margin-top:20px;
                width:100%;
            }
            .sort td{
                border: 1px solid red;
                height:30px;
                width:200px;
            }
            .r, .m{
                margin-top:20px;
            }
            </style>
        </head>
        <body>
            <div class="adminGlowny">
                <div class='tabele'>
                    <a href="/sort">sort</a>
                    <a href="/gender">gender</a>
                    <a href="/show">show</a>
                </div>
                <form method="POST" onchange="this.submit()"> 
                    <label>
                        <input class="r" value="rosnaco" type="radio" name="sort" checked > <label for="rosnaco">rosnąco</label>
                        <input class="m" value="malejaco" type="radio" name="sort" ><label for="malejaco">malejąco</label>
                    </label>
                </form>
                <table class='sort'>
                    ${tabelkaShow}
                </table>
            </div>
        </body>
        </html>`)
    } else {
        res.sendFile(__dirname + '/static/admin.html')

    }
})
app.post('/sort', function (req, res) {
    if (req.body.sort == 'rosnaco') {
        tabelkaShow = ''
        sortuj = tab.sort(function (a, b) {
            return parseFloat(a.wiek) - parseFloat(b.wiek);
        });
        sortuj.filter(function (tab) {
            wers = `<tr>
            <td>ID: ${tab.id}</td>
            <td>User: ${tab.login} - ${tab.password} </td>
            <td>Wiek: ${tab.wiek}</td>
        </tr>`
            tabelkaShow += wers
        })
        if (zalogowany === true) {
            res.send(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>SORT - rosnąco/</title>
                <style>
                body{
                    background-color: rgb(48, 33, 83);
                    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
                    color:white;
                }
                a{
                    color:white;
                }
                .tabele{
                    display: flex;
                    justify-content: space-around;
                    width: 180px;
                    margin-bottom: 0px;
                    
                }
                .sort{
                    margin-top:20px;
                    width:100%;
                }
                .sort td{
                    border: 1px solid red;
                    height:30px;
                    width:200px;
                }
                .r, .m{
                    margin-top:20px;
                }
                </style>
            </head>
            <body>
                <div class="adminGlowny">
                    <div class='tabele'>
                        <a href="/sort">sort</a>
                        <a href="/gender">gender</a>
                        <a href="/show">show</a>
                    </div>
                    <form method="POST" onchange="this.submit()"> 
                        <label>
                            <input class="r" value="rosnaco" type="radio" name="sort" checked > <label for="rosnaco">rosnąco</label>
                            <input class="m" value="malejaco" type="radio" name="sort" ><label for="malejaco">malejąco</label>
                        </label>
                    </form>
                    <table class='sort'>
                        ${tabelkaShow}
                    </table>
                </div>
            </body>
            </html>`)
        } else {
            res.sendFile(__dirname + '/static/admin.html')

        }
    }
    if (req.body.sort == 'malejaco') {
        tabelkaShow = ''
        sortuj = tab.sort(function (a, b) {
            return parseFloat(b.wiek) - parseFloat(a.wiek);
        });
        sortuj.filter(function (tab) {
            wers = `<tr>
            <td>ID: ${tab.id}</td>
            <td>User: ${tab.login} - ${tab.password} </td>
            <td>Wiek: ${tab.wiek}</td>
        </tr>`
            tabelkaShow += wers
        })
        if (zalogowany === true) {
            res.send(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>SORT - malejąco</title>
                <style>
                body{
                    background-color: rgb(48, 33, 83);
                    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
                    color:white;
                }
                a{
                    color:white;
                }
                .tabele{
                    display: flex;
                    justify-content: space-around;
                    width: 180px;
                    margin-bottom: 0px;
                    
                }
                .sort{
                    margin-top:20px;
                    width:100%;
                }
                .sort td{
                    border: 1px solid red;
                    height:30px;
                    width:200px;
                }
                .r, .m{
                    margin-top:20px;
                }
                </style>
            </head>
            <body>
                <div class="adminGlowny">
                    <div class='tabele'>
                        <a href="/sort">sort</a>
                        <a href="/gender">gender</a>
                        <a href="/show">show</a>
                    </div>
                    <form method="POST" onchange="this.submit()"> 
                        <label>
                            <input class="r" value="rosnaco" type="radio" name="sort" > <label for="rosnaco">rosnąco</label>
                            <input class="m" value="malejaco" type="radio" name="sort" checked ><label for="malejaco">malejąco</label>
                        </label>
                    </form>
                    <table class='sort'>
                        ${tabelkaShow}
                    </table>
                </div>
            </body>
            </html>`)
        } else {
            res.sendFile(__dirname + '/static/admin.html')
        }

    }
})
app.get('/wyloguj', function (req, res) {
    zalogowany = false
    res.redirect('/admin.html')
})

