const express = require("express");
const app = express();
const port = 3004
const mysql = require("./connection").con

//configuration
app.set("view engine", "hbs")
app.set("views", "./view")
app.use(express.static(__dirname + "/public"))



//Routing

app.get("/",(req,res)=>{
    res.render("index");
   })
app.get("/addd",(req,res)=>{
 res.render("addd");
});

app.get("/search",(req,res)=>{
    res.render("search");
   });

app.get("/update",(req,res)=>{
    res.render("update");
   });
   
app.get("/delete",(req,res)=>{
    res.render("delete");
   });

   app.get("/view", (req, res) => {
    let qry = "select * from student_data ";
    mysql.query(qry, (err, results) => {
        if (err) throw err
        else {
            res.render("view", { data: results });
        }

    });

});


   app.get("/addstudent", (req, res) => {
    // fetching data from form
    const { name, phone, email, gender,city } = req.query

    // Sanitization XSS...
    let qry = "select * from student_data where email=? or gender=?";
    mysql.query(qry, [email, phone], (err, results) => {
        if (err)
            throw err
        else {

            if (results.length > 0) {
                res.render("addd", { checkmesg: true })
            } else {

                // insert query
                let qry2 = "insert into student_data values(?,?,?,?,?)";
                mysql.query(qry2, [name, phone, email, gender,city], (err, results) => {
                    if (results.affectedRows > 0) {
                        res.render("addd", { mesg: true })
                    }
                })
            }
        }
    })
});



//search 

app.get("/searchstudent", (req, res) => {
    // fetch data from the form


    const { phone } = req.query;

    let qry = "select * from student_data where phone=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("search", { mesg1: true, mesg2: false })
            } else {

                res.render("search", { mesg1: false, mesg2: true })

            }

        }
    });
})




app.get("/updatesearch", (req, res) => {

    const { phone } = req.query;

    let qry = "select * from student_data where phone=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("update", { mesg1: true, mesg2: false, data: results })
            } else {

                res.render("update", { mesg1: false, mesg2: true })

            }

        }
    });
})



app.get("/updatestudent", (req, res) => {
    // update data

    const { phone, name, gender } = req.query;
    let qry = "update student_data set name=?, gender=?,city=? where phone=?";

    mysql.query(qry, [name, gender, phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("update", { umesg: true })
            }
        }
    })

});





app.get("/removestudent", (req, res) => {

    // fetch data from the form


    const { phone } = req.query;

    let qry = "delete from student_data where phone=?";
    mysql.query(qry, [phone], (err, results) => {
        if (err) throw err
        else {
            if (results.affectedRows > 0) {
                res.render("delete", { mesg1: true, mesg2: false })
            } else {

                res.render("delete", { mesg1: false, mesg2: true })

            }

        }
    });
});



//create server
app.listen(port,(err)=>{
    if(err)
        throw err
    else
    console.log("Server is running at port %d:", port);

});