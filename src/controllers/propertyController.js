const Property = require('../models/Property');

exports.listProperties = async (req, res, next) => {
  let queryDB = {};

  // Manejar filtros
  if (req.query.propertyType) {
    queryDB.property_type = req.query.propertyType;
  }

  if (req.query.roomType) {
    queryDB.room_type = req.query.roomType;
  }

  if (req.query.bedrooms) {
    queryDB.bedrooms = req.query.bedrooms;
  }

  if (req.query.name) {
    queryDB.name = {
      $regex: new RegExp(req.query.name, "i")  // i para insensible a mayúsculas y minúsculas
    };
  }

  // Paginación
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const total = await Property.countDocuments(queryDB);
  const properties = await Property.find(queryDB).skip(skip).limit(limit);

  res.json({
    total,
    page,
    pages: Math.ceil(total / limit),
    limit,
    properties
  });
};
