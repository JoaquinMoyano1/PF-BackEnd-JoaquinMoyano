const createCustomError = (code, message) => {
    const error = new Error(message);
    error.code = code;
    return error;
  };
  
  const errorDictionary = {
    PRODUCT_CREATION_ERROR: {
      status: 400,
      message: 'Error creating product. Please provide all required fields.'
    },
    ADD_TO_CART_ERROR: {
      status: 400,
      message: 'Error adding product to cart. Please provide all required fields.'
    },
    // Otros errores comunes
  };
  
  module.exports = {
    createCustomError,
    errorDictionary
  };
  