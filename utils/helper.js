const XLSX = require("xlsx");

function xlsxToJson() {
    var wb = XLSX.readFile("Technical Assessment Sample File.1629087547.xlsx");
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

module.exports = {
    xlsxToJson,
    preprocessDataForDB,
}