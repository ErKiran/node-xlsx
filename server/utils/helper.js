const XLSX = require("xlsx");

function xlsxToJson(path) {
    const wb = XLSX.readFile(path);
    const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    const columnsArray = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 })[0];
    return [data, columnsArray];
}

function jsonToXLSX(data) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, "Order Summary");
    return wb
}

function validateExcelFile(requestHeaders) {
    const expectedHeaders = [
        'Date',
        'Order Number',
        'Product',
        'Brand',
        'Rate ',
        'Quantity',
        'Gross Amount',
        'Location'
    ]
    if(!requestHeaders){
        return {
            success: false,
            msg: `File doesn't have any headers. Please check the file`,
        }
    }
    const missingHeaders = expectedHeaders.filter(header => requestHeaders.indexOf(header) === -1);
    if (missingHeaders.length > 0) {
        return {
            success: false,
            msg: `Missing headers: ${missingHeaders.join(', ')}`,
        }
    }
    return {
        success: true,
    }
}

function preprocessDataForDB(data) {
    const dbObject = [];
    data.forEach(e => {
        dbObject.push({
            product: e['Product'],
            order_number: e['Order Number'],
            rate: e['Rate '],
            quantity: e['Quantity'],
            brand: e['Brand'],
            location: e['Location'],
            date: new Date(e['Date']),
        })
    })
    return dbObject
}

function validateFile(file) {
    try {
        const fileExtension = file.name.split('.').pop();
        if (fileExtension !== 'xlsx') {
            return {
                success: false,
                msg: 'Only .xlsx file is allowed',
            }
        }
        return {
            success: true,
        }
    } catch (err) {
        throw new Error(`Can't validate File Extension ${err}`);
    }
}

module.exports = {
    xlsxToJson,
    preprocessDataForDB,
    validateFile,
    validateExcelFile,
    jsonToXLSX,
}