const XLSX = require("xlsx");

function xlsxToJson(path) {
    var wb = XLSX.readFile(path);
    data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    return data
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
            date: e['Date'],
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
}