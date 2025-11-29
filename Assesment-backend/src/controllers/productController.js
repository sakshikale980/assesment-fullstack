import productService from '../services/product.service.js';
const { addProduct, getProducts, processExcelFile, generateProductReport, updateProduct } = productService;

const handleGetProducts = async (req, res) => {
  try {
    const { sortBy, order, search, category } = req.query;

    const { pageSize, pageNumber } = req.body;

    const result = await getProducts({
      pageSize,
      pageNumber,
      sortBy,
      order,
      search,
      category
    });

    return res.json({
      count: result.count,
      rows: result.rows
    });

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const handleAddProduct = async (req, res) => {
  try {
    const { category_id, name, image_url, price, description } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({ message: 'Name, price, and categoryId are required' });
    }
    const newProduct = await addProduct({ category_id, name, image_url, price, description });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const handleUpdateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const data = await updateProduct(req.body, id);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const uploadBulkProducts = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Upload Excel file" });
  }

  const filePath = req.file.path;

  setTimeout(() => processExcelFile(filePath), 10);

  return res.json({
    success: true,
    message: "File uploaded. Processing started in background.",
    file: req.file.originalname
  });
};

export const downloadProductReport = async (req, res) => {
  try {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=product_report.xlsx"
    );

    await generateProductReport(res);
  } catch (err) {
    console.error("Download failed:", err);
    return res.status(500).json({ message: "Unable to export report" });
  }
};

export { handleGetProducts, handleAddProduct, handleUpdateProduct };
