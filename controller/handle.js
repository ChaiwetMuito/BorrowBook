const logger = require('../util/logger.js');
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
        let functionName = '[allBook]' //ชื่อ function
        var request = new sql.Request();
        // sql command
        var command = `SELECT *
        FROM dblibrary.dbo.Stock s 
        WHERE s.isbn = ${req.bookId};`
        var data = await request.query(command)
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
        var request = new sql.Request();
        // sql command
        var command = `SELECT s.Book_Name, sr.status_Return 
        FROM dblibrary.dbo.[Member] m LEFT JOIN dblibrary.dbo.History h ON m.Nation_ID = h.Nation_ID LEFT JOIN dblibrary.dbo.Stock s ON h.isbn = s.isbn LEFT JOIN dblibrary.dbo.StatusReturn sr ON sr.Status_ID = h.Status_ID 
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
        var command = `INSERT INTO dblibrary.dbo.Stock 
        (isbn, Book_Name)
        VALUES(${req.bookId}, '${req.bookName}'); `
        await request.query(command)
        var data = await this.queryBookById(req)
        var message = {
            "status_code": 200,
            "status": "add book success",
            "message": data.message
        }
        logger.info(message.status)
        return message
    }
    async queryMemberById(req){
        let functionName = '[queryMemberById]' //ชื่อ function
        var request = new sql.Request();
        // sql command
        var command = `SELECT *
        FROM dblibrary.dbo.[Member] m
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
        var command = `INSERT INTO dblibrary.dbo.[Member]
        (Nation_ID, FName, LName, Mem_Sex, Mem_Phone, Mem_Address, Mem_Email)
        VALUES(${req.memberId}, '${req.Fname}','${req.Lname}','${req.sex}','${req.phone}','${req.address}','${req.mail}'); `
        await request.query(command)
        var data = await this.queryMemberById(req)
        var message = {
            "status_code": 200,
            "status": "add Member success",
            "message": data.message
        }
        logger.info(message.status)
        return message
    }
    async queryCountHistory(req){
        let functionName = '[queryHistory]' //ชื่อ function
        var request = new sql.Request();
        // sql command
        var command = `SELECT COUNT(*) as numberOfBook 
        FROM dblibrary.dbo.[Member] m LEFT JOIN dblibrary.dbo.History h ON m.Nation_ID = h.Nation_ID LEFT JOIN dblibrary.dbo.Stock s ON h.isbn = s.isbn LEFT JOIN dblibrary.dbo.StatusReturn sr ON sr.Status_ID = h.Status_ID 
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
        var request = new sql.Request();
        // sql command
        var command = `SELECT *
        FROM dblibrary.dbo.History h
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
        logger.debug(checkHistory.message[0].numberOfBook)
        if(checkHistory.message[0].numberOfBook >= 5){
            var message = {
                "status_code": 400,
                "status": "You cannot borrow the book because you borrow more than 5 books.",
                "message": "You cannot borrow the book because you borrow more than 5 books."
            }
            logger.info(message.status)
            return message
        }
        // sql command
        var command = `INSERT INTO dblibrary.dbo.History
        (History_ID, Nation_ID, isbn, Status_ID)
        VALUES('${req.historyId}', '${req.memberId}', '${req.bookId}', 'ST02'); `
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
        var command = `UPDATE dblibrary.dbo.History 
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