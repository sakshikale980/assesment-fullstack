import db from '../models/index.js';
const { Product, Category, Op } = db;
import ExcelJS from 'exceljs';
import fs from 'fs';

const addProduct = async (payload) => await Product.create(payload);

const updateProduct = async (payload, id) => await Product.update(payload, { where: { id } });

const getProducts = async ({
    pageSize,
    pageNumber,
    sortBy,
    order,
    search,
    category
}) => {

    const limit = Number(pageSize) || 10;
    const page = Number(pageNumber) || 1;
    const offset = (page - 1) * limit;

    const where = { deleted: false };

    if (search) {
        where.name = { [Op.iLike]: `%${search}%` };
    }

    const categoryFilter = {};
    if (category) {
        categoryFilter[Op.or] = [
            { name: category },
            { id: category }
        ];
    }

    return await Product.findAndCountAll({
        where,
        include: [
            {
                model: Category,
                where: category ? categoryFilter : undefined,
                required: !!category
            }
        ],
        order: [[sortBy || "created_at", (order || "desc").toUpperCase()]],
        limit,
        offset
    });
};

const processExcelFile = async (filePath) => {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const sheet = workbook.worksheets[0];

        const rows = [];
        sheet.eachRow((row, rowIndex) => {
            if (rowIndex === 1) return;
            rows.push({
                name: row.getCell(1).value,
                price: row.getCell(2).value,
                category: row.getCell(3).value,
                description: row.getCell(4).value,
                imageUrl: row.getCell(5).value
            });
        });

        for (const row of rows) {
            if (!row.name || !row.price || !row.category) continue;

            const categoryName = String(row.category).trim().toLowerCase();


            let categoryRecord = await Category.findOne({
                where: db.Sequelize.where(
                    db.Sequelize.fn('lower', db.Sequelize.col('name')),
                    categoryName
                )
            });

            if (!categoryRecord) {
                categoryRecord = await Category.create({ name: row.category });
            }

            await Product.create({
                name: row.name,
                price: row.price,
                category_id: categoryRecord.id,
                description: row.description || null,
                image_url: row.imageUrl || null
            });
        }
        console.log("Excel imported successfully");

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("delete", filePath);
        }
    } catch (err) {
        console.error("-------processExcelFile-err--------", err);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("delete", filePath);
        }
    }
};

export const generateProductReport = async (res) => {
    try {
        const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            stream: res,
        });

        const sheet = workbook.addWorksheet("Products");

        sheet.addRow(["Name", "Price", "Category", "Description"]).commit();

        const limit = 500;
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
            const { rows } = await Product.findAndCountAll({
                where: { deleted: false },
                include: [{ model: Category, attributes: ["name"] }],
                limit,
                offset,
                raw: true,
                nest: true
            });

            if (rows.length === 0) {
                hasMore = false;
                break;
            }

            rows.forEach(row => {
                const excelRow = sheet.addRow([
                    row.name,
                    Number(row.price),
                    row.Category?.name || "",
                    row.description || "",
                ]);

                excelRow.getCell(2).numFmt = "0.00";
                excelRow.commit();
            });

            offset += limit;
        }

        await workbook.commit();
    } catch (err) {
        console.error("-------Generate ProductReport Error:-----------", err);
    }
};


export default {
    addProduct,
    updateProduct,
    getProducts,
    processExcelFile,
    generateProductReport
};