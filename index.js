if (process.env["APIURL"] == undefined) {
    require("dotenv").config({path:".env"})
}

const express = require("express")
const app = express()

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/search", (req,res) => {
    let main = ""
    const start = `<html>
    <head>
        <title>Search</title>
    </head>
    <body>
        <h1>Search</h1>
        <div>
    
    `
    const end = `
    </div>
    </body>
    </html>`

    main = main + start
    fetch(process.env["APIURL"] + "?apikey=" + process.env["APIKEY"] + "&q=" + encodeURIComponent(req.query["term"]) + "&language=en").then((value) => {
        console.log(process.env["APIURL"] + "?apikey=" + process.env["APIKEY"] + "&q=" + req.query["term"] + "%language=en")
        value.json().then((jsonvalue) => {
            jsonvalue.results.forEach((ivalue) => {
                let loadedValue = `
                <div>
                    <h2>${ivalue.title}</h2>
                    <img src="${ivalue.image_url}" width="500"><br>
                    <p>${ivalue.description}</p>
                    
                </div>
                `
                main = main + loadedValue
            })
            main = main + end
            res.send(main)
        })
    })
    

})

app.listen(3000)