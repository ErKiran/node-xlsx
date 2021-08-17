const fs = require('fs');
const formidable = require('formidable');

const { xlsxToJson, preprocessDataForDB, validateFile, validateExcelFile } = require('../utils/helper');
const { create } = require('../repository/order');

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
    if (!start && !end) {
        return res.json({
            success: false,
            msg: 'Start and End date should be provided',
        });
    }
}


module.exports = {
    populateExcelDataToDB,
}