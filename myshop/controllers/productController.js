const Product = require('../models/product');

exports.getProducts = async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;
        limit = parseInt(limit);
        page = parseInt(page);
        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
        const queryOption = query ? { $or: [{ category: query }, { available: query === 'true' }] } : {};

        const products = await Product.find(queryOption)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalProducts = await Product.countDocuments(queryOption);
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
