const logger = require('../util/logger.js');
var shortid = require('shortid');
const sql = require("mssql");
const moment = require('moment');
// config for your database
const config = {
    user: 'admin',
    password: 'db123456',
    server: 'database-1.crtqw6h2j01o.ap-southeast-1.rds.amazonaws.com',
    database: 'master'
};

// connect to database
var err = sql.connect(config)
if (err) console.log(err);

class request {
    

    async queryBookById(req){
        let functionName = '[queryBookById]' //ชื่อ function
        if( req.bookId == null || req.bookId == ""){
            var message = {
                "status_code": 400,
                "status": "Please complete all information.",
                "message": "Please complete all information."
            }
            logger.info(message.status)
            return message
        }
        var request = new sql.Request();
        // sql command
        var command = `SELECT *
        FROM db_Library.dbo.Stock s 
        WHERE s.isbn = ${req.bookId};`
        var data = await request.query(command)
        if(data.recordset[0] == null){
            var message = {
                "status_code": 400,
                "status": "Can't find the book",
                "message": "Can't find the book"
            }
            logger.info(message.status)
            return message
        }
        var message = {
            "status_code": 200,
            "status": "select book success",
            "message": data.recordset[0]
        }
        logger.info(message.status)
        return message
    }

    async queryHistory(req){
        let functionName = '[queryHistory]' //ชื่อ function
        if(req.memberId == null || req.memberId == ""){
            var message = {
                "status_code": 400,
                "status": "Please complete all information.",
                "message": "Please complete all information."
            }
            logger.info(message.status)
            return message
        }
        var request = new sql.Request();
        // sql command
        var command = `SELECT s.Book_Name, sr.status_Return 
        FROM db_Library.dbo.[Member] m LEFT JOIN db_Library.dbo.History h ON m.Nation_ID = h.Nation_ID LEFT JOIN db_Library.dbo.Stock s ON h.isbn = s.isbn LEFT JOIN db_Library.dbo.StatusReturn sr ON sr.Status_ID = h.Status_ID 
        WHERE m.Nation_ID = ${req.memberId};`
        var data = await request.query(command)
        var message = {
            "status_code": 200,
            "status": "query History success",
            "message": data.recordset
        }
        logger.info(message.status)
        return message
    }

    async addBook(req){
        let functionName = '[addBook]' //ชื่อ function
        if( req.bookId == null || req.bookName == null ||req.bookId == "" || req.bookName == ""){
            var message = {
                "status_code": 400,
                "status": "Please complete all information.",
                "message": "Please complete all information."
            }
            logger.info(message.status)
            return message
        }
        var request = new sql.Request();
        var checkBook = await this.queryBookById(req)
        //logger.debug(checkBook)
        if(checkBook.message != null){
            var message = {
                "status_code": 400,
                "status": "The book id is already in the system.",
                "message": "The book id is already in the system."
            }
            logger.info(message.status)
            return message
        }
        // sql command
        var command = `INSERT INTO db_Library.dbo.Stock 
        (isbn, Book_Name)
        VALUES(${req.bookId}, '${req.bookName}'); `
        await request.query(command)
        var data = await this.queryBookById(req)
        var message = {
            "status_code": 200,
            "status": "add book success",
            "message": "add book success"
        }
        logger.info(message.status)
        return message
    }
    async queryMemberById(req){
        let functionName = '[queryMemberById]' //ชื่อ function
        if(req.memberId == null || req.memberId == ""){
            var message = {
                "status_code": 400,
                "status": "Please complete all information.",
                "message": "Please complete all information."
            }
            logger.info(message.status)
            return message
        }
        var request = new sql.Request();
        // sql command
        var command = `SELECT *
        FROM db_Library.dbo.[Member] m
        WHERE m.Nation_ID = ${req.memberId};`
        var data = await request.query(command)
        var message = {
            "status_code": 200,
            "status": "select Member success",
            "message": data.recordset[0]
        }
        logger.info(message.status)
        return message
    }

    async addMember(req){
        let functionName = '[addMember]' //ชื่อ function
        if( req.sex.toLowerCase() != "male" && req.sex.toLowerCase() != "female"){
            var message = {
                "status_code": 400,
                "status": "Please enter gender, be male or female.",
                "message": "Please enter gender, be male or female."
            }
            logger.info(message.status)
            return message
        }
        if(req.Fname == null || req.Lname == null || req.memberId == null || req.sex == null || req.phone == null || req.address == null || req.mail == null||
            req.Fname == "" || req.Lname == "" || req.memberId == "" || req.sex == "" || req.phone == "" || req.address == "" || req.mail == ""){
            var message = {
                "status_code": 400,
                "status": "Please complete all information.",
                "message": "Please complete all information."
            }
            logger.info(message.status)
            return message
        }
        var request = new sql.Request();
        var checkMem = await this.queryMemberById(req)
        if(checkMem.message != null){
            var message = {
                "status_code": 400,
                "status": "The Member id is already in the system.",
                "message": "The Member id is already in the system."
            }
            logger.info(message.status)
            return message
        }
        // sql command
        var command = `INSERT INTO db_Library.dbo.[Member]
        (Nation_ID, FName, LName, Mem_Sex, Mem_Phone, Mem_Address, Mem_Email)
        VALUES(${req.memberId}, '${req.Fname}','${req.Lname}','${req.sex.toLowerCase()}','${req.phone}','${req.address}','${req.mail}'); `
        await request.query(command)
        var data = await this.queryMemberById(req)
        if(data.message != null){
            var message = {
                "status_code": 200,
                "status": "add Member success",
                "message": "Add Member success"
            }
        logger.info(message.status)
        return message
        }
    }
    async queryCountHistory(req){
        let functionName = '[queryHistory]' //ชื่อ function
        if(req.memberId == null || req.memberId == ""){
            var message = {
                "status_code": 400,
                "status": "Please complete all information.",
                "message": "Please complete all information."
            }
            logger.info(message.status)
            return message
        }
        var request = new sql.Request();
        // sql command
        var command = `SELECT COUNT(*) as numberOfBook 
        FROM db_Library.dbo.[Member] m LEFT JOIN db_Library.dbo.History h ON m.Nation_ID = h.Nation_ID LEFT JOIN db_Library.dbo.Stock s ON h.isbn = s.isbn LEFT JOIN db_Library.dbo.StatusReturn sr ON sr.Status_ID = h.Status_ID 
        WHERE m.Nation_ID = ${req.memberId} AND h.Status_ID = 'ST02'
        GROUP BY m.Nation_ID;`
        var data = await request.query(command)
        var message = {
            "status_code": 200,
            "status": "Count History success",
            "message": data.recordset
        }
        logger.info(message.status)
        return message
    }
    async checkBookHis(req, status){
        let functionName = '[checkBook]' //ชื่อ function
        if(req.bookId == null || req.bookId == ""){
            var message = {
                "status_code": 400,
                "status": "Please complete all information.",
                "message": "Please complete all information."
            }
            logger.info(message.status)
            return message
        }
        var request = new sql.Request();
        // sql command
        var command = `SELECT *
        FROM db_Library.dbo.History h
        WHERE h.isbn = ${req.bookId} AND h.Status_ID = '${status}';`
        var data = await request.query(command)
        var message = {
            "status_code": 200,
            "status": "select book success",
            "message": data.recordset[0]
        }
        logger.info(message.status)
        return message
    }

