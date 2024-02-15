if (process.env["APIURL"] == undefined) {
    require("dotenv").config({path:".env"})
}

const express = require("express")
const app = express()
app.use(require("cookie-parser")())

app.get("/", (req, res) => {
    var date = new Date()
    res.cookie("authused", "0", {maxAge: date.getTime()+315532800000})
    res.cookie("authkey", "", {maxAge: date.getTime()+315532800000})
    res.sendFile(__dirname + "/index.html")
})

app.get("/search", (req,res) => {
    let main = ""
    const start = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Search</title>
    </head>
    <body>
    <header>
        <a href="/"><img src="/logo"></a><br>
    </header>
    <h1>Search</h1>
    <div>
    `
    const end = `
    </div><br><br>
    <footer>Made by Stoppedwumm</footer>
    </body>
    <script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
    </html>`

    main = main + start
    if (req.cookies["authused"] == "0" || req.cookies["authused"] == undefined) {
        fetch(process.env["APIURL"] + "?apikey=" + process.env["APIKEY"] + "&q=" + encodeURIComponent(req.query["term"]) + "&language=en").then((value) => {
            value.json().then((jsonvalue) => {
                console.log(jsonvalue)
                main = main + `
                <p>${jsonvalue.totalResults} Results found</p>
                `
                jsonvalue.results.forEach((ivalue) => {
                    let loadedValue = `
                    <div>
                        <h2>${ivalue.title}</h2>
                        <img src="${ivalue.image_url}" width="500"><br>
                        <p>${ivalue.description}</p>
                        <a href="${ivalue.link}" target="_blank" rel="noopener noreferrer">Zum Artikel</a><br>
                        <a href="${ivalue.source_url}" target="_blank" rel="noopener noreferrer">Fetched from ${ivalue.source_id}</a><br>
                    </div>
                    `
                    main = main + loadedValue
                })
                main = main + end
                res.send(main)
            })
        })
    } else {
        fetch(process.env["APIURL"] + "?apikey=" + req.cookies.authkey + "&q=" + encodeURIComponent(req.query["term"]) + "&language=en").then((value) => {
            value.json().then((jsonvalue) => {
                console.log(jsonvalue)
                main = main + `
                <p>${jsonvalue.totalResults} Results found</p>
                `
                jsonvalue.results.forEach((ivalue) => {
                    let loadedValue = `
                    <div>
                        <h2>${ivalue.title}</h2>
                        <img src="${ivalue.image_url}" width="500"><br>
                        <p>${ivalue.description}</p>
                        <a href="${ivalue.link}" target="_blank" rel="noopener noreferrer">Zum Artikel</a><br>
                        <a href="${ivalue.source_url}" target="_blank" rel="noopener noreferrer">Fetched from ${ivalue.source_id}</a><br>
                    </div>
                    `
                    main = main + loadedValue
                })
                main = main + end
                res.send(main)
            }).catch((error) => {
                console.log("ERROR:", error)
                res.status(400).send(`
                ERROR: Api Key not avaible<br>
                <a href="/api/reset">Reset to normal values</a>
                `)
            })
        }).catch((error) => {
            console.log("ERROR:", error)
        })
    }
    

})

app.get("/set", (req,res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <body>
    <h1>Set API Key</h1>
    (You need a newsdata.io API Key)
    <form method="get" action="/api/set">
    <input type="text" name="key" placeholder="API Key">
    <input type="submit" value="Set Key">
    </form>
    </body>
    <script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
    </html>
    `)
})

app.get("/api/set", (req, res) => {
    const apikey = req.query["key"]
    res.cookie("authused", "1")
    res.cookie("authkey", apikey)
    res.redirect("about:blank")
})

app.get("/logo", (req, res) => {
    res.type("png")
    res.sendFile(__dirname + "/assets/logo.png")
})

app.get("/api/reset", (req, res) => {
    var date = new Date()
    res.cookie("authused", "0", {maxAge: date.getTime()+315532800000})
    res.cookie("authkey", "", {maxAge: date.getTime()+315532800000})
    res.redirect("/")
})

app.listen(3000)