// controllers/propertyController.js
const Property = require('../models/Property');

exports.listProperties = async (req, res, next) => {
  let query = {};
  
  // Manejar filtros
  if (req.query.propertyType) {
    query.propertyType = req.query.propertyType;
  }
  
  if (req.query.roomType) {
    query.roomType = req.query.roomType;
  }
  
  if (req.query.bedrooms) {
    query.bedrooms = req.query.bedrooms;
  }

  if (req.query.name) {
    query.name = {
      $regex: new RegExp(req.query.name, "i")  // i para insensible a mayúsculas y minúsculas
    };
  }

  // Paginación
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const total = await Property.countDocuments(query);
  const properties = await Property.find(query).skip(skip).limit(limit);
    
  res.json({
    total,
    page,
    pages: Math.ceil(total / limit),
    limit,
    properties
  });
};