    async borrowBook(req){
        let functionName = '[borrowBook]' //ชื่อ function
        if(req.memberId == null ||  req.bookId == null || req.memberId == "" ||   req.bookId == ""){
            var message = {
                "status_code": 400,
                "status": "Please complete all information.",
                "message": "Please complete all information."
            }
            logger.info(message.status)
            return message
        }
        var request = new sql.Request();
        var checkBook = await this.queryBookById(req)
        logger.debug("checkBook")
        if(checkBook.message == null){
            var message = {
                "status_code": 400,
                "status": "The book id hasn't in the system.",
                "message": "The book id hasn't in the system."
            }
            logger.info(message.status)
            return message
        }
        //checkmem
        var checkMem = await this.queryMemberById(req)
        logger.debug("checkMem")
        if(checkMem.message == null){
            var message = {
                "status_code": 400,
                "status": "The Member id hasn't in the system.",
                "message": "The Member id hasn't in the system."
            }
            logger.info(message.status)
            return message
        }
        //check book is not borrow
        var status = "ST02"
        var checkBookHis = await this.checkBookHis(req, status)
        logger.debug("check book is not borrow")
        if(checkBookHis.message != null){
            var message = {
                "status_code": 400,
                "status": "Books have been borrowed in the system.",
                "message": "Books have been borrowed in the system."
            }
            logger.info(message.status)
            return message
        }
        //checkHistory
        var checkHistory = await this.queryCountHistory(req)
        logger.debug(checkHistory)
        //logger.debug(checkHistory.message[0].numberOfBook)
        if(checkHistory.message[0] != null){
            if( checkHistory.message[0].numberOfBook >= 5  ){
                var message = {
                    "status_code": 400,
                    "status": "You cannot borrow the book because you borrow more than 5 books.",
                    "message": "You cannot borrow the book because you borrow more than 5 books."
                }
                logger.info(message.status)
                return message
            }
        }
        // sql command
        var command = `INSERT INTO db_Library.dbo.History
        (History_ID, Nation_ID, isbn, Status_ID)
        VALUES('${shortid.generate()}', '${req.memberId}', '${req.bookId}', 'ST02'); `
        await request.query(command)
        //var data = await this.queryHistory(req)
        var message = {
            "status_code": 200,
            "status": "borrow Book success",
            "message": "borrow Book success"
        }
        logger.info(message.status)
        return message
    }

    async returnBook(req){
        let functionName = '[returnBook]' //ชื่อ function
        if( req.memberId == null || req.bookId == null || req.memberId == "" || req.bookId == ""){
            var message = {
                "status_code": 400,
                "status": "Please complete all information.",
                "message": "Please complete all information."
            }
            logger.info(message.status)
            return message
        }
        var request = new sql.Request();
        var checkBook = await this.queryBookById(req)
        if(checkBook.message == null){
            var message = {
                "status_code": 400,
                "status": "The book id id hasn't in the system.",
                "message": "The book id id hasn't in the system."
            }
            logger.info(message.status)
            return message
        }
        //checkmem
        var checkMem = await this.queryMemberById(req)
        if(checkMem.message == null){
            var message = {
                "status_code": 400,
                "status": "The Member id hasn't in the system.",
                "message": "The Member id hasn't in the system."
            }
            logger.info(message.status)
            return message
        }
        //check book has been borrowed
        var status = "ST02"
        var checkBookHis = await this.checkBookHis(req, status)
        logger.debug("check book has been borrowed")        
        if(checkBookHis.message == null){
            var message = {
                "status_code": 400,
                "status": "Books have not been borrowed in the system.",
                "message": "Books have not been borrowed in the system."
            }
            logger.info(message.status)
            return message
        }
        // sql command
        var command = `UPDATE db_Library.dbo.History 
        SET Status_ID= 'ST01' 
        WHERE Nation_ID='${req.memberId}' AND isbn='${req.bookId}'; `
        await request.query(command)
        //var data = await this.queryMemberById(req)
        var message = {
            "status_code": 200,
            "status": "return book success",
            "message": "return book success"
        }
        logger.info(message.status)
        return message
    }


    





}
module.exports = request 