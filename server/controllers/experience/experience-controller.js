const dbFunctions = require('./index');

// controllers/address/index.js

// Function to get all experiences using the dbFunctions and return the repsonse to clientside
exports.getAllExperiences = (req, res) => {
  dbFunctions.search('')
      .then((addresses) => {
          res.status(200).json({
              message: "Experience details",
              data: addresses,
          });
      })
      .catch((error) => {
          res.status(400).json({
              message: "Error getting experience details",
              error: error.message,
          });
      });
};

// Function to create a new address 
exports.createExperience = (req, res) => {
  try {
      const { line1, line2, city, state, zip } = req.body;
      dbFunctions.add({ line1, line2, city, state, zip })
          .then((id) => {
              // Logic to create a new address
              res.status(201).json({
                  message: "experience created successfully",
                  addressId: id,
              });
          })
      } catch (error) {
      res.status(400).json({
          message: "Error creating experience",
          error: error.message,
      });
    }
  };
  
// Function to get address by search keywords
exports.getExperienceBySearchString = (req, res) => {
  const searchTerm = req.query.q;
  dbFunctions.search(searchTerm)
      .then((addresses) => {

          res.status(200).json({
              message: "Experience details",
              data: addresses,
          });
      })
      .catch((error) => {
          res.status(400).json({
              message: "Error getting experience details",
              error: error.message,
          });
      });
};
  
// Function to update address details by id
exports.updateExperience = (req, res) => {
  try {
    dbFunctions.update(req.params.id, req.body)
        .then(() => {
            res.status(200).json({
                message: "Experience updated successfully",
            });
        })
    } catch (error) {
      res.status(400).json({
          message: "Error updating experience",
          error: error.message,
      });
  }
};
  
// Function to delete address by id
exports.deleteExperience = (req, res) => {
  try {
    dbFunctions.delete(req.params.id)
        .then(() => {
            res.status(200).json({
                message: "Experience deleted successfully",
            });
        })
    } catch (error) {
      res.status(400).json({
          message: "Error deleting experience",
          error: error.message,
      });
    }
};
