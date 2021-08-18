const fs = require('fs');
const formidable = require('formidable');
const XLSX = require('xlsx');

const { xlsxToJson, preprocessDataForDB, validateFile, validateExcelFile, jsonToXLSX } = require('../utils/helper');
const { create, filter } = require('../repository/order');

async function populateExcelDataToDB(req, res) {
    try {
        const form = new formidable.IncomingForm({});
        form.parse(req);
        let filePath
        form.on('fileBegin', async (name, file) => {
            const isValidFormat = validateFile(file);
            if (!isValidFormat.success) {
                return res.json(isValidFormat);
            }
            form.on('file', async (name, fileData) => {
                const sizeInMB = (fileData.size) / 1000000;
                if (sizeInMB >= 20) {
                    return res.json({
                        success: false,
                        msg: 'Maximum file Size is 20MB',
                    });
                }
                if (fileData) {
                    filePath = fileData.path;

                    const [excelToJson, headers] = xlsxToJson(filePath);
                    const validation = validateExcelFile(headers);
                    if (!validation.success) {
                        return res.json(validation);
                    }
                    const data = preprocessDataForDB(excelToJson);
                    if (data.length === 0) {
                        return res.json({
                            success: false,
                            msg: 'No data found in the excel file',
                        })
                    }
                    await create(data);
                    return res.json({
                        success: true,
                        msg: "Data Successfully Loaded in Database"
                    });
                }
            })

            form.on('end', () => {
                try {
                    fs.unlinkSync(filePath);
                } catch (err) {
                    throw new Error(err);
                }
            });
        })

        form.on('error', (msg) => {
            try {
                if (msg) {
                    return res.json({
                        success: false,
                        msg: 'Can\'t upload the file',
                    });
                }
            } catch (err) {
                throw new Error(`Error while uploading file ${err}`);
            }
        });
    } catch (err) {
        throw new Error(`Can't upload the File ${err}`);
    }
}

async function filterData(req, res) {
    const { start, end } = req.query;
    if (!start || !end) {
        return res.json({
            success: false,
            msg: 'Start and End date should be provided',
        });
    }
    const startDate = Date.parse(start);
    const endDate = Date.parse(end);

    if (isNaN(startDate) || isNaN(endDate)) {
        return res.json({
            success: false,
            msg: 'Start and End date should be date',
        });
    }

    if (endDate < startDate) {
        return res.json({
            success: false,
            msg: 'End Date should be greater than the start date',
        });
    }

    const data = await filter(start, end);

    const groupedBy = data.reduce(
        (group, order) => {
            if (!group[order.order_number]) {
                group[order.order_number] = []
            }
            group[order.order_number].push(order)
            return group
        },
        {},
    )

    const result = [];
    Object.keys(groupedBy).forEach(key => {
        const orderData = {}
        let totalAmount = 0;
        let totalQuantity = 0;
        const products = new Set()
        groupedBy[key].forEach(order => {
            totalAmount += order.rate * order.quantity;
            totalQuantity += order.quantity;
            products.add(order.product)
            orderData["Date"] = order.date;
            orderData["Order Number"] = order.order_number;
            orderData["Location"] = order.location;
        })
        orderData["Total Amount"] = totalAmount;
        orderData["Total Quantity"] = totalQuantity;
        orderData["Total Number of Products"] = products.size;
        result.push(orderData)
    })
    const workbook = jsonToXLSX(result)

    const fileName = "Summary.xlsx";
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    res.send(Buffer.from(wbout));

    res.end();
}


module.exports = {
    populateExcelDataToDB,
    filterData,
}